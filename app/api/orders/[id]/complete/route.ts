import { NextResponse, type NextRequest } from 'next/server';
import { Product, Order, OrderItem, AdminLinkedProduct, Provider, Card, User, Customer, EmailTemplate } from '@/database/models';
import { createProviderService } from '@/services/ProviderService';
import { v4 as uuid } from 'uuid';
import { sendOrderFulfillmentEmail } from '@/lib/mail';
import { createStoreService } from '@/services/StoreService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import moment from 'moment';
import { Op } from 'sequelize';
import { countryCodes, defaultMaxOrders, defaultPriceLimit } from '@/constants';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const orderId = Number(id);
    const order = await Order.findByPk(orderId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      include: [
        {
          model: OrderItem,
          required: true,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
          include: [
            {
              model: Product,
              required: true,
              attributes: ['id', 'price'],
              include: [{ model: AdminLinkedProduct, attributes: ['provider_id', 'provider_product_id', 'min_price'], required: false }]
            },
            {
              model: Card,
              attributes: ['id', 'card_number', 'pin_code', 'claim_url'],
              required: false,
            }
          ],
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'access_token', 'provider', 'manager_token', 'metadata'],
          include: [
            {
              model: EmailTemplate,
              required: false,
              attributes: {
                exclude: ['id', 'user_id', 'created_at', 'updated_at'],
              },
            }
          ]
        },
        {
          model: Customer,
          required: false,
          attributes: ['id', 'name', 'email'],
        }
      ],
    });

    if (!order || !order.User) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (authenticatedUser.role !== 'admin' && authenticatedUser.id !== order.User.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (order.status !== 'approved') {
      return NextResponse.json({ error: 'Order could be completed. Invalid order status' }, { status: 400 });
    }

    const orderItems = order?.OrderItems;

    if (!orderItems?.every(orderItem => orderItem?.Product?.AdminLinkedProducts?.length)) {
      await order?.User?.createLog({ action: `Order [${order.id}] could not be completed`, details: 'Some items in the order are not linked with a provider\'s product by the admin', status: 'failed', type: 'order_complete' });
      return NextResponse.json({ error: "Order could be completed for some reasons. Please check logs." }, { status: 400 });
    }
    const itemsWithoutCards = orderItems?.filter(orderItem => !orderItem?.Cards?.length || orderItem?.Cards?.length < orderItem?.quantity || orderItem?.status !== 'success');
    const quantityLimit = 2;
    let orderFulfilled = true;
    for (const orderItem of itemsWithoutCards) {
      const { Product } = orderItem;
      const adminLinkedProduct = Product?.AdminLinkedProducts;
      const LowestPricedProvider = adminLinkedProduct?.length === 1 ? adminLinkedProduct?.[0] : adminLinkedProduct?.reduce((initial, linkedProduct) =>
        (Number(linkedProduct?.min_price) < Number(initial?.min_price) ? linkedProduct : initial));

      const price = Number(LowestPricedProvider?.min_price);
      if (Number(Product?.price) < price) {
        await order?.User?.createLog({ action: `Order [${order.id}] could not be completed`, details: 'The product\'s actual price from provider is higher than the manual admin price', status: 'failed', type: 'order_complete' });
        return NextResponse.json({ error: "Order could not be completed for some reasons. Please check logs." }, { status: 400 });
      }

      const provider = await Provider.findByPk(Number(LowestPricedProvider?.provider_id));
      let providerService = null;
      try {
        providerService = await createProviderService(provider);
      } catch (error) {
        console.log('Error in creating provider service: ', error);
        await order?.User?.createLog({ action: `Order [${order.id}] could not be completed. Failed to initialize ${provider?.name} provider`, details: error?.toString(), status: 'failed', type: 'order_complete' });
        return NextResponse.json({ error: 'Order could not be completed for some reasons. Please check logs.' }, { status: 500 });
      }
      const sku = Number(LowestPricedProvider?.provider_product_id);
      try {
        let quantity = Math.max(orderItem?.quantity - (orderItem?.Cards?.length ?? 0), 0);
        if (quantity === 0) {
          await orderItem?.update({ status: "success" });
          continue;
        }
        let allItemsBought = true;
        const checkAvailability = await providerService?.checkAvailability({ sku, item_count: quantity, price });
        if (checkAvailability && checkAvailability?.delivery_type === 1) {
          while (quantity > 0) {
            await new Promise(resolve => setTimeout(resolve, 1050));
            const reference_code = uuid();
            const currentQuantity = Math.min(quantity, quantityLimit);
            try {
              const orderResponse = await providerService?.createOrder({ sku, quantity: currentQuantity, pre_order: false, price, delivery_type: 1, destination: "hassankasuri0@gmail.com", reference_code });
              if (orderResponse && orderResponse.status === 1) {
                const cards = await providerService?.fetchCardInformation(reference_code);
                if (cards && cards.results.length === currentQuantity) {
                  await Promise.all(cards?.results?.map((card: any) => orderItem?.createCard({ card_number: card?.card_number, pin_code: card?.pin_code, claim_url: card?.claim_url })));
                }
              } else {
                allItemsBought = false;
                orderFulfilled = false;
                await order?.User?.createLog({ action: `Order [${order.id}] could not be completed. Failed to process order item [${orderItem?.provider_product_id || orderItem.id}]: Order is placed but could not be completed successfully`, details: `Order with product's sku [${sku}] is either rejected/pending by provider ${provider?.name}`, status: 'failed', type: 'order_complete' });
              }
            } catch (error) {
              orderFulfilled = false;
              allItemsBought = false;
              console.log("Error in creating order/fetching cards information: ", error);
              await order?.User?.createLog({ action: `Order [${order.id}] could not be completed. Failed to process order item [${orderItem?.provider_product_id || orderItem.id}]: Error in creating order/fetching cards information from the provider ${provider?.name} with product's sku [${sku}]`, details: error?.toString(), status: 'failed', type: 'order_complete' });
            }
            quantity -= currentQuantity;
          }
        } else {
          orderFulfilled = false;
          await order?.User?.createLog({ action: `Order [${order.id}] could not be completed. Failed to process order item [${orderItem?.provider_product_id || orderItem.id}]: Product with sku [${sku}] not available`, details: `Not enough products are available to buy from the provider ${provider?.name}`, status: 'failed', type: 'order_complete' });
        }
        if (allItemsBought) {
          await orderItem?.update({ status: "success" });
        }
      } catch (error) {
        orderFulfilled = false;
        console.log('Error in checking availability of products: ', error);
        await order?.User?.createLog({ action: `Order [${order.id}] could not be completed. Failed to process order item [${orderItem?.provider_product_id || orderItem.id}]: Cannot check availability of products from provider ${provider?.name} with sku [${sku}]`, details: error?.toString(), status: 'failed', type: 'order_complete' });
      }
    }

    if (orderFulfilled) {
      await order.update({ status: 'fulfilled' });
      await order.reload();
      const totalCost = orderItems.reduce((total, orderItem) => total + orderItem.amount, 0);
      const metadata = order.User?.metadata?.order_settings;
      const priceLimit = metadata?.price_limit || defaultPriceLimit;
      let automaticOrder = true;
      if (order.Customer) {
        const maxOrders: number = metadata?.max_orders || defaultMaxOrders;
        const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();
        const ordersCount = await Order.count({
          where: {
            user_id: order.User.id,
            customer_id: order.Customer.id,
            createdAt: { [Op.gte]: twentyFourHoursAgo }
          }
        });
        if (ordersCount > maxOrders) {
          automaticOrder = false;
        }
        const customerMobileCountryCode = order.Customer.mobile.slice(0, 4);
        let allowedCountryCodes: typeof countryCodes = metadata?.allowed_countries;
        if (!allowedCountryCodes || !allowedCountryCodes.length) {
          allowedCountryCodes = countryCodes;
        }
        if (!allowedCountryCodes.find(country => country.value === customerMobileCountryCode)) {
          automaticOrder = false;
        }
      }
      if (totalCost <= priceLimit && automaticOrder) {
        await sendOrderFulfillmentEmail(order);
      }
      await order?.User?.createNotification({ type: 'success', message: `Your order [${order.id}] has been fulfilled` });
      const { provider, access_token, manager_token } = order.User;
      if (provider && access_token) {
        const service = createStoreService(provider, access_token);
        let request = { orderId: order.id };
        if (provider === 'salla') {
          await service.updateStatus({ ...request, orderStatus: 'Kodati Fulfilled' });
        } else if (provider === 'zid' && manager_token) {
          await service.updateStatus({ ...request, orderStatus: 'ready', managerToken: manager_token });
        }
      }
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Order could not be completed for some reasons. Please check logs.' }, { status: 400 });
    }
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}