import { Notification, User } from "@/database/models";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const { rows, count } = await Notification.findAndCountAll({
      where: {
        user_id: authenticatedUser.id,
      },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: ['updated_at'],
      },
    });

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      page,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('An error occurred while fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}