"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import style from "./general.module.css";
import { pagesToShow } from "@/constants";

const PaginationControls = ({ totalPages, providerPagination }: { totalPages?: number | null, providerPagination?: boolean }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  let path = providerPagination ? "provider_page" : "page";
  let providerPath = providerPagination ? "page" : "provider_page";
  const providerPage = parseInt(searchParams.get(providerPath) || "");
  const currentPage = parseInt(searchParams.get(path) || "1");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const sortOption = searchParams.get("sortOption");
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const region = searchParams.get("region");
  const linked = searchParams.get("linked");

  const handlePageChange = (page: number) => {
    let url = `${pathname}?${path}=${encodeURIComponent(page)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (startDate && endDate) url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    if (sortOption) url += `&sortOption=${encodeURIComponent(sortOption)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (region) url += `&region=${encodeURIComponent(region)}`;
    if (linked) url += `&linked=${encodeURIComponent(linked)}`;
    if (providerPage) url += `&${providerPath}=${encodeURIComponent(providerPage)}`;
    router.push(url);
  };

  const renderPagination = () => {
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage;
      pageButtons.push(
        <button key={i} onClick={() => handlePageChange(i)} disabled={isActive} style={isActive ? { cursor: 'default', opacity: '0.5' } : {}}>
          {i}
        </button>
      );
    }

    return (
      <div className={style.pagination_parent_div}>
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            {"< Previous"}
          </button>
        )}
        {pageButtons}
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            {"Next >"}
          </button>
        )}
      </div>
    );
  };

  return <div>{renderPagination()}</div>;
};

export default PaginationControls;