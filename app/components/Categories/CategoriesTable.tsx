"use client";

import { PaginatedCategories } from "@/types/pagination-types";
import Image from "next/image";
import Search from "../Search";
import Link from "next/link";
import PaginationControls from "../Pagination";
import { useState } from "react";
import DeleteCategory from "./DeleteCategory";

const CategoriesTable = ({ categories, search }: { categories: PaginatedCategories | null, search?: string }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <div className="container mx-auto mt-24">
      <h1 className="text-3xl font-bold my-4">Categories({categories?.totalItems})</h1>
      <div className="flex items-center rounded-md bg-white p-2 shadow-md mb-4">
        <Search search={search} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.items?.map(category => (
          <div key={category.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
            <Image src={category?.image ? `data:${category.image_type};base64,${Buffer.from(category.image).toString('base64')}` : ""} alt={category?.name} width={200} height={200} className="w-full h-48 object-cover rounded-md" />
            <h2 className="text-lg font-semibold mt-2">{category?.name}</h2>
            <div className="flex justify-end mt-4">
              <Link href={`/admin/categories/${category?.id}/edit`} target="_blank">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none">
                  Edit
                </button>
              </Link>
              <button onClick={() => setSelectedCategoryId(category.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none ml-4">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <PaginationControls totalPages={categories?.totalPages} />
      {selectedCategoryId && (
        <DeleteCategory categoryId={selectedCategoryId} onClose={() => setSelectedCategoryId(null)} />
      )}
    </div>
  );
};

export default CategoriesTable;