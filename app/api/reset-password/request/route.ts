import { User } from '@/database/models';
import { sendResetEmail } from '@/lib/mail';
import { generateToken } from '@/utils/helpers';
import moment from 'moment';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const user = await User.findOne({ where: { email }, attributes: ['id', 'email'] });

    if (!user) {
      return NextResponse.json({ error: "No user found for this email" }, { status: 404 });
    }

    const existingToken = await user.getPasswordToken();
    if (existingToken) {
      const currentTime = moment();
      const tokenExpiry = moment(existingToken.expiry);
      const timeDifference = tokenExpiry.diff(currentTime, "minutes");
      if (timeDifference <= 0) {
        await existingToken.destroy();
      } else {
        return NextResponse.json({ error: `A password reset request has already been sent. Please wait ${timeDifference} minutes before requesting a new reset request` }, { status: 429 });
      }
    }

    const token = generateToken(64);

    await user.createPasswordToken({
      token,
      expiry: moment().add(15, "minutes").format("YYYY-MM-DD HH:mm:ss"),
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    await sendResetEmail(user?.email, resetLink);
    return NextResponse.json({ message: "Password reset email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error('An error occurred while requesting password reset:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
