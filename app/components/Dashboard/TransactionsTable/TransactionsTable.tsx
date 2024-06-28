"use client";

import table from "./table.module.css";
import { PaginatedTransactions } from "@/types/pagination-types";
import { formatDateTime } from "@/utils/date-helpers";
import PaginationControls from "../../Pagination";
import BalanceButtons from "../../BalanceButtons/BalanceButtons";
import { Customer } from "@/database/models";
import AdminBar from "../../AdminBar";
import NoRecordsFound from "../../NoRecordsFound";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/utils/toast-helpers";
import CustomerPopup from "../../Orders/CustomerPopup";
import { QueryParams } from "@/types";

const TransactionsTable = ({ response, search, sortBy, start, end, role, name }: { response: PaginatedTransactions | null, search?: string, sortBy?: string, start?: string, end?: string, role: 'admin' | 'user', name: string | null }) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState(start ?? '');
  const [endDate, setEndDate] = useState(end ?? '');
  const [sortOption, setSortOption] = useState(sortBy ?? 'latest');
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  const handleFilter = () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      showErrorToast('Please select both start and end dates, or leave both fields empty.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      showErrorToast('Start date cannot be greater than end date.');
      return;
    }

    const queryParams: QueryParams = {
      startDate,
      endDate,
      sortOption,
    };

    const queryString = Object.keys(queryParams)
      .filter(key => queryParams[key as keyof QueryParams] !== undefined && queryParams[key as keyof QueryParams] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams?.[key as keyof QueryParams] as string)}`)
      .join('&');

    router.push(`/dashboard?${queryString}`);
  };

  const showCustomer = (customer?: Customer) => {
    setCustomer(customer);
  };

  return (
    <>
      {role === 'user' && (
        <BalanceButtons currentBalance={response?.currentBalance} search={search} name={name} />
      )}
      {role === 'admin' && (
        <AdminBar search={search} name={name} />
      )}
      <div className={table.bodydiv} style={{ marginTop: role === 'admin' ? '210px' : '470px' }}>
        <div className={table.h2}>
          <div className={table.Transaction_Fbar_Parent}>
            <h2 className={table.transactionheading}>
              Transactions({response?.totalItems})
            </h2>
          </div>
          <div className={table.tablebuttonsdiv}>
            <div className="flex flex-wrap gap-4 min-h-9">
              <label className="text-sm mb-1 mt-2">Start Date:</label>
              <input type="date" className="border p-2 rounded-md text-xs" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <label className="text-sm mb-1 mt-2">End Date:</label>
              <input type="date" className="border p-2 rounded-md text-xs" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <label className="text-sm mt-2 mb-1">Sort By:</label>
              <select className="border p-2 rounded-md" style={{ fontSize: "10px" }} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
              <button className="text-[#f7fafc] cursor-pointer rounded-xl border border-solid border-[#e0e0e0]" onClick={handleFilter}>
                <p className={table.pfilter}>Submit</p>
              </button>
            </div>
          </div>
        </div>
        {response?.items?.length === 0 && (
          <NoRecordsFound record="transactions" />
        )}
        {response?.items && response?.items?.length > 0 && (
          <>
            <table>
              <thead className={table.thead1}>
                <tr className={table.tr}>
                  <th>Sr No.</th>
                  <th>Transaction ID</th>
                  {role === 'admin' && <th>Store</th>}
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Reason</th>
                  <th>Balance Before</th>
                  <th>Balance After</th>
                  <th>Amount</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {response?.items?.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{transaction.id}</td>
                    {role === 'admin' && <td>{transaction?.User?.name}</td>}
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
              <PaginationControls totalPages={response?.totalPages} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TransactionsTable;