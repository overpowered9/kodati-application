import { sanitizeAndRenderHTML } from "@/utils/client-helpers";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const ZidLinkedProductPopup = ({ id, onClose }: { id: string, onClose: () => void }) => {
  const fetchLinkedProduct = async () => {
    const response = await fetch(`/api/merchant-products/${id}`);
    if (!response.ok) {
      throw new Error('An error occurred while fetching the product');
    }
    const data = await response.json();
    return data.product;
  };

  const { data: linkedProduct, isFetching, error } = useQuery({
    queryKey: ['linked-product', id],
    queryFn: () => fetchLinkedProduct(),
    enabled: !!id,
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
              <Image width={100} height={100} src={linkedProduct?.images?.[0]?.image?.thumbnail} alt={linkedProduct.name?.en} className="object-cover rounded-full" />
              <h2 className="text-2xl font-semibold my-2">{linkedProduct.name?.en}</h2>
              <div className="text-gray-600 break-all whitespace-normal" dangerouslySetInnerHTML={sanitizeAndRenderHTML(linkedProduct?.short_description?.en)}></div> {/* short_description not in docs */}
              <p className="text-green-600 font-semibold mt-2">{linkedProduct?.price} {linkedProduct?.currency}</p>
            </div>
          </>
        )}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ZidLinkedProductPopup;