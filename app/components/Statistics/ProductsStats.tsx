"use client";

import { Stats } from "@/types/product-stats";
import { getImage } from "@/utils/client-helpers";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showErrorToast } from "@/utils/toast-helpers";
import sort from "@/public/table/sort.svg";
import NoRecordsFound from "../NoRecordsFound";

const ProductsStats = ({ productsStats }: { productsStats: Stats | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState(searchParams.get("startDate") ?? '');
  const [endDate, setEndDate] = useState(searchParams.get("endDate") ?? '');

  const handleFilter = () => {
    if (!startDate || !endDate) {
      showErrorToast('Please select both start and end dates, or leave both fields empty.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      showErrorToast('Start date cannot be greater than end date.');
      return;
    }

    const queryParams = {
      startDate,
      endDate,
    };

    type T = typeof queryParams;

    const queryString = Object.keys(queryParams)
      .filter(key => queryParams[key as keyof T] !== undefined && queryParams[key as keyof T] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams?.[key as keyof T] as string)}`)
      .join('&');

    router.push(`/statistics?${queryString}`);
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Products Stats</h2>
        <div className="flex flex-wrap gap-4 min-h-9">
          <label className="text-sm mb-1 mt-2">Start Date:</label>
          <input type="date" className="border p-2 rounded-md text-xs" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label className="text-sm mb-1 mt-2">End Date:</label>
          <input type="date" className="border p-2 rounded-md text-xs" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button className="inline-flex text-black text-justify bg-[#f7fafc] rounded-xl cursor-pointer w-28 h-9 pt-1 border border-[#e0e0e0] border-solid" onClick={handleFilter}>
            <p className="text-[#5f5f5f] text-base font-normal mx-4">Filter</p>{" "}
            <Image src={sort} alt="flt" />
          </button>
        </div>
      </div>
      {productsStats?.items?.length === 0 && (
        <NoRecordsFound record="products" />
      )}
      {productsStats?.items && productsStats?.items?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Total Orders</th>
                <th className="px-4 py-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {productsStats?.items?.map((product) => (
                <tr key={product.id}>
                  <td className="border px-4 py-2">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Image src={getImage(product.image, product.image_type)} alt={product.title} width={100} height={100} className="h-12 w-12 object-cover rounded-full" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">{product.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border px-4 py-2">{product?.orders ?? 0}</td>
                  <td className="border px-4 py-2">{product?.cost ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsStats;