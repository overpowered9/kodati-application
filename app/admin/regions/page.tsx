import { Suspense } from 'react';
import { v4 as uuid } from 'uuid';
import { searchParams } from "@/types/search-params";
import Await from "@/app/components/Await";
import Skeleton from "@/app/components/Skeleton";
import Header from '@/app/components/Header/Header';
import { getPaginatedRegions } from '@/utils/region-helpers';
import RegionsTable from '@/app/components/Regions/RegionsTable';

const Regions = async ({ searchParams }: { searchParams: searchParams }) => {
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const regions = getPaginatedRegions({ query: search, page });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={regions}>
          {(regions) => <RegionsTable regions={regions} search={search} />}
        </Await>
      </Suspense>
    </section>
  );
}

export default Regions;