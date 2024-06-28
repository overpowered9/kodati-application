import { Notification, User } from '@/database/models';
import { authOptions } from '@/utils/auth-options';
import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const { ids }: { ids: number[] } = data;
    const notifications = await Notification.findAll({ where: { id: ids } });
    await Promise.all(notifications.map(async (notification) => {
      if (notification) {
        notification.read = true;
        notification.save({ fields: ['read'] });
      }
    }));
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}