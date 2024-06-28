"use client";

import { Product } from "@/database/models";
import { showErrorToast, showSuccessToast } from "@/utils/toast-helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { FormEvent, useState } from "react";

const AddToCart = ({ product, onClose }: { product: Product | null, onClose: () => void }) => {
  const queryClient = useQueryClient();
  if (!product) return null;
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await fetch('/api/carts', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id, quantity }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error);
    }
  };

  const { mutate: handleAddToCart, isPending: loading } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      showSuccessToast('Product added to cart successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while adding the product to the cart');
    },
    onSettled: () => {
      onClose();
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddToCart();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md w-full sm:max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center items-center mb-4">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-md overflow-hidden">
              <Image width={256} height={256} src={product.image ? `data:${product.image_type};base64,${Buffer.from(product.image).toString('base64')}` : ""} alt={product.title} />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center mb-4">
              <label htmlFor="quantity" className="mr-2 text-gray-700 font-medium">Quantity:</label>
              <input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-28 h-12 border border-blue-400 border-solid rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex justify-center">
              <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">Add to Cart</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;