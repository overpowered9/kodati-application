import { Suspense } from 'react';
import { v4 as uuid } from 'uuid';
import { getPaginatedCategories } from "@/utils/category-helpers";
import { searchParams } from "@/types/search-params";
import Await from "@/app/components/Await";
import Skeleton from "@/app/components/Skeleton";
import CategoriesTable from "@/app/components/Categories/CategoriesTable";
import Header from '@/app/components/Header/Header';

const Categories = async ({ searchParams }: { searchParams: searchParams }) => {
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const categories = getPaginatedCategories({ query: search, page });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={categories}>
          {(categories) => <CategoriesTable categories={categories} search={search} />}
        </Await>
      </Suspense>
    </section>
  );
}

export default Categories;