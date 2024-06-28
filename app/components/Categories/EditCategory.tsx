"use client";

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Category } from '@/database/models';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useRouter } from 'next/navigation';

const EditCategory = ({ category }: { category: Category }) => {
  const [name, setName] = useState(category?.name || '');
  const [image, setImage] = useState<File | null>(null);
  const [nameError, setNameError] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const updateCategory = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch(`/api/categories/${category?.id}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while updating the category');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim() !== '') {
      setNameError('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageError('');
    }
  };

  const { mutate: handleUpdateCategory, isPending: loading } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      showSuccessToast('Category updated successfully');
      router.push('/admin/categories');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
    onSettled: () => {
      setName('');
      setImage(null);
      setNameError('');
      setImageError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Category name cannot be empty');
      isValid = false;
    }

    if (isValid) {
      handleUpdateCategory();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-center">Update Category</h2>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} disabled={loading} className={`w-full px-4 py-2 rounded-lg border ${nameError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`} />
          {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
          <input type="file" id="image" ref={fileInputRef} onChange={handleImageChange} accept="image/*" disabled={loading} className={`w-full px-4 py-2 rounded-lg border ${imageError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`} />
          {imageError && <p className="text-sm text-red-500 mt-1">{imageError}</p>}
        </div>
        <button type="submit" disabled={loading} className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none ${loading && 'opacity-50 cursor-not-allowed'}`}>Update Category</button>
      </form>
    </div>
  );
};

export default EditCategory;