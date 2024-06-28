"use client";

import { Card, OrderItem } from "@/database/models";
import { useState } from "react";
import CardsPopup from "./CardsPopup";

const OrderItemsPopup = ({ orderItems, onClose }: { orderItems: OrderItem[], onClose: () => void }) => {
  const [cards, setCards] = useState<Card[] | undefined>(undefined);

  const showCards = (cards?: Card[]) => {
    setCards(cards);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-4xl mx-4 md:mx-auto rounded-lg overflow-hidden shadow-md z-50 overflow-y-auto max-h-[28rem]">
        <div className="flex justify-between p-4">
          <h2 className="text-2xl font-semibold">Order Items</h2>
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto m-0">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Sr No</th>
                  <th className="py-3">Provider ID</th>
                  <th className="py-3">Local ID</th>
                  <th className="py-3">Quantity</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Currency</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Cards</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 max-w-xs break-words">{index + 1}</td>
                    <td className="py-3 max-w-xs break-words">{item.provider_product_id ?? "-"}</td>
                    <td className="py-3 max-w-xs break-words">{item.local_product_id}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">{item.amount}</td>
                    <td className="py-3">{item.currency}</td>
                    <td className="py-3 max-w-xs break-words">{item.status ?? "-"}</td>
                    <td className="py-3 max-w-xs break-words">
                      {item?.Cards && item?.Cards?.length > 0 ?
                        <button className="text-blue-500 hover:underline focus:outline-none" onClick={() => showCards(item?.Cards)}>Show Cards</button>
                        : "-"
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {cards && (
        <CardsPopup cards={cards} onClose={() => setCards(undefined)} />
      )}
    </div>
  );
};

export default OrderItemsPopup;
