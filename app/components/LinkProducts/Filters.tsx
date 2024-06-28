"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const linkedParam = searchParams.get("linked");
  const linked = linkedParam === null || linkedParam === undefined || linkedParam.toLowerCase() !== "false";
  const search = searchParams.get("search");
  const currentPage = searchParams.get("provider_page");
  const [showLinked, setShowLinked] = useState(linked);

  const handleFilterChange = (value: boolean) => {
    setShowLinked(value);
    let url = `${pathname}?linked=${encodeURIComponent(JSON.stringify(value))}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (currentPage) url += `&provider_page=${encodeURIComponent(parseInt(currentPage))}`;
    router.push(url);
  };

  return (
    <div className="flex items-center rounded-md bg-white p-2 shadow-md mb-4">
      <input type="radio" name="filter" value="linked" id="linked" className="mr-2" checked={showLinked} onChange={() => handleFilterChange(true)} />
      <label htmlFor="linked" className="cursor-pointer text-gray-800 hover:text-gray-900">Linked</label>
      <input type="radio" name="filter" value="unlinked" id="unlinked" className="mr-2 ml-4" checked={!showLinked} onChange={() => handleFilterChange(false)} />
      <label htmlFor="unlinked" className="cursor-pointer text-gray-800 hover:text-gray-900">Unlinked</label>
    </div>
  );
}

export default Filters;