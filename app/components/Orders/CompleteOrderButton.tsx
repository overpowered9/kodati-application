"use client";

import { useMutation } from '@tanstack/react-query';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';
import { useRouter } from 'next/navigation';
import LoadingButton from '../LoadingButton';

const CompleteOrderButton = ({ orderId }: { orderId: number }) => {
  const router = useRouter();

  const completeOrder = async () => {
    const response = await fetch(`/api/orders/${orderId}/complete`, {
      method: 'PATCH',
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while fulfilling the order');
    }
  };

  const { mutate, isPending: loading } = useMutation({
    mutationFn: completeOrder,
    onSuccess: () => {
      showSuccessToast('Order fulfilled successfully');
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
  });

  return (
    <div>
      <LoadingButton className="w-24" onClick={() => mutate()} buttonText={"Complete Order"} loading={loading} />
    </div>
  );
};

export default CompleteOrderButton;
