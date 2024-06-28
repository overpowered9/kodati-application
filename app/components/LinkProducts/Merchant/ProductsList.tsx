"use client";

import LinkButton from './LinkButton';
import { useState } from 'react';
import Image from "next/image";
import Filters from '../Filters';
import SallaLinkedProductPopup from './SallaLinkedProductPopup';
import SallaProducts from './SallaProducts';
import NoRecordsFound from '../../NoRecordsFound';
import ZidProducts from './ZidProducts';
import ZidLinkedProductPopup from './ZidLinkedProductPopup';
import { PaginatedProducts } from '@/types/pagination-types';
import PaginationControls from '../../Pagination';

export default function ProductsList({ localProducts, providerProducts, provider }: { localProducts: PaginatedProducts | null, providerProducts: any, provider: 'salla' | 'zid' | null }) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [linkedProductId, setLinkedProductId] = useState<string | undefined>(undefined);
  const [selectedProviderProductId, setSelectedProviderProductId] = useState<string>('');

  const handleSelectProviderProduct = (id: string) => {
    setSelectedProviderProductId((previous) => (previous === id ? '' : id));
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProductId((previous) => (previous === id ? null : id));
  };

  const togglePopup = (sku: string | undefined) => {
    setLinkedProductId(sku);
  };

  return (
    <>
      <div className="flex justify-center mt-24">
        <LinkButton local_product_id={selectedProductId} provider_product_id={selectedProviderProductId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Local Products</h2>
          <Filters />
          {localProducts?.items?.length === 0 && (
            <NoRecordsFound record="products" />
          )}
          {localProducts && localProducts?.items?.length > 0 && (
            <ul>
              {localProducts?.items?.map((product) => (
                <li key={product.id} className={`flex items-center justify-between border-2 py-4 my-1 ${selectedProductId === product?.id ? 'bg-yellow-100' : ''} ${product?.MerchantLinkedProducts?.length ? 'border-green-500' : 'border-red-500'} `}>
                  <div className="flex items-center space-x-4">
                    <Image src={product.image ? `data:${product?.image_type};base64,${Buffer.from(product.image).toString('base64')}` : ""} width={100} height={100} alt={product?.title} className="w-18 h-18 object-cover rounded-full" />
                    <div>
                      <h3 className="text-xl font-semibold">{product?.title}</h3>
                      <p className="text-gray-600">{product?.description}</p>
                      <p className="text-green-600 font-semibold">{product?.price} SAR</p>
                    </div>
                  </div>
                  <div className="mr-1">
                    <button className={`text-white px-4 py-2 rounded max-h-9 self-center mr-2 ${selectedProductId === product?.id ? 'bg-red-500' : 'bg-blue-500'}`} onClick={() => handleSelectProduct(product?.id)}>
                      {selectedProductId === product?.id ? "Unselect" : "Select"}
                    </button>
                    {product?.MerchantLinkedProducts?.length ?
                      <button className="text-green-500 bg-transparent border border-green-500 p-2 rounded-md hover:bg-green-500 hover:text-white transition-colors" onClick={() => togglePopup(product?.MerchantLinkedProducts?.[0]?.provider_product_id)}>View Details</button>
                      : null
                    }
                  </div>
                </li>
              ))}
            </ul>
          )}
          <PaginationControls totalPages={localProducts?.totalPages} />
        </div>
        {provider === 'salla' &&
          <SallaProducts providerProducts={providerProducts} selectedProviderProduct={selectedProviderProductId} onSelectProviderProduct={handleSelectProviderProduct} />
        }
        {provider === 'zid' &&
          <ZidProducts providerProducts={providerProducts} selectedProviderProduct={selectedProviderProductId} onSelectProviderProduct={handleSelectProviderProduct} />
        }
      </div>
      {linkedProductId && (
        <>
          {provider === 'salla' &&
            <SallaLinkedProductPopup sku={linkedProductId} onClose={() => setLinkedProductId(undefined)} />
          }
          {provider === 'zid' &&
            <ZidLinkedProductPopup id={linkedProductId} onClose={() => setLinkedProductId(undefined)} />
          }
        </>
      )}
    </>
  );
}