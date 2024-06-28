import { authOptions } from "@/utils/auth-options";
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return redirect('/dashboard');
  }

  return redirect('/login');
};

export default Page;