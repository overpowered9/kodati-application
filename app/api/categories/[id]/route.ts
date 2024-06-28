import { Category, User } from "@/database/models";
import { NextResponse, type NextRequest } from 'next/server';
import { validateCategories } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const file = formData.get('image') as File | null;
    const validationError = validateCategories(name, file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const updateFields: Record<string, string | Buffer> = { name };
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      updateFields.image = buffer;
      updateFields.image_type = file.type;
    }
    await category.update(updateFields);
    return NextResponse.json({ message: "Category updated successfully" }, { status: 200 });
  } catch (error: any) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    console.error('An error occurred while updating the category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const authenticatedUser = session?.user as User;
  if (!authenticatedUser || authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const result = await Category.destroy({ where: { id } });
  return result === 1 ? NextResponse.json({ message: "Category deleted successfully" }, { status: 200 }) : NextResponse.json({ error: "Category not found" }, { status: 404 });
}