import { Region, User } from "@/database/models";
import { NextResponse, type NextRequest } from 'next/server';
import { validateRegions } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, code } = await req.json();
    const validationError = validateRegions(name, code);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    await Region.create({ name, code });
    return NextResponse.json({ message: "Region created successfully" }, { status: 200 });
  } catch (error: any) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Region already exists' }, { status: 409 });
    }
    console.error('An error occurred while creating the region:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}