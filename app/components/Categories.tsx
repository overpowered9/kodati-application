import { Category, Region } from "@/database/models";
import Image from "next/image";
import ProductsBar from "./Products/ProductsBar";
import Link from "next/link";
import NoRecordsFound from "./NoRecordsFound";

const Categories = ({ categories, search, regions }: { categories: Category[] | null, search?: string, regions: Region[] | null }) => {
  return (
    <>
      <ProductsBar view={undefined} onViewChange={undefined} totalItems={categories?.length} search={search} regions={regions} />
      {categories?.length === 0 && (
        <NoRecordsFound record="categories" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-10 mx-16">
        {categories?.map((category) => (
          <Link key={category?.id} href={`/products?category=${encodeURIComponent(category?.name)}`} className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <Image src={category?.image ? `data:${category.image_type};base64,${Buffer.from(category.image).toString('base64')}` : ""} alt={category?.name} width={200} height={200} className="w-full h-40" />
            <div className="p-4">
              <p className="text-lg font-semibold text-center">{category?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Categories;