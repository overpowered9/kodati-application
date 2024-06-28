"use client";

import { AdminLinkedProduct, Provider } from '@/database/models';
import LinkButton from './LinkButton';
import { useMemo, useState } from 'react';
import Image from "next/image";
import { useQuery } from '@tanstack/react-query';
import { showErrorToast } from '@/utils/toast-helpers';
import Filters from '../Filters';
import LinkedProductsPopup from './LinkedProductsPopup';
import NoRecordsFound from '../../NoRecordsFound';
import { PaginatedProducts } from '@/types/pagination-types';
import PaginationControls from '../../Pagination';

export default function ProductsList({ localProducts, providers }: { localProducts: PaginatedProducts | null, providers: Provider[] | null }) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [selectedProviderProduct, setSelectedProviderProduct] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [adminLinkedProducts, setAdminLinkedProducts] = useState<AdminLinkedProduct[] | undefined>(undefined);

  const handleSelectProduct = (id: number) => {
    setSelectedProductId((previous) => (previous === id ? null : id));
  };

  const handleSelectProviderProduct = (product: any) => {
    setSelectedProviderProduct((previous: any) => (previous === product ? null : product));
  };

  const togglePopup = (adminLinkedProducts: AdminLinkedProduct[] | undefined) => {
    setAdminLinkedProducts(adminLinkedProducts);
  };

  const fetchProviderProducts = async () => {
    const response = await fetch(`/api/provider-products/${selectedProviderId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch provider's products");
    }
    return await response.json();
  }

  const { data: providerProducts, isFetching, error } = useQuery({
    queryKey: ['providerProducts', selectedProviderId],
    queryFn: () => fetchProviderProducts(),
    enabled: !!selectedProviderId,
    retryOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  const filteredProducts = useMemo(() => {
    if (!providerProducts) return [];
    if (!searchTerm) return providerProducts.products.results;
    return providerProducts.products.results.filter((product: any) =>
      product.sku.toString().includes(searchTerm) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.regions.some((region: any) => region.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.categories.some((category: any) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [providerProducts, searchTerm]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <div className="flex justify-center mt-24">
        <LinkButton local_product_id={selectedProductId} provider_product={selectedProviderProduct} provider_id={selectedProviderId} />
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
                <li key={product.id} className={`flex items-center justify-between border-2 py-4 my-1 ${selectedProductId === product?.id ? 'bg-yellow-100' : ''} ${product?.AdminLinkedProducts?.length ? 'border-green-500' : 'border-red-500'}  `}>
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
                    {product?.AdminLinkedProducts?.length ?
                      <button className="text-green-500 bg-transparent border border-green-500 p-2 rounded-md hover:bg-green-500 hover:text-white transition-colors" onClick={() => togglePopup(product?.AdminLinkedProducts)}>View Details</button>
                      : null
                    }
                  </div>
                </li>
              ))}
            </ul>
          )}
          <PaginationControls totalPages={localProducts?.totalPages} />
        </div>
        <div className="bg-white p-4 shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Provider Products</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>
          <div className="flex space-x-4">
            {providers?.map((provider) => (
              <button key={provider.id} onClick={() => setSelectedProviderId(provider.id)}
                className={`${isFetching ? 'opacity-50 cursor-not-allowed' : ''} ${provider.id === selectedProviderId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white py-2 px-4 rounded-md transition duration-300`}>
                {provider.name}
              </button>
            ))}
          </div>
          <ul className="mt-4">
            {error && showErrorToast(error?.message)}
            {isFetching && <p>Loading...</p>}
            {selectedProviderId && currentProducts &&
              currentProducts?.map((product: any, index: number) => (
                <li key={index + 1} className={`flex justify-between border-b py-4 ${selectedProviderProduct === product ? 'bg-yellow-100' : ''} `}>
                  <div className="flex items-center space-x-4">
                    <Image src={product.image ?? ""} alt={product?.title} className="w-18 h-18 object-cover rounded-full" width={100} height={100} />
                    <div>
                      <h3 className="text-xl font-semibold">{product?.title}</h3>
                      {product?.description && (
                        <div>
                          {JSON.parse(product?.description)?.content?.filter((item: any) => item?.type === 'marketing')?.map((item: any, index: number) => (
                            <p key={index} className="text-green-600 break-all whitespace-normal">
                              <strong>Description:</strong> {item?.description}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-green-600 font-semibold">
                        <strong>Price: </strong>
                        {product?.currency?.code}{product?.min_price === product?.max_price ? product?.min_price : product?.min_price + "-" + product?.max_price}<em> ({product?.currency?.currency})</em>
                      </p>
                      <p className="text-green-600 font-semibold">
                        <strong>Categories: </strong>
                        {product?.categories?.map((category: any, index: number) => (
                          <span key={index + 1}>
                            {category?.name}
                            {index < product?.categories?.length - 1 && ', '}
                          </span>
                        ))}
                      </p>
                      <p className="text-green-600 font-semibold">
                        <strong>Regions: </strong>
                        {product?.regions?.map((region: any, index: number) => (
                          <span key={index + 1}>
                            {region?.name}
                            {index < product?.regions?.length - 1 && ', '}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <button className={`text-white px-4 py-2 rounded max-h-9 self-center mr-2 ${selectedProviderProduct === product ? 'bg-red-500' : 'bg-blue-500'}`} onClick={() => handleSelectProviderProduct(product)}>
                    {selectedProviderProduct === product ? "Unselect" : "Select"}
                  </button>
                </li>
              ))}
          </ul>
          {currentProducts?.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-l focus:outline-none disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                disabled={indexOfLastProduct >= filteredProducts?.length}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r focus:outline-none disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {adminLinkedProducts && adminLinkedProducts.length > 0 && (
        <LinkedProductsPopup linkedProducts={adminLinkedProducts} onClose={() => setAdminLinkedProducts(undefined)} />
      )}
    </>
  );
}