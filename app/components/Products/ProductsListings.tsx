"use client";

import { useEffect, useState } from "react";
import DeleteModal from '../Modals/DeleteModal';
import PaginationControls from "../Pagination";
import ProductsBar from "./ProductsBar";
import { PaginatedProducts } from '@/types/pagination-types';
import { Region } from "@/database/models";
import NoRecordsFound from "../NoRecordsFound";
import GridProducts from "./GridProducts";
import ListProducts from "./ListProducts";
import { ViewType } from "@/types";

const ProductsListings = ({ response, search, regions }: { response: PaginatedProducts | null, search?: string, regions: Region[] | null }) => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('currentView');
      return savedView ? (parseInt(savedView) as ViewType) : ViewType.Grid;
    }
    return ViewType.Grid;
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentView', currentView.toString());
    }
  }, [currentView]);

  return (
    <>
      <ProductsBar onViewChange={handleViewChange} view={currentView} totalItems={response?.totalItems} search={search} regions={regions} currentRegion={response?.items?.[0]?.Regions?.[0]} />
      {response?.items?.length === 0 && (
        <NoRecordsFound record="products" />
      )}
      {currentView === ViewType.List && (
        <ListProducts response={response} setSelectedProductId={setSelectedProductId} search={search} />
      )}
      {currentView === ViewType.Grid && (
        <GridProducts response={response} setSelectedProductId={setSelectedProductId} search={search} />
      )}
      <PaginationControls totalPages={response?.totalPages} />
      {selectedProductId && (
        <DeleteModal productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
      )}
    </>
  );
};
export default ProductsListings;
