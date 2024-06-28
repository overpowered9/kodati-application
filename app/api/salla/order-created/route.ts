import { Customer, MerchantLinkedProduct, OrderItem, User } from '@/database/models';
import { createStoreService } from '@/services/StoreService';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // validate webhook using signature 
    const data = await req.json();
    if (data?.event !== 'order.created') {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }
    const merchant_id = data?.merchant;
    const user = await User.findByPk(merchant_id, {
      attributes: ['id', 'access_token'],
      include: {
        model: MerchantLinkedProduct,
        attributes: ['local_product_id', 'provider_product_id'],
        required: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'No linked products found' }, { status: 404 });
    }

    const orderData = data?.data;
    const order_id = orderData?.id;
    const items = orderData?.items;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No order items found' }, { status: 400 });
    }

    const orderItemsToCreate = items.map((orderItem: any) => {
      const linkedProduct = user?.MerchantLinkedProducts?.find((product) => product?.provider_product_id === orderItem?.product?.sku);

      if (linkedProduct) {
        return {
          local_product_id: linkedProduct?.local_product_id,
          provider_product_id: orderItem?.product?.sku,
          quantity: orderItem?.quantity,
          amount: orderItem?.amounts?.total?.amount,
          currency: orderItem?.currency,
        };
      }

      return null;
    }).filter(Boolean);

    if (orderItemsToCreate.length === 0) {
      await user?.createNotification({ type: 'error', message: 'You received an order but no linked product found' });
      return NextResponse.json({ error: 'No linked order item found' }, { status: 404 });
    }

    const order = await user.createOrder({ id: order_id, status: 'processing', source: 'salla' });

    if (orderData.customer) {
      const { id, first_name, last_name, email, mobile, mobile_code } = orderData.customer;
      let existingCustomer = await Customer.findByPk(id);
      if (!existingCustomer) {
        existingCustomer = await Customer.create({ id, name: `${first_name} ${last_name}`, email, mobile: `${mobile_code}${mobile}` });
      } else {
        await existingCustomer.update({ name: `${first_name} ${last_name}`, email, mobile: `${mobile_code}${mobile}` });
      }
      await order.setCustomer(existingCustomer);
    }

    await Promise.all(orderItemsToCreate?.map((item: OrderItem) => order.createOrderItem(item)));

    if (user.access_token) {
      const service = createStoreService('salla', user.access_token);
      await service.updateStatus({ orderId: order_id, orderStatus: 'Kodati Processing' });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error('Error in creating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}