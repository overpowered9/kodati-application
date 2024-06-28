import { PasswordToken, User } from '@/database/models';
import moment from 'moment';
import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid token or password format' }, { status: 400 });
    }

    const passwordToken = await PasswordToken.findOne({ where: { token } });

    if (!passwordToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentTime = moment();
    const tokenExpiry = moment(passwordToken.expiry);
    if (currentTime > tokenExpiry) {
      await passwordToken.destroy();
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    const user = await passwordToken.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await passwordToken.destroy();
    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error) {
    console.error('An error occurred while changing the password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}