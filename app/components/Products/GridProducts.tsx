"use client";

import styles from "./grid.module.css";
import Image from "next/image";
import { PaginatedProducts } from "@/types/pagination-types";
import { SetStateAction, useState } from "react";
import order from "./product.module.css";
import Link from "next/link";
import del from "@/public/products/delete.svg";
import edit from "@/public/products/edit.svg";
import { useSession } from "next-auth/react";
import { Product, User } from "@/database/models";
import { getOrderCount } from "@/utils/client-helpers";
import { highlightMatch } from "../utils";
import AddToCart from "../Modals/AddToCart";

const GridProducts = ({ response, setSelectedProductId, search }: { response: PaginatedProducts | null, setSelectedProductId: (value: SetStateAction<number | null>) => void, search?: string }) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [showDescription, setShowDescription] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  return (
    <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8 mx-16 2xl:flex flex-wrap gap-[50px]">
      {response?.items?.map((product) => (
        <div key={product?.id} className={styles.Parent}>
          <div className="w-[200px]  h-[auto]">
          <Image className={styles.Imageproduct} src={product.image ? `data:${product.image_type};base64,${Buffer.from(product.image).toString('base64')}` : ""}  width={200} height={200} alt={product?.title} />
          </div>
          <div className={styles.itemdetails_parent}>
            <div className={styles.itemdetails1}>
              <div className={styles.leftsection}>
                <p className="text-center">{highlightMatch(product?.title, search)}</p>
              </div>
            </div>
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4 mt-2">
              <p className="text-lg font-semibold text-gray-700 mr-auto">Price: {product.price} SAR</p>
              {user?.role === 'user' && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={() => { setSelectedProduct(product) }}>Buy</button>
              )}
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none" title="Show Description" onClick={() => setShowDescription(!showDescription)}>
                <svg xmlns="https://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {showDescription && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-md max-w-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                    <div className="max-h-60 overflow-y-auto">
                      <p className="text-gray-700">{highlightMatch(product.description, search)}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6 w-full" onClick={() => setShowDescription(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
            {user?.role === 'admin' && (
              <div className="flex justify-between items-center p-2">
                <div className={styles.ratingparent}>
                  <p className={order.number_of_orders}>{getOrderCount(product?.OrderItems ?? [])} orders</p>
                </div>
                <div className={styles.rightsection}>
                  <button className={styles.editbutton}>
                    <Link href={`/admin/products/${product.id}/edit`} target="_blank"><Image src={edit} alt="edit"></Image></Link>
                  </button>
                  <button className={styles.deletebutton} onClick={() => setSelectedProductId(product?.id)}>
                    <Image src={del} alt="delete" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {selectedProduct && (
        <AddToCart product={selectedProduct} onClose={() => setSelectedProduct(undefined)} />
      )}
    </div>
  )
};

export default GridProducts;