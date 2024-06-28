import { NextResponse } from 'next/server';
import { Provider, AdminLinkedProduct, User } from '@/database/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import { fetchAndUpdatePrices } from '@/utils/admin-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const providers = await Provider.findAll({
      include: [{ model: AdminLinkedProduct, required: true }],
    });

    const fetchAndUpdatePromises: Promise<void>[] = [];

    for (const provider of providers) {
      fetchAndUpdatePromises.push(fetchAndUpdatePrices(provider));
    }

    await Promise.all(fetchAndUpdatePromises);
    return NextResponse.json({ message: 'Prices refreshed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error refreshing prices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
