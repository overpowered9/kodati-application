"use client";

import { Stats } from "@/types/product-stats";
import Cards from "./Cards";
import DonutChart from "./DonutChart";
import ProductsStats from "./ProductsStats";
import styles from "./statistics.module.css";
import PaginationControls from "../Pagination";

const Statistics = ({ productsStats }: { productsStats: Stats | null }) => {
  return (
    <>
      <div className={styles.upperarea}>
        <div className={styles.leftpart}>
          <Cards />
        </div>
        <div>
          <DonutChart productsStats={productsStats} />
        </div>
      </div>
      <ProductsStats productsStats={productsStats} />
      <div className="p-4">
        <PaginationControls totalPages={productsStats?.totalPages} />
      </div>
    </>
  );
};

export default Statistics;