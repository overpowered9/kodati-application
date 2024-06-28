import { User } from '@/database/models';
import { createStoreService } from '@/services/StoreService';
import { ProductRequest, ZidProductRequest } from '@/types';
import { authOptions } from '@/utils/auth-options';
import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { sku: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { sku } = params;
    const { provider, access_token } = authenticatedUser;
    if (!provider || !access_token || !sku) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
    const service = createStoreService(provider, access_token);
    let request: ProductRequest | ZidProductRequest = { sku };
    if (provider === 'zid') {
      const { manager_token: managerToken, metadata } = authenticatedUser;
      if (!managerToken || !metadata?.store_id || typeof metadata?.store_id !== 'number') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      request = { ...request, 'Store-Id': authenticatedUser.metadata?.store_id, managerToken };
    }
    const product = await service.fetchProduct(request);
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}