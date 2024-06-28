import { Region, User } from "@/database/models";
import { NextResponse, type NextRequest } from 'next/server';
import { validateRegions } from "@/utils/helpers";
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
    const { name, code } = await req.json();
    const validationError = validateRegions(name, code);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const region = await Region.findByPk(id);
    if (!region) {
      return NextResponse.json({ message: "Region not found" }, { status: 404 });
    }
    await region.update({ name, code });
    return NextResponse.json({ message: "Region updated successfully" }, { status: 200 });
  } catch (error: any) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Region already exists' }, { status: 409 });
    }
    console.error('An error occurred while updating the region:', error);
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
  const result = await Region.destroy({ where: { id } });
  return result === 1 ? NextResponse.json({ message: "Region deleted successfully" }, { status: 200 }) : NextResponse.json({ message: "Region not found" }, { status: 404 });
}