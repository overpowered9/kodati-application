import { getOrders } from "@/utils/order-helpers";
import Header from "../components/Header/Header";
import OrdersTable from "../components/Orders/OrdersTable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth-options";
import { User } from "@/database/models";
import { Suspense } from 'react';
import Await from '../components/Await';
import Skeleton from '../components/Skeleton';
import { v4 as uuid } from 'uuid';
import { searchParams } from "@/types/search-params";

const Orders = async ({ searchParams }: { searchParams: searchParams }) => {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const session = await getServerSession(authOptions);
  const { id: user_id, role } = session?.user as User;
  const data = getOrders({ page, query: search, role, user_id });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <OrdersTable response={data} search={search} role={role} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Orders;