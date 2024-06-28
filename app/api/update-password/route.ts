import { NextResponse, type NextRequest } from 'next/server';
import { User } from "@/database/models";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string' || currentPassword.trim().length < 10 || newPassword.trim().length < 10) {
      return NextResponse.json({ error: 'Both current password and new password are required and they must be at least 10 characters long' }, { status: 400 });
    }

    const user = await User.findByPk(authenticatedUser?.id, {
      attributes: ['id', 'password'],
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}