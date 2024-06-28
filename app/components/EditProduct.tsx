"use client";

import { Category, Product, Region } from "@/database/models";
import ProductForm from './ProductForm';

const EditProduct = ({ productData, categories, regions }: { productData: Product, categories: Category[] | null, regions: Region[] | null }) => {
	const editProduct = async (formData: FormData) => {
		try {
			const response = await fetch(`/api/products/${productData?.id}`, {
				method: 'PUT',
				body: formData,
			});

			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			if (response.ok) {
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	};

	return (
		<div>
			<ProductForm initialData={productData} onSubmit={editProduct} categories={categories} regions={regions} />
		</div>
	);
};

export default EditProduct;
