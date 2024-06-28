import { NextResponse, type NextRequest } from 'next/server';
import { MerchantLinkedProduct, User } from "@/database/models";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { local_product_id, provider_product_id } = await req.json();
    const existingLinkedProduct = await MerchantLinkedProduct.findOne({
      where: { local_product_id, merchant_id: authenticatedUser.id },
    });

    if (existingLinkedProduct) {
      await existingLinkedProduct.destroy();
    }

    await MerchantLinkedProduct.create({
      local_product_id,
      merchant_id: authenticatedUser.id,
      provider_product_id,
    });

    return NextResponse.json({ message: 'Products linked successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error while linking products:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}