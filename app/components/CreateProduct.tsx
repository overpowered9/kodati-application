"use client";

import { Category, Region } from '@/database/models';
import ProductForm from './ProductForm';

const CreateProduct = ({ categories, regions }: { categories: Category[] | null, regions: Region[] | null }) => {
	const createProduct = async (formData: FormData) => {
		try {
			const response = await fetch('/api/products', {
				method: 'POST',
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
			<ProductForm initialData={null} onSubmit={createProduct} categories={categories} regions={regions} />
		</div>
	);
};

export default CreateProduct;