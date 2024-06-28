import table from "@/app/components/Dashboard/TransactionsTable/table.module.css"
import styles from "./linked_products.module.css";
import LinkedProductsBar from "./LinkedProductsBar";
import PaginationControls from "../Pagination";
import { PaginatedProducts } from "@/types/pagination-types";
import { AdminLinkedProduct } from "@/database/models";

const renderLinkedProductsColumn = (adminLinkedProducts: AdminLinkedProduct[] | undefined, keyExtractor: (adminProduct: AdminLinkedProduct) => number | string | undefined, price: number) => (
  <td className={styles.td}>
    <table style={{ border: 'none' }}>
      <tbody>
        {adminLinkedProducts?.map((adminProduct, index: number) => (
          <tr key={index + 1}>
            <td className={`${parseFloat(adminProduct?.converted_price as any) < parseFloat(price as any) ? "text-green-600" : "text-red-600"}`}>{keyExtractor(adminProduct)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </td>
);

const renderLinkedProducts = (adminLinkedProducts: AdminLinkedProduct[] | undefined, price: number) => (
  <>
    {renderLinkedProductsColumn(adminLinkedProducts, (adminProduct: AdminLinkedProduct) => adminProduct.provider_product_id, price)}
    {renderLinkedProductsColumn(adminLinkedProducts, (adminProduct: AdminLinkedProduct) => `${adminProduct.currency_code} ${adminProduct.min_price}`, price)}
    {renderLinkedProductsColumn(adminLinkedProducts, (adminProduct: AdminLinkedProduct) => adminProduct?.Provider?.name, price)}
    {renderLinkedProductsColumn(adminLinkedProducts, (adminProduct: AdminLinkedProduct) => `SAR ${adminProduct?.converted_price}`, price)}
  </>
);

const LinkedProductsTable = ({ response, search }: { response: PaginatedProducts | null, search?: string }) => {
  return (
    <div className="mb-44 container">
      <h2 className={styles.Products}>Products Price</h2>
      <div className={styles.table_parent_div}>
        <LinkedProductsBar totalItems={response?.items?.length} search={search} />
        <table className={styles.table1}>
          <thead className={table.thead1}>
            <tr className={table.tr}>
              <th>Sr No</th>
              <th>SKU (Admin)</th>
              <th>SKU (Company)</th>
              <th>Company Price</th>
              <th>Company Name</th>
              <th>Company Price (SAR)</th>
              <th>Admin Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {response?.items?.map((product, index) => (
              <tr key={index + 1}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{product?.id}</td>
                {renderLinkedProducts(product?.AdminLinkedProducts, product?.price)}
                <td className={styles.td}>{"SAR " + product?.price}</td>
                <td className={styles.td}>{product?.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls totalPages={response?.totalPages} />
      </div>
    </div>
  )
}

export default LinkedProductsTable;