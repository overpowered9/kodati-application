"use client";

import table from "../Dashboard/TransactionsTable/table.module.css";
import { formatDateTime } from "@/utils/date-helpers";
import PaginationControls from "../Pagination";
import AdminBar from "../AdminBar";
import { PaginatedStore } from "@/types/pagination-types";
import NoRecordsFound from "../NoRecordsFound";
import { useState } from "react";
import { Customer } from "@/database/models";
import CustomerPopup from "../Orders/CustomerPopup";

const StoreTransactions = ({ store, search, name }: { store: PaginatedStore | null, search?: string, name: string | null }) => {
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  const showCustomer = (customer?: Customer) => {
    setCustomer(customer);
  };

  return (
    <>
      <AdminBar search={search} name={name} />
      <div className={table.bodydiv} style={{ marginTop: '210px' }}>
        <div className={table.h2}>
          <h2 className={table.transactionheading}>
            {store?.user?.name} Transactions ({store?.totalItems})
          </h2>
        </div>
        {store?.user?.Transactions?.length === 0 && (
          <NoRecordsFound record="transactions" />
        )}
        {store?.user?.Transactions && store?.user?.Transactions?.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th className="max-sm:p-2">Sr No</th>
                  <th className="max-sm:p-2">Transaction ID</th>
                  <th className="max-sm:p-2">Order ID</th>
                  <th className="max-sm:p-2">Customer</th>
                  <th className="max-sm:p-2">Reason</th>
                  <th className="max-sm:p-2">Balance Before</th>
                  <th className="max-sm:p-2">Balance After</th>
                  <th className="max-sm:p-2">Amount</th>
                  <th className="max-sm:p-2">Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {store?.user?.Transactions?.map((transaction, index) => (
                  <tr key={transaction?.id}>
                    <td>{index + 1}</td>
                    <td>{transaction?.id}</td>
                    <td>{transaction?.Order?.id ?? '-'}</td>
                    <td>
                      {transaction?.Order?.Customer ?
                        <button className="text-blue-500 hover:underline focus:outline-none" onClick={() => showCustomer(transaction?.Order?.Customer)}>Show</button>
                        : "-"
                      }
                    </td>
                    <td>{transaction?.reason.toUpperCase()}</td>
                    <td>{transaction?.previous_balance}</td>
                    <td>{transaction?.current_balance}</td>
                    <td>{transaction?.transaction_amount}</td>
                    <td>{formatDateTime(transaction?.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customer && (
              <CustomerPopup customer={customer} onClose={() => setCustomer(undefined)} />
            )}
            <div className={table.pagination}>
              <PaginationControls totalPages={store?.totalPages} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StoreTransactions;
