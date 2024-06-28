"use client";

import { Category, Product, Region } from '@/database/models';
import { useState, ChangeEvent, FormEvent, useId, useRef } from 'react';
import Select from 'react-select';
import { Option } from '@/types/select-options';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import LoadingButton from './LoadingButton';

const ProductForm = ({ initialData, onSubmit, categories, regions }: { initialData: Product | null, onSubmit: (formData: FormData) => Promise<boolean>, categories: Category[] | null, regions: Region[] | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    image: null,
    selectedCategories: (initialData?.Categories || []),
    selectedRegions: (initialData?.Regions || []),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0] || null;
    setFormData({ ...formData, image: imageFile });
  };

  const handleCategoriesChange = (option: readonly Option[]) => {
    setFormData({ ...formData, selectedCategories: option });
  };

  const handleRegionsChange = (option: readonly Option[]) => {
    setFormData({ ...formData, selectedRegions: option });
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    ['title', 'description', 'price'].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than zero';
      isValid = false;
    }

    if (!initialData && !formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    if (formData.selectedCategories.length === 0) {
      newErrors.categories = 'Select at least one category';
      isValid = false;
    }

    if (formData.selectedRegions.length === 0) {
      newErrors.regions = 'Select at least one region';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('categories', JSON.stringify(formData?.selectedCategories?.map((category: Option) => category.value)));
      form.append('regions', JSON.stringify(formData?.selectedRegions?.map((region: Option) => region.value)));
      const image = formData.image;
      if (image) {
        form.append('image', image);
      }
      setLoading(true);
      const result = await onSubmit(form);
      if (result) {
        const message = initialData ? 'updated' : 'created';
        showSuccessToast(`Product ${message} successfully`);
        router.push('/products');
      } else {
        const message = initialData ? 'updating' : 'creating';
        showErrorToast(`An error occurred while ${message} the product`);
        // Reset the form
        setFormData({
          title: initialData?.title || '',
          description: initialData?.description || '',
          price: initialData?.price || '',
          image: null,
          selectedCategories: (initialData?.Categories || []),
          selectedRegions: (initialData?.Regions || []),
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center">{initialData ? 'Edit Product' : 'Add Product'}</h1>
      <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            disabled={loading}
            className={`appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.title ? 'border-red-500' : ''}`}
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            disabled={loading}
            className={`appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.description ? 'border-red-500' : ''}`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            step={0.01}
            disabled={loading}
            className={`appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.price ? 'border-red-500' : ''}`}
            id="price"
            min={0}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="image">
            Image
          </label>
          <input
            disabled={loading}
            name="image"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {errors.image && <p className="text-red-500 text-xs italic">{errors.image}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="categories">
            Categories
          </label>
          <Select
            isDisabled={loading}
            id="categories"
            name="categories"
            instanceId={useId()}
            options={categories?.map((category) => ({ value: category.id, label: category.name }))}
            isMulti
            value={formData.selectedCategories}
            onChange={handleCategoriesChange}
          />
          {errors.categories && <p className="text-red-500 text-xs italic">{errors.categories}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="regions">
            Regions
          </label>
          <Select
            isDisabled={loading}
            id="regions"
            name="regions"
            instanceId={useId()}
            options={regions?.map((region) => ({ value: region.id, label: region.name }))}
            isMulti
            value={formData.selectedRegions}
            onChange={handleRegionsChange}
          />
          {errors.regions && <p className="text-red-500 text-xs italic">{errors.regions}</p>}
        </div>

        <div className="mb-4">
          <LoadingButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring" type="submit" loading={loading} buttonText={initialData ? 'Update' : 'Create'} />
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
