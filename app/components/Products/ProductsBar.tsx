"use client";

import Image from "next/image";
import styles from "./product.module.css";
import gridview from "@/public/products/gridview.svg";
import listview from "@/public/products/listview.svg";
import Search from "../Search";
import Link from 'next/link';
import Select from 'react-select';
import { Region, User } from "@/database/models";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Option } from "@/types/select-options";
import { useSession } from "next-auth/react";
import { ViewType } from "@/types";

const ProductsBar = ({ onViewChange, view, totalItems, search, regions, currentRegion }: { onViewChange?: (view: ViewType) => void, view?: ViewType, totalItems: number | undefined, search?: string, regions: Region[] | null, currentRegion?: Option }) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Option | null>(currentRegion ?? null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { data: session } = useSession();
  const user = session?.user as User;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegionChange = (selectedOption: Option | null) => {
    setSelectedRegion(selectedOption);
    let url = '/products';

    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    if (selectedOption) {
      const separator = category ? '&' : '?';
      url += `${separator}region=${encodeURIComponent(selectedOption.label)}`;
    }

    router.push(url);
  };

  return (
    <div className={styles.parent_div_buttons}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="w-64 h-9 flex-shrink-0 text-[#1C1C1C] font-semibold text-4xl">Products</h2>
      </div>
      <div className={styles.Buttons_items}>
        <div className={styles.numberofitems_parent} style={{ marginRight: onViewChange ? '85px' : '200px' }}>
          <p className={styles.number_of_items}>{totalItems} </p>
          <p>{""}</p>
          <p className={styles.itemstext}> Items</p>
        </div>

        <div className="w-44">
          {isClient ? (
            <Select id="regions" name="regions" isClearable value={selectedRegion} onChange={handleRegionChange} options={regions?.map((region) => ({ value: region.id, label: region.name }))} placeholder="Regions..." />
          ) :
            <p>Loading...</p>
          }
        </div>

        <div className="flex items-center rounded-md bg-white p-1 shadow-md border border-solid border-[#DEE2E7]">
          <Search search={search} />
        </div>
        {onViewChange && (
          <div className={styles.viewbuttons}>
            <button className={`${styles.gridview} ${view === ViewType.Grid ? 'bg-gray-300 text-gray-700' : ''}`} onClick={() => onViewChange?.(ViewType.Grid)}>
              <Image className={styles.viewgridimage} src={gridview} alt="gridview" />
            </button>
            <button className={`${styles.listview} ${view === ViewType.List ? 'bg-gray-300 text-gray-700' : ''}`} onClick={() => onViewChange?.(ViewType.List)}>
              <Image className={styles.viewlistimage} src={listview} alt="listview" />
            </button>
          </div>
        )}
      </div>
      {user?.role === 'admin' &&
        <div className="flex sm:w-[85vw] flex-wrap gap-2 pr-5 md:flex-row overflow-hidden w-[85vw] lg:ml-[0px] mt-3  ">
          <Link href={`/admin/products/create`} className="bg-blue-500 text-center text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700" target="_blank">Add Product</Link>
          <Link href={`/admin/categories/create`} className="bg-blue-500 text-center text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700" target="_blank">Add Categories</Link>
          <Link href={`/admin/categories`} className="bg-blue-500 text-center text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700" target="_blank">View Categories</Link>
          <Link href={`/admin/regions/create`} className="bg-blue-500 text-center text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700" target="_blank">Add Regions</Link>
          <Link href={`/admin/regions`} className="bg-blue-500 text-center text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700" target="_blank">View Regions</Link>
        </div>
      }
    </div>
  );
};

export default ProductsBar;