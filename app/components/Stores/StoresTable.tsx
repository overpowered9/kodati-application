"use client";

import table from "../Dashboard/TransactionsTable/table.module.css";
import { PaginatedStores } from "@/types/pagination-types";
import { useState } from "react";
import AddTransaction from "../Modals/AddTransaction";
import PaginationControls from "../Pagination";
import AdminBar from "../AdminBar";
import Link from "next/link";
import { highlightMatch } from "../utils";

const StoresTable = ({ response, search, name }: { response: PaginatedStores | null, search?: string, name: string | null }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <>
      <AdminBar search={search} name={name} />
      <div className={table.bodydiv} style={{ marginTop: '210px' }}>
        <div className={table.h2}>
          <h2 className={table.transactionheading}>
            Stores({response?.totalItems || 0})
          </h2>
        </div>
        <table>
          <thead className={table.thead1}>
            <tr className={table.tr}>
              <th className="max-sm:p-2">Sr No</th>
              <th className="max-sm:p-2">ID</th>
              <th className="max-sm:p-2">Name</th>
              <th className="max-sm:p-2">Balance</th>
              <th className="max-sm:p-2">Provider</th>
              <th className="max-sm:p-2">Email</th>
              <th className="max-sm:p-2">Mobile</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {response?.items?.map((store, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{store?.id}</td>
                <td>{highlightMatch(store?.name ?? '', search)}</td>
                <td>{store?.Transactions?.[0]?.current_balance ?? 0}</td>
                <td>{store?.provider}</td>
                <td>{highlightMatch(store?.email ?? '', search)}</td>
                <td>{store?.mobile ?? '-'}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button className="text-xs bg-blue-500 w-36 text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300" onClick={() => setSelectedUserId(store?.id)}>Add Transaction</button>
                    <Link href={`/admin/stores/${store?.id}`} target="_blank" className="text-xs bg-blue-500 w-36 text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300">View Transactions</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={table.pagination}>
          <PaginationControls totalPages={response?.totalPages} />
        </div>
      </div>
      {selectedUserId && (
        <AddTransaction userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </>
  );
};

export default StoresTable;
