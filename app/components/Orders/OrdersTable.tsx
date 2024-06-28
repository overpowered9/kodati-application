"use client";

import table from "../Dashboard/TransactionsTable/table.module.css";
import { PaginatedOrders } from "@/types/pagination-types";
import PaginationControls from "../Pagination";
import { formatDateTime } from "@/utils/date-helpers";
import Search from "../Search";
import UpdateSatusButton from "./UpdateStatusButton";
import CompleteOrderButton from "./CompleteOrderButton";
import { useState } from "react";
import OrderItemsPopup from "./OrderItemsPopup";
import { Customer, OrderItem } from "@/database/models";
import NoRecordsFound from "../NoRecordsFound";
import CustomerPopup from "./CustomerPopup";
import { capitalizeFirstLetter } from "@/utils/client-helpers";
import { getStatusColor } from "../utils";

const OrdersTable = ({ response, search, role }: { response: PaginatedOrders | null, search?: string, role: 'admin' | 'user' }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[] | undefined>(undefined);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  const showItems = (orderItems?: OrderItem[]) => {
    setOrderItems(orderItems);
  };

  const showCustomer = (customer?: Customer) => {
    setCustomer(customer);
  };

  return (
    <>
      <div className="lg:flex mt-40 mb-4 items-center sm:flex ml-11">
        <h2 className="font-inter text-2xl mb-4 font-semibold capitalize">Orders</h2>
      </div>
      <div className={table.bodydiv1}>
        <div className="min-w-[728px] mx-auto flex flex-col items-center border border-gray-300 rounded-[16px] px-[21px] bg-white lg:max-w-screen-xl overflow-x-hidden 2xl:max-w-screen-2xl w-[94vw]">
          <div className="mt-[21px] bg-white w-full box-border relative h-55 text-gray-700 font-inter font-semibold text-xl capitalize">
            <h2 className="relative left-3 font-inter text-2xl font-semibold capitalize">
              All({response?.items?.length})
            </h2>
            <div className="flex justify-evenly">
              <div className="absolute top-[0px] right-[1%] flex h-[40px] border border-solid rounded-[8px] p-2 pr-3 items-center gap-2 border-gray-300 bg-white">
                <Search search={search} />
              </div>
            </div>
          </div>
          {response?.items?.length === 0 && (
            <NoRecordsFound record="orders" />
          )}
          {response?.items && response?.items?.length > 0 && (
            <>
              <table>
                <thead className={table.thead1}>
                  <tr className={table.tr}>
                    <th>Sr No</th>
                    <th>Order ID</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Balance Before</th>
                    <th>Balance After</th>
                    <th>Customer</th>
                    {role === 'admin' && (<><th>Store</th><th>Source</th></>)}
                    <th>Date / Time</th>
                    <th>Status</th>
                    <th colSpan={2}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {response?.items?.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.id}</td>
                      <td>{order?.OrderItems?.reduce((previous, current) => previous + current?.quantity, 0)}</td>
                      <td>{order?.OrderItems?.reduce((previous, current) => (parseFloat(previous as any) + parseFloat(current?.amount as any)), 0).toFixed(2)}</td>
                      <td>{order?.Transaction?.previous_balance ?? '-'}</td>
                      <td>{order?.Transaction?.current_balance ?? '-'}</td>
                      <td>
                        {order?.Customer ?
                          <button className="text-blue-500 hover:underline focus:outline-none" onClick={() => showCustomer(order?.Customer)}>Show</button>
                          : "-"
                        }
                      </td>
                      {role === 'admin' && (<><td>{order?.User?.name}</td><td>{order?.source}</td></>)}
                      <td>{formatDateTime(order?.created_at)}</td>
                      <td>
                        <p className={`rounded-md px-2 py-1 text-white font-semibold ${getStatusColor[order?.status]}`}>
                          {capitalizeFirstLetter(order?.status)}
                        </p>
                      </td>
                      <td className="flex justify-center items-center inherit h-[inherit] space-x-4">
                        {role === 'admin' && order?.status === 'approved' ? <CompleteOrderButton orderId={order?.id} /> : role === 'user' && order?.status === 'processing' ? <UpdateSatusButton orderId={order?.id} /> : null}
                        {order?.OrderItems && order?.OrderItems.length > 0 &&
                          <button className="bg-blue-500 w-24 text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300" onClick={() => showItems(order?.OrderItems)}>
                            Order Items
                          </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orderItems && (
                <OrderItemsPopup orderItems={orderItems} onClose={() => setOrderItems(undefined)} />
              )}
              {customer && (
                <CustomerPopup customer={customer} onClose={() => setCustomer(undefined)} />
              )}
              <div className={table.pagination}>
                <PaginationControls totalPages={response?.totalPages} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
