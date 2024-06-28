import { getTransactions } from "@/utils/transaction-helpers";
import Header from "../components/Header/Header";
import TransactionsTable from "../components/Dashboard/TransactionsTable/TransactionsTable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth-options";
import { User } from "@/database/models";
import { Suspense } from 'react';
import Await from '../components/Await';
import Skeleton from '../components/Skeleton';
import { v4 as uuid } from 'uuid';
import { searchParams } from "@/types/search-params";

const Dashboard = async ({ searchParams }: { searchParams: searchParams }) => {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const startDate = typeof searchParams.startDate === "string" ? searchParams.startDate : undefined;
  const endDate = typeof searchParams.endDate === "string" ? searchParams.endDate : undefined;
  const sortOption = typeof searchParams.sortOption === "string" ? searchParams.sortOption : undefined;
  const session = await getServerSession(authOptions);
  const { id: user_id, role, name } = session?.user as User;
  const data = getTransactions({ page, query: search, role, user_id, startDate, endDate, sortOption });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <TransactionsTable response={data} search={search} sortBy={sortOption} start={startDate} end={endDate} role={role} name={name} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Dashboard;