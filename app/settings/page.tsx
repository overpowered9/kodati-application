import { getServerSession } from 'next-auth';
import Header from '../components/Header/Header';
import Settings from '../components/Settings/Settings';
import { authOptions } from '@/utils/auth-options';
import { User } from '@/database/models';

const Page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  const data = await User.findByPk(user.id, { attributes: ['id', 'metadata'] });
  
  return (
    <div>
      <Header />
      <Settings metadata={data?.metadata} role={user.role} />
    </div>
  );
};

export default Page;