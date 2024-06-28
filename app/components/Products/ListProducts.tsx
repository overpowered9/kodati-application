"use client";

import styles from "./product.module.css";
import Image from "next/image"
import { PaginatedProducts } from "@/types/pagination-types";
import Link from "next/link";
import edit from "@/public/products/edit.svg";
import del from "@/public/products/delete.svg";
import { SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { Product, User } from "@/database/models";
import { getOrderCount } from "@/utils/client-helpers";
import { highlightMatch } from "../utils";
import AddToCart from "../Modals/AddToCart";

const ListProducts = ({ response, setSelectedProductId, search }: { response: PaginatedProducts | null, setSelectedProductId: (value: SetStateAction<number | null>) => void, search?: string }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <>
      {response?.items?.map((product) => (
        <div key={product?.id} className={styles.parent_div_product}>
          <Image src={product.image ? `data:${product.image_type};base64,${Buffer.from(product.image).toString('base64')}` : ""} className={styles.productimage} width={200} height={200} alt={product?.title} />
          <div className={styles.rightchild}>
            <h2 className={styles.productname}>{highlightMatch(product?.title, search)}</h2>
            <p className={styles.price}>{product?.price} SAR</p>
            {user?.role === 'user' && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={() => { setSelectedProduct(product) }}>Buy</button>
            )}
            {user?.role === 'admin' && (
              <div className={styles.ratingparent}>
                <ul className={styles.number_of_orders}>
                  <li>{getOrderCount(product?.OrderItems ?? [])} orders</li>
                </ul>
              </div>
            )}
            {user?.role === 'admin' && (
              <div className={styles.buttons}>
                <div className={styles.product_change_buttons}>
                  <button className={styles.editbutton}>
                    <Link href={`/admin/products/${product.id}/edit`} target="_blank"><Image src={edit} alt="edit"></Image></Link>
                  </button>
                  <button className={styles.deletebutton} onClick={() => setSelectedProductId(product?.id)}>
                    <Image src={del} alt="delete" />
                  </button>
                </div>
              </div>
            )}
            <p className={styles.description}>
              {highlightMatch(product?.description, search)}
            </p>
          </div>
        </div>
      ))}
      {selectedProduct && (
        <AddToCart product={selectedProduct} onClose={() => setSelectedProduct(undefined)} />
      )}
    </>
  )
};

export default ListProducts;