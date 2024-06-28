import table from "@/app/components/Dashboard/TransactionsTable/table.module.css";
import styles from "../LinkedProducts/linked_products.module.css";
import PaginationControls from "../Pagination";
import { PaginatedLogs } from "@/types/pagination-types";
import Search from "../Search";
import { formatDateTime } from "@/utils/date-helpers";

const LogsTable = ({ response, search }: { response: PaginatedLogs | null, search?: string }) => {
  return (
    <div className="container">
      <h2 style={{ left: "30px" }} className={styles.Products}>App Logs</h2>
      <div className={styles.parent_container}>
        <div className={styles.logs_bar}>
          <div className={styles.numberofitems_parent}>
            <p className={styles.number_of_items}>{response?.totalItems}</p>
            <p className={styles.itemstext}> Items</p>
          </div>
          <div className="mr-2 pr-0 inline-flex items-center gap-2 py-2 pl-2 rounded-lg border-solid border border-[#dee2e7]">
            <Search search={search} />
          </div>
        </div>
        <table>
          <thead className={table.thead1}>
            <tr className={table.tr}>
              <th className="py-2 px-3 border-b whitespace-nowrap">Sr No</th>
              <th className="py-2 px-3 border-b">ID</th>
              <th className="py-2 px-3 border-b whitespace-nowrap">Merchant ID</th>
              <th className="py-2 px-3 border-b whitespace-nowrap">Merchant Email</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Details</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-3 border-b">Type</th>
              <th className="py-2 px-3 border-b">Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {response?.items?.map((log, index) => (
              <tr key={index + 1}>
                <td className={`${styles.logs_cells} text-center px-4`}>{index + 1}</td>
                <td className={`${styles.logs_cells} text-center px-4`}>{log?.id}</td>
                <td className={`${styles.logs_cells} text-center px-4`}>{log?.user_id}</td>
                <td className={`${styles.logs_cells} text-center px-4`}>{log?.User?.email}</td>
                <td className={`${styles.logs_cells} text-center px-4`}>{log?.action}</td>
                <td className={`${styles.logs_cells} text-center px-4`}>{log?.details}</td>
                <td className={`${styles.logs_cells} text-center`}>{log?.status}</td>
                <td className={`${styles.logs_cells} text-center px-3`}>{log?.type}</td>
                <td className={`${styles.logs_cells} text-center px-3`}>{formatDateTime(log?.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={table.pagination}>
          <PaginationControls totalPages={response?.totalPages} />
        </div>
      </div>
    </div>
  );
};

export default LogsTable;
