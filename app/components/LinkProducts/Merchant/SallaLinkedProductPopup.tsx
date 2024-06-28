import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const SallaLinkedProductPopup = ({ sku, onClose }: { sku: string, onClose: () => void }) => {
  const fetchLinkedProduct = async () => {
    const response = await fetch(`/api/merchant-products/${sku}`);
    if (!response.ok) {
      throw new Error('An error occurred while fetching the product');
    }
    const data = await response.json();
    return data.product.data;
  };

  const { data: linkedProduct, isFetching, error } = useQuery({
    queryKey: ['linked-product', sku],
    queryFn: () => fetchLinkedProduct(),
    enabled: !!sku,
    retryOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {isFetching && <p className="text-center my-4 text-[deepskyblue] text-xl">Loading...</p>}
        {error && <p className="text-red-600">An error occurred while fetching the product</p>}
        {linkedProduct && (
          <>
            <div className="flex flex-col items-center mb-4">
              <Image width={100} height={100} src={linkedProduct.main_image} alt={linkedProduct.name} className="object-cover rounded-full" /> {/* main_image not in docs */}
              <h2 className="text-2xl font-semibold my-2">{linkedProduct.name}</h2>
              <p className="text-gray-600 break-all whitespace-normal">{linkedProduct.description}</p>
              <p className="text-green-600 font-semibold mt-2">{linkedProduct.price?.amount} {linkedProduct?.price?.currency}</p>
            </div>
          </>
        )}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SallaLinkedProductPopup;