import { Customer, MerchantLinkedProduct, OrderItem, User } from '@/database/models';
import { createStoreService } from '@/services/StoreService';
import { extractCurrency } from '@/utils/server-helpers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // validate webhook using signature 
    const data = await req.json();
    const merchant_id = data?.store_id;
    const user = await User.findOne({
      where: { provider: 'zid', 'metadata.store_id': merchant_id },
      attributes: ['id', 'access_token', 'manager_token'],
      include: {
        model: MerchantLinkedProduct,
        attributes: ['local_product_id', 'provider_product_id'],
        required: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'No linked products found' }, { status: 404 });
    }

    const order_id = data?.id;
    const items = data?.products;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No order items found' }, { status: 400 });
    }

    const orderItemsToCreate = items.map((orderItem: any) => {
      const linkedProduct = user?.MerchantLinkedProducts?.find((product) => product?.provider_product_id === orderItem?.id);

      if (linkedProduct) {
        return {
          local_product_id: linkedProduct?.local_product_id,
          provider_product_id: orderItem?.id,
          quantity: orderItem?.quantity,
          amount: orderItem?.total,
          currency: extractCurrency(orderItem?.total_string) ?? data?.currency_code,
        };
      }

      return null;
    }).filter(Boolean);

    if (orderItemsToCreate.length === 0) {
      await user?.createNotification({ type: 'error', message: 'You received an order but no linked product found' });
      return NextResponse.json({ error: 'No linked order item found' }, { status: 404 });
    }

    const order = await user.createOrder({ id: order_id, status: 'processing', source: 'zid' });

    if (data.customer) {
      const { name, email, phone: mobile } = data.customer;
      const customer = await Customer.create({ name, email, mobile });
      await order.setCustomer(customer);
    }

    await Promise.all(orderItemsToCreate?.map((item: OrderItem) => order.createOrderItem(item)));

    if (user.access_token && user.manager_token) {
      const service = createStoreService('zid', user.access_token);
      await service.updateStatus({ orderId: order_id, orderStatus: 'new', managerToken: user.manager_token });
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error('Error in creating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}