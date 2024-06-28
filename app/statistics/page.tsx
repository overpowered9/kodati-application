import { getProductsStats } from '@/utils/stats-helpers';
import Header from '../components/Header/Header';
import Statistics from '../components/Statistics/Statistics';
import { searchParams } from '@/types/search-params';
import { v4 as uuid } from 'uuid';
import { Suspense } from 'react';
import Skeleton from '../components/Skeleton';
import Await from '../components/Await';

const Page = async ({ searchParams }: { searchParams: searchParams }) => {
  const startDate = typeof searchParams.startDate === "string" ? searchParams.startDate : undefined;
  const endDate = typeof searchParams.endDate === "string" ? searchParams.endDate : undefined;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const productsStats = getProductsStats({ startDate, endDate, page });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={productsStats}>
          {(productsStats) => <Statistics productsStats={productsStats} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Page;