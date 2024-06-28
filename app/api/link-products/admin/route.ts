import { NextResponse, type NextRequest } from 'next/server';
import { AdminLinkedProduct, Product, User } from "@/database/models";
import { convertToSAR } from '@/utils/currency-helpers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { local_product_id, provider_id, provider_product_id, min_price, currency_code } = await req.json();

    const localProduct = await Product.findByPk(local_product_id);

    if (!localProduct) {
      return NextResponse.json({ message: 'Invalid local product' }, { status: 404 });
    }

    const existingLinkedProduct = await AdminLinkedProduct.findOne({
      where: { local_product_id, provider_id },
    });

    if (existingLinkedProduct) {
      await existingLinkedProduct.destroy();
    }

    const converted_price = await convertToSAR(min_price, "USD");

    const linkedProduct = await AdminLinkedProduct.create({
      local_product_id,
      provider_id,
      provider_product_id,
      min_price,
      max_price: localProduct?.price,
      currency_code,
      converted_price,
    });

    return NextResponse.json({ message: 'Products linked successfully', linkedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error while linking products:", error);
    return NextResponse.json({ message: 'Failed to link products' }, { status: 500 });
  }
}
