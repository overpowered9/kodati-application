import { Notification, User } from "@/database/models";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const unreadCount = await Notification.count({ where: { read: false, user_id: authenticatedUser.id } });
    return NextResponse.json({ unreadCount }, { status: 200 });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}