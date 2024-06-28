"use client";

import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import LoadingButton from '../LoadingButton';
import { useRouter } from 'next/navigation';

const AddTransaction = ({ userId, onClose }: { userId: number, onClose: () => void }) => {
  const router = useRouter();
  const [amount, setAmount] = useState('');

  const addTransaction = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!amount || isNaN(parseFloat(amount))) {
      throw new Error("Invalid amount entered. Please enter a valid amount");
    }
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        amount,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error);
    }
  };

  const { mutate: handleAddTransaction, isPending: loading } = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      showSuccessToast('Transaction added successfully');
      onClose();
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while adding the transaction');
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
        <label htmlFor="amount">Amount:</label>
        <input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={`outline-none border focus:outline-none focus:border-[#e5e7eb] rounded-md p-2 mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading} />
        <div className="flex justify-end">
          <LoadingButton buttonText={"Add"} onClick={() => handleAddTransaction()} loading={loading} />
          <button className="ml-2 text-gray-600 w-24" onClick={onClose} >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
