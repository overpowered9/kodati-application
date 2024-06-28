import { NextResponse, NextRequest } from 'next/server';
import { Cart, CartItem, Product, User } from '@/database/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();
    if (!productId || !quantity || typeof productId !== 'number' || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(authenticatedUser.id, {
      attributes: ['id'],
      include: {
        model: Cart,
        attributes: ['id'],
        include: [{
          model: CartItem,
          attributes: ['id', 'quantity'],
          where: { product_id: productId },
          limit: 1,
        }],
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.Cart) {
      const newCart = await user.createCart();
      await newCart.createCartItem({ product_id: productId, quantity });
    } else {
      const cart = user.Cart;
      if (!cart.CartItems || cart.CartItems.length === 0) {
        await cart.createCartItem({ product_id: productId, quantity });
      } else {
        const existingCartItem = cart.CartItems[0];
        await existingCartItem.update({ quantity: existingCartItem.quantity + quantity });
      }
    }

    return NextResponse.json({ message: 'Product added to cart successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error while adding product to cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(authenticatedUser.id, {
      attributes: ['id'],
      include: {
        model: Cart,
        attributes: ['id'],
        include: [{
          model: CartItem,
          attributes: ['id', 'quantity'],
          include: [{
            model: Product,
            attributes: ['id', 'title', 'price', 'image', 'image_type'],
          }],
        }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ items: user?.Cart?.CartItems || [] }, { status: 200 });
  } catch (error) {
    console.error('Error while fetching cart items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}