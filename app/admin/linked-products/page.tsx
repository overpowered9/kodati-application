import Header from "../../components/Header/Header";
import LinkedProductsTable from "../../components/LinkedProducts/LinkedProductsTable";
import { getAdminLinkedProducts } from "@/utils/linked-product-helpers";
import { Suspense } from 'react';
import Await from '../../components/Await';
import Skeleton from '../../components/Skeleton';
import { v4 as uuid } from 'uuid';
import { searchParams } from "@/types/search-params";


const LinkedProducts = async ({ searchParams }: { searchParams: searchParams }) => {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const data = getAdminLinkedProducts({ page, query: search });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <LinkedProductsTable response={data} search={search} />}
        </Await>
      </Suspense>
    </section>
  );

}
export default LinkedProducts;