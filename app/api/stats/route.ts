import { User } from '@/database/models';
import { authOptions } from '@/utils/auth-options';
import { getOrdersSummary } from '@/utils/order-helpers';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await getOrdersSummary({ user_id: authenticatedUser.id, role: authenticatedUser.role });
    if (!data) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}