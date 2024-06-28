import { NextResponse, type NextRequest } from 'next/server';
import { Product, Order, OrderItem, User, Transaction } from '@/database/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import { createStoreService } from '@/services/StoreService';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const orderId = Number(id);
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          required: true,
          attributes: ['quantity', 'local_product_id'],
          include: [{ model: Product, attributes: ['price'], required: true }],
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'access_token', 'manager_token', 'provider'],
          include: [{
            model: Transaction,
            attributes: ['current_balance'],
            order: [['created_at', 'DESC']],
            limit: 1,
            required: false,
          }],
        },
      ],
    });

    if (!order || !order.User) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.User.id !== authenticatedUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (order.status !== 'processing') {
      return NextResponse.json({ error: 'Order cannot be forwarded. Invalid order status' }, { status: 400 });
    }

    const orderItems = order.OrderItems;

    if (!orderItems || !orderItems.length) {
      return NextResponse.json({ error: 'No order items found' }, { status: 400 });
    }

    const totalLocalProductsAmount = orderItems.reduce((total, item) => total + (item?.Product?.price as number) * item?.quantity, 0);
    const merchantBalance: number = Number(order.User.Transactions?.[0]?.current_balance ?? 0);
    const hasEnoughBalance = merchantBalance >= totalLocalProductsAmount;

    if (!hasEnoughBalance) {
      return NextResponse.json({ error: 'Insufficient balance to forward the order' }, { status: 400 });
    }

    const transaction = await Transaction.create({
      user_id: order.user_id,
      previous_balance: merchantBalance,
      current_balance: merchantBalance - totalLocalProductsAmount,
      transaction_amount: -totalLocalProductsAmount,
      reason: 'order',
    });

    await order.setTransaction(transaction);

    await order.update({ status: 'approved' });
    const { provider, access_token, manager_token } = order.User;
    if (provider && access_token) {
      const service = createStoreService(provider, access_token);
      let request = { orderId: order.id };
      if (provider === 'salla') {
        await service.updateStatus({ ...request, orderStatus: 'Kodati Approval' });
      } else if (provider === 'zid' && manager_token) {
        await service.updateStatus({ ...request, orderStatus: 'processed', managerToken: manager_token });
      }
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}