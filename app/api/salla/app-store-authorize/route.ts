import { convertUnixTimestampToMySQLDateTime, fetchMerchant, validateSallaWebhook } from '@/utils/helpers';
import User from '@/database/models/user';
import bcrypt from 'bcrypt';
import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import generator from 'generate-password';
import { sendWelcomeEmail } from '@/lib/mail';
import { SallaService } from '@/services/StoreService';
import { statuses } from '@/constants';
import { MerchantInfo } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const headersList = headers();
        const requestHMAC = headersList.get('x-salla-signature');
        const body = await req.json();
        const validationResult = await validateSallaWebhook(requestHMAC, body);
        if (!validationResult?.isValid) {
            const { errorResponse } = validationResult;
            return NextResponse.json(errorResponse?.error, { status: errorResponse?.status });
        }
        const { access_token, refresh_token, expires } = body.data;
        const { merchant: id, created_at: access_token_created } = body;

        const { SALLA_BASE_URL } = process.env;
        if (SALLA_BASE_URL) {
            const service = new SallaService('salla', access_token, SALLA_BASE_URL);
            await service.createCustomStatuses(statuses);
        }

        const { avatar, name, mobile, email } = await fetchMerchant(access_token, 'salla') as MerchantInfo;
        const randomPassword = generator.generate({
            length: 10,
            numbers: true
        });
        const password = await bcrypt.hash(randomPassword, 10);
        const access_token_expired = convertUnixTimestampToMySQLDateTime(expires, 'unix');
        await User.create({ id, name, email, mobile, avatar, password, access_token, refresh_token, access_token_created, access_token_expired, role: 'user', provider: 'salla' });

        await sendWelcomeEmail(email, randomPassword);
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return NextResponse.json({ message: 'You are already registered' }, { status: 409 });
        }
        console.log('Error: ', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}