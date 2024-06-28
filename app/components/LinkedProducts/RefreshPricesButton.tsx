"use client";

import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import LoadingButton from '../LoadingButton';
import { useRouter } from 'next/navigation';

const RefreshPricesButton = () => {
  const router = useRouter();
  const refreshPrices = async () => {
    const response = await fetch('/api/refresh-prices', {
      method: 'GET',
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!response.ok) {
      throw new Error('An error occurred while refreshing the prices');
    }
  };

  const { mutate: handleRefreshPrices, isPending: loading } = useMutation({
    mutationFn: refreshPrices,
    onSuccess: async () => {
      showSuccessToast('Prices refreshed successfully');
      router.refresh();
    },
    onError: async (error) => {
      showErrorToast(error?.message);
    },
  });

  return (
    <>
      <LoadingButton onClick={() => handleRefreshPrices()} buttonText={"Refresh Prices"} loading={loading} />
    </>
  );
};

export default RefreshPricesButton;
