import { NextResponse, type NextRequest } from 'next/server';
import { User } from "@/database/models";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceLimit, maxOrders, allowedCountryCodes } = await req.json();
    if (!priceLimit && !maxOrders && allowedCountryCodes.length === 0) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }

    const user = await User.findByPk(authenticatedUser?.id, {
      attributes: ['id', 'metadata'],
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedMetadata = {
      ...user.metadata,
      order_settings: {
        price_limit: priceLimit,
        max_orders: maxOrders,
        allowed_countries: allowedCountryCodes,
      },
    };

    // Update the user's metadata in the database
    await user.update({ metadata: updatedMetadata });

    return NextResponse.json({ message: 'Order settings updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}