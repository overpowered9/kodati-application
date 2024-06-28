import Header from "@/app/components/Header/Header";
import StoresTable from "@/app/components/Stores/StoresTable";
import { getStores } from "@/utils/user-helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth-options";
import { User } from "@/database/models";
import { Suspense } from 'react';
import Await from '../../components/Await';
import Skeleton from '../../components/Skeleton';
import { v4 as uuid } from 'uuid';
import { searchParams } from "@/types/search-params";

const Stores = async ({ searchParams }: { searchParams: searchParams }) => {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const data = getStores({ page, query: search });
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  const name = user?.name;

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <StoresTable response={data} search={search} name={name} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Stores;
