"use client";

import { sanitizeAndRenderHTML } from "@/utils/client-helpers";
import Search from "../../Search";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

const ZidProducts = ({ providerProducts, selectedProviderProduct, onSelectProviderProduct }: { providerProducts: any, selectedProviderProduct: string, onSelectProviderProduct: (product: string) => void }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const search = searchParams.get("search");
  const currentPage = parseInt(searchParams.get("provider_page") || "1");
  const local_page = parseInt(searchParams.get("page") || "1");
  const linked = searchParams.get("linked");

  const handlePageChange = (page: number) => {
    let url = `${pathname}?provider_page=${encodeURIComponent(page)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (linked) url += `&linked=${encodeURIComponent(linked)}`;
    if (local_page) url += `&page=${encodeURIComponent(local_page)}`;
    router.push(url);
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Provider Products</h2>
      <div className="flex items-center rounded-md bg-white p-2 shadow-md mb-4">
        <Search search={search ?? ''} />
      </div>
      <ul className="mt-4">
        {providerProducts?.results?.map((product: any, index: number) => (
          <li key={index + 1} className={`flex justify-between border-b py-4 ${selectedProviderProduct === product?.id ? 'bg-yellow-100' : ''} `}>
            <div className="flex items-center space-x-4">
              <Image src={product?.images?.[0]?.image?.thumbnail ?? ""} alt={product?.name} className="w-18 h-18 object-cover rounded-full" width={100} height={100} />
              <div>
                <h3 className="text-xl font-semibold">{product?.name}</h3> {/* name is an object according to docs */}
                <div className="text-gray-600 break-all whitespace-normal" dangerouslySetInnerHTML={sanitizeAndRenderHTML(product?.short_description)}></div> {/* short_description not in docs */}
                <p className="text-green-600 font-semibold">{product?.price} {product?.currency}</p>
              </div>
            </div>
            <button className={`text-white px-4 py-2 rounded max-h-9 self-center mr-2 ${selectedProviderProduct === product?.id ? 'bg-red-500' : 'bg-blue-500'}`} onClick={() => onSelectProviderProduct(product?.id)}>
              {selectedProviderProduct === product?.id ? "Unselect" : "Select"}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={providerProducts?.previous === null}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-l focus:outline-none disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={providerProducts?.next === null}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r focus:outline-none disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )

};

export default ZidProducts;