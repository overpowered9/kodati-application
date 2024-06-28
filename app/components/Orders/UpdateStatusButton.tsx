"use client";

import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import LoadingButton from '../LoadingButton';

const UpdateSatusButton = ({ orderId }: { orderId: number }) => {
  const router = useRouter();

  const forwardToAdmin = async () => {
    const response = await fetch(`/api/orders/${orderId}/forward`, {
      method: 'PATCH',
    });

    try {
      await fetch(`/api/orders/${orderId}/complete`, { method: 'PATCH' });
    } catch (error) {}

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error);
    }
  };

  const { mutate: forwardOrder, isPending: loading } = useMutation({
    mutationFn: forwardToAdmin,
    onSuccess: () => {
      showSuccessToast('Order forwarded successfully');
      router.refresh();
    },
    onError: async (error) => {
      showErrorToast(error?.message || 'An error occurred while forwarding the order to admin');
    },
  });

  return (
    <div>
      <LoadingButton className="w-24" onClick={() => forwardOrder()} buttonText={"Forward to admin"} loading={loading} />
    </div>
  );
}

export default UpdateSatusButton;