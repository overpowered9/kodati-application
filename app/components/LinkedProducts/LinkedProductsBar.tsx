"use client";

import styles from "./linked_products.module.css";
import Search from "../Search";
import RefreshPricesButton from "./RefreshPricesButton";

const LinkedProductsBar = ({ totalItems, search }: { totalItems: number | undefined, search?: string }) => {
  return (
    <div className={styles.Buttons_items}>
      <div className={styles.numberofitems_parent}>
        <p className={styles.number_of_items}>{totalItems} </p>
        <p>{""}</p>
        <p className={styles.itemstext}> Items</p>
      </div>
      <div className="flex-col justify-items-start gap-[22px] mr-2 items-center sm:flex-row">
        <RefreshPricesButton />
        <div className={styles.searchdiv}>
          <Search search={search} />
        </div>
      </div>
    </div>
  );
};

export default LinkedProductsBar;
