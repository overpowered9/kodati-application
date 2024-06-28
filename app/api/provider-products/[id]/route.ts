import { Provider, User } from '@/database/models';
import { createProviderService } from '@/services/ProviderService';
import { authOptions } from '@/utils/auth-options';
import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;
    const provider = await Provider.findByPk(Number(id));
    const providerService = await createProviderService(provider);
    let products = await providerService?.fetchProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}