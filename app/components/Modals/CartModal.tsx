"use client";

import { CartItem } from "@/database/models";
import { showErrorToast, showSuccessToast } from "@/utils/toast-helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

const CartModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();

  const fetchCartItems = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await fetch('/api/carts');

    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }

    const data = await response.json();
    return data?.items as CartItem[];
  };

  const { data: cartItems, isFetching, error } = useQuery({
    queryKey: ['cartItems'],
    queryFn: () => fetchCartItems(),
    retryOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  const createOrder = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Your cart is empty');
    }
    const response = await fetch('/api/orders', { method: 'POST' });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error);
    }
  };

  const { mutate: handleCreateOrder, isPending: loading } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      showSuccessToast('Order placed successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while placing the order');
    },
    onSettled: () => {
      onClose();
    },
  });

  if (loading) return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <div className="flex items-center justify-center mb-4">
          <FaSpinner className="animate-spin mr-2" /> Placing order...
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {isFetching ? (
          <div className="flex items-center justify-center mb-4">
            <FaSpinner className="animate-spin mr-2" /> Loading...
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error.message}</p>
        ) : cartItems && cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4">
                    <Image src={`data:${item.Product.image_type};base64,${Buffer.from(item.Product.image).toString('base64')}`} alt={item.Product.title} width={48} height={48} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.Product.title}</p>
                    <p className="text-sm text-gray-500">Price: ${item.Product.price}</p>
                  </div>
                </div>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Your cart is empty</p>
        )}
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={() => handleCreateOrder()}>
            Checkout
          </button>
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartModal;