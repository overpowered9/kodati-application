import { NextResponse, NextRequest } from 'next/server';
import { Cart, CartItem, Product, Transaction, User } from "@/database/models";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(authenticatedUser?.id, {
      attributes: ['id'],
      include: [
        {
          model: Transaction,
          attributes: ['id', 'current_balance'],
          order: [['created_at', 'DESC']],
          limit: 1,
        },
        {
          model: Cart,
          attributes: ['id'],
          include: [{
            model: CartItem,
            attributes: ['id', 'quantity'],
            include: [{
              model: Product,
              attributes: ['id', 'price'],
            }],
          }],
        }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    if (!user.Cart || !user.Cart.CartItems || !user.Cart.CartItems.length) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    const cartItems = user.Cart.CartItems;
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.Product.price) * (item.quantity);
    }, 0);

    const merchantBalance = Number(user?.Transactions?.[0]?.current_balance ?? 0);
    const hasEnoughBalance = merchantBalance >= totalAmount;

    if (!hasEnoughBalance) {
      return NextResponse.json({ error: 'You do not have enough balance to create the order' }, { status: 400 });
    }

    const order = await user?.createOrder({ status: 'approved', source: 'manual' });
    const transaction = await user.createTransaction({
      previous_balance: merchantBalance,
      current_balance: merchantBalance - totalAmount,
      transaction_amount: -totalAmount,
      reason: 'order',
    });

    await order.setTransaction(transaction);

    await Promise.all(cartItems.map((item) => {
      return order.createOrderItem({
        local_product_id: item.Product.id,
        quantity: item.quantity,
        amount: (item.Product.price) * (item.quantity),
        currency: 'SAR'
      });
    }));

    await user.Cart.destroy();

    return NextResponse.json({ message: 'Order placed successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error while creating order:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}