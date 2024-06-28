import ProductsList from "@/app/components/LinkProducts/Admin/ProductsList";
import Header from "@/app/components/Header/Header";
import { filterProductsByAdminLinking } from '@/utils/product-helpers';
import { getAllProviders } from "@/utils/provider-helpers";
import { v4 as uuid } from 'uuid';
import Await from '@/app/components/Await';
import Skeleton from '@/app/components/Skeleton';
import { Suspense } from 'react';
import { searchParams } from "@/types/search-params";

const LinkProducts = async ({ searchParams }: { searchParams: searchParams }) => {
  const linked = typeof searchParams.linked === "string" ? (searchParams.linked.toLowerCase() === "true" ? true : searchParams.linked.toLowerCase() === "false" ? false : undefined) : true;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const providers = await getAllProviders();
  const products = filterProductsByAdminLinking({ linked, page });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={products}>
          {(products) => <ProductsList localProducts={products} providers={providers} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default LinkProducts;