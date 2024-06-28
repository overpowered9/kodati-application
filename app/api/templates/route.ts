import { NextResponse, type NextRequest } from 'next/server';
import { EmailTemplate, User } from "@/database/models";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUser = session?.user as User;
    if (!authenticatedUser || authenticatedUser?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(authenticatedUser?.id, {
      attributes: ['id'],
      include: {
        model: EmailTemplate,
        attributes: ['id', 'subject', 'body'],
        required: false,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { subject, body } = await req.json();

    if (!subject || !body || typeof subject !== 'string' || typeof body !== 'string') {
      return NextResponse.json({ error: 'Subject and body are required fields and both should be strings' }, { status: 400 });
    }

    if (user.EmailTemplate) {
      await user.EmailTemplate.update({ subject, body });
    } else {
      await user.createEmailTemplate({ subject, body });
    }

    return NextResponse.json({ message: 'Email template created successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error while creating email template:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}