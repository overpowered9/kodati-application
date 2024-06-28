import { getServerSession } from 'next-auth';
import SessionExpired from '../../components/SessionExpired';
import { authOptions } from '@/utils/auth-options';
import { updateToken } from '@/utils/helpers';
import { User } from '@/database/models';
import ServerError from '../../components/ServerError';
import { redirect } from 'next/navigation';
import moment from 'moment';

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (user.access_token_expired) {
    const isExpired = moment(user.access_token_expired) <= moment();
    if (!isExpired) {
      return redirect('/dashboard');
    }
  }
  const data = await updateToken(user.id);

  if (data) {
    return <SessionExpired />;
  } else {
    return <ServerError />;
  }
};

export default Page;