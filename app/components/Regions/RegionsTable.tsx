"use client";

import { PaginatedRegions } from "@/types/pagination-types";
import Search from "../Search";
import Link from "next/link";
import { useState } from "react";
import PaginationControls from "../Pagination";
import DeleteRegion from "./DeleteRegion";

const RegionsTable = ({ regions, search }: { regions: PaginatedRegions | null, search?: string }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  return (
    <div className="container mx-auto mt-24">
      <h1 className="text-3xl font-bold my-4">Regions ({regions?.totalItems})</h1>
      <div className="flex items-center rounded-md bg-white p-2 shadow-md mb-4">
        <Search search={search} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {regions?.items?.map(region => (
          <div key={region.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{region.name}</h2>
            <p className="text-gray-600 mt-1">Code: {region.code}</p>
            <div className="flex space-x-2 justify-end">
              <Link href={`/admin/regions/${region?.id}/edit`} target="_blank">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none">
                  Edit
                </button>
              </Link>
              <button onClick={() => setSelectedRegionId(region?.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <PaginationControls totalPages={regions?.totalPages} />
      {selectedRegionId && (
        <DeleteRegion regionId={selectedRegionId} onClose={() => setSelectedRegionId(null)} />
      )}
    </div>
  );
};

export default RegionsTable;