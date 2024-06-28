import { NextResponse, type NextRequest } from 'next/server';
import { fetchMerchant } from '@/utils/helpers';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { convertUnixTimestampToMySQLDateTime } from '@/utils/helpers';
import User from '@/database/models/user';
import moment from "moment";
import generator from 'generate-password';
import { sendWelcomeEmail } from '@/lib/mail';
import { OAuthResponse, ZidMerchantInfo } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    const tokenEndpoint = 'https://oauth.zid.sa/oauth/token';

    const response = await axios.post<OAuthResponse>(tokenEndpoint, {
      client_id: process.env.ZID_CLIENT_ID,
      client_secret: process.env.ZID_CLIENT_SECRET,
      redirect_uri: process.env.ZID_REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
    });

    const { access_token: manager_token, authorization: access_token, refresh_token, expires_in } = response.data;
    const data = await fetchMerchant(access_token, 'zid', manager_token) as ZidMerchantInfo;
    const { avatar, name, mobile, email, id, store_id } = data;
    const randomPassword = generator.generate({
      length: 10,
      numbers: true
    });
    const password = await bcrypt.hash(randomPassword, 10);
    const access_token_created = moment().format('YYYY-MM-DD HH:mm:ss');
    const access_token_expired = convertUnixTimestampToMySQLDateTime(expires_in, 'seconds');

    await User.create({
      id, name, email, mobile, avatar, password, manager_token, access_token, refresh_token,
      access_token_created, access_token_expired, role: "user", provider: "zid", metadata: { store_id },
    });

    await sendWelcomeEmail(email, randomPassword);
    return NextResponse.json({ message: `Authorization successful. Dear ${name}, we have sent you an email. Please check your credentials there.` }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ message: 'You are already registered' }, { status: 409 });
    }
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}