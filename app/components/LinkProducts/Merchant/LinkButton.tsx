import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import LoadingButton from '../../LoadingButton';
import { useRouter } from 'next/navigation';

export default function LinkButton({ local_product_id, provider_product_id }: { local_product_id: number | null, provider_product_id: string }) {
  const router = useRouter();

  const linkProducts = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!local_product_id || !provider_product_id) {
      throw new Error('Invalid data');
    }
    const response = await fetch(`/api/link-products/merchant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        local_product_id,
        provider_product_id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to link the products');
    }
  };

  const { mutate: merchantLinking, isPending: loading } = useMutation({
    mutationFn: linkProducts,
    onSuccess: () => {
      router.refresh();
      showSuccessToast('Products linked successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
  });

  if (!local_product_id || !provider_product_id) return null;

  return (
    <LoadingButton onClick={() => merchantLinking()} buttonText={"Link Products"} loading={loading} />
  );
}