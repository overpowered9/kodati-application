import { Category, Product, Region, User } from "@/database/models";
import { NextResponse, type NextRequest } from 'next/server';
import { validateFields } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categories = formData.get('categories') as string;
    const regions = formData.get('regions') as string;
    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const validationError = validateFields(title, description, price, file, categories, regions);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    let parsedCategories: number[] = [];
    let parsedRegions: number[] = [];
    try {
      parsedCategories = JSON.parse(categories) as number[];
      parsedRegions = JSON.parse(regions) as number[];
    } catch (error) {
      return NextResponse.json({ error: "Invalid format of categories/regions" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const product = await Product.create({ title, description, image: buffer, image_type: file.type, price });
    const category = await Category.findAll({
      where: { id: parsedCategories },
      attributes: ['id'],
    });
    await product.addCategories(category);
    const region = await Region.findAll({
      where: { id: parsedRegions },
      attributes: ['id'],
    });
    await product.addRegions(region);
    return NextResponse.json({ message: "Product Created" }, { status: 200 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}