import { Category, User } from "@/database/models";
import { NextResponse, type NextRequest } from 'next/server';
import { validateCategories } from "@/utils/helpers";
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
    const name = formData.get('name') as string;
    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const validationError = validateCategories(name, file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    await Category.create({ name, image: buffer, image_type: file.type });
    return NextResponse.json({ message: "Category created successfully" }, { status: 200 });
  } catch (error: any) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}