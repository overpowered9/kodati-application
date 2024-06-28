"use client";

import { useSearchParams } from "next/navigation";
import PaginationControls from "../../Pagination";
import Search from "../../Search";
import Image from "next/image";

const SallaProducts = ({ providerProducts, selectedProviderProduct, onSelectProviderProduct }: { providerProducts: any, selectedProviderProduct: string, onSelectProviderProduct: (product: string) => void }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div className="bg-white p-4 shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Provider Products</h2>
      <div className="flex items-center rounded-md bg-white p-2 shadow-md mb-4">
        <Search search={search ?? ''} />
      </div>
      <ul className="mt-4">
        {providerProducts?.data?.map((product: any, index: number) => (
          <li key={index + 1} className={`flex justify-between border-b py-4 ${selectedProviderProduct === product?.sku ? 'bg-yellow-100' : ''} `}>
            <div className="flex items-center space-x-4">
              <Image src={product.main_image ?? ""} alt={product?.name} className="w-18 h-18 object-cover rounded-full" width={100} height={100} /> {/* main_image not in docs */}
              <div>
                <h3 className="text-xl font-semibold">{product?.name}</h3>
                <p className="text-gray-600 break-all whitespace-normal">{product?.description}</p>
                <p className="text-green-600 font-semibold">{product?.price?.amount} {product?.price?.currency}</p>
              </div>
            </div>
            <button className={`text-white px-4 py-2 rounded max-h-9 self-center mr-2 ${selectedProviderProduct === product?.sku ? 'bg-red-500' : 'bg-blue-500'}`} onClick={() => onSelectProviderProduct(product?.sku)}>
              {selectedProviderProduct === product?.sku ? "Unselect" : "Select"}
            </button>
          </li>
        ))}
      </ul>
      <PaginationControls totalPages={providerProducts?.pagination?.totalPages} providerPagination={true} />
    </div>
  )
}

export default SallaProducts;