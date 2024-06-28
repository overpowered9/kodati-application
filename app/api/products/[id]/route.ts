import { Category, Product, Region, User } from "@/database/models";
import { NextResponse, type NextRequest } from 'next/server';
import { validateFields } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const authenticatedUser = session?.user as User;
  if (!authenticatedUser || authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const formData = await req.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const file = formData.get('image') as File | null;
  const categories = formData.get('categories') as string;
  const regions = formData.get('regions') as string;
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
  const product = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        attributes: ['id'],
      },
      {
        model: Region,
        attributes: ['id'],
      }
    ]
  });
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  await product.removeCategories(product?.Categories);
  await product.removeRegions(product?.Regions);
  const updateFields: Record<string, string | Buffer | number> = {
    title,
    description,
    price,
  };
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    updateFields.image = buffer;
    updateFields.image_type = file.type;
  }
  const updatedProduct = await product.update(updateFields);
  const category = await Category.findAll({
    where: { id: parsedCategories },
    attributes: ['id'],
  });
  await updatedProduct.addCategories(category);
  const region = await Region.findAll({
    where: { id: parsedRegions },
    attributes: ['id'],
  });
  await updatedProduct.addRegions(region);
  return NextResponse.json({ message: "Product updated" }, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const authenticatedUser = session?.user as User;
  if (!authenticatedUser || authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const result = await Product.destroy({ where: { id } });
  return result === 1 ? NextResponse.json({ message: "Product deleted" }, { status: 200 }) : NextResponse.json({ message: "Product not found" }, { status: 404 });
}