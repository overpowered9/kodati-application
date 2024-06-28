import Header from "@/app/components/Header/Header";
import LogsTable from "@/app/components/Logs/LogsTable";
import { Suspense } from 'react';
import Await from '../../components/Await';
import Skeleton from '../../components/Skeleton';
import { v4 as uuid } from 'uuid';
import { getLogs } from "@/utils/log-helpers";
import { searchParams } from "@/types/search-params";

const Stores = async ({ searchParams }: { searchParams: searchParams }) => {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const data = getLogs({ page, query: search });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <LogsTable response={data} search={search} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Stores;
