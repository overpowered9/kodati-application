import ProductsListings from "../components/Products/ProductsListings";
import Header from "../components/Header/Header";
import { getProducts } from "@/utils/product-helpers";
import { Suspense } from 'react';
import Await from '../components/Await';
import Skeleton from '../components/Skeleton';
import { v4 as uuid } from 'uuid';
import { getCategories } from "@/utils/category-helpers";
import Categories from "../components/Categories";
import { getRegions } from "@/utils/region-helpers";
import { searchParams } from "@/types/search-params";

const Products = async ({ searchParams }: { searchParams: searchParams }) => {
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const region = typeof searchParams.region === "string" ? searchParams.region : undefined;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : undefined;
  const regions = await getRegions();
  if (!category && !search && !page && !region) {
    const categories = getCategories(true);
    return (
      <section key={uuid()}>
        <div>
          <Header />
        </div>
        <Suspense fallback={<Skeleton />}>
          <Await promise={categories}>
            {(categories) => <Categories categories={categories} search={search} regions={regions} />}
          </Await>
        </Suspense>
      </section>
    );
  }

  const data = getProducts({ page, query: search, category, region });
  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={data}>
          {(data) => <ProductsListings response={data} search={search} regions={regions} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default Products;
