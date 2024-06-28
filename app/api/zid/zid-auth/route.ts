import querystring from 'querystring';
import { NextResponse } from 'next/server';

export async function GET() {
  const authorizationEndpoint = 'https://oauth.zid.sa/oauth/authorize';
  const queryParams = querystring.stringify({
    client_id: process.env.ZID_CLIENT_ID,
    redirect_uri: process.env.ZID_REDIRECT_URI,
    response_type: 'code',
  });
  const authorizationUrl = `${authorizationEndpoint}?${queryParams}`;
  return NextResponse.redirect(authorizationUrl);
}
