import Header from '@/app/components/Header/Header';
import StoreTransactions from '@/app/components/Stores/StoreTransactions';
import { getStore } from '@/utils/user-helpers';
import { v4 as uuid } from 'uuid';
import { Suspense } from 'react';
import Await from '@/app/components/Await';
import Skeleton from '@/app/components/Skeleton';
import { searchParams } from '@/types/search-params';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-options';
import { User } from '@/database/models';
import { notFound } from 'next/navigation';

const Page = async ({ params, searchParams }: { params: { id: string }, searchParams: searchParams }) => {
  if (isNaN(parseInt(params.id))) return notFound();
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const session = await getServerSession(authOptions);
  const { name } = session?.user as User;
  const data = getStore({ id: Number(params.id), page, query: search });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <StoreTransactions store={data} search={search} name={name} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Page;