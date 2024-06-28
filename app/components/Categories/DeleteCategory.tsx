"use client";

import { showErrorToast, showSuccessToast } from "@/utils/toast-helpers";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import LoadingButton from "../LoadingButton";

const DeleteCategory = ({ categoryId, onClose }: { categoryId: number, onClose: () => void }) => {
  const router = useRouter();

  const handleDelete = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while deleting the category');
    }
  };

  const { mutate: deleteCategory, isPending: loading } = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      showSuccessToast('Category deleted successfully');
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
    onSettled: () => {
      onClose();
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteCategory();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md">
        <h2 className="text-2xl font-semibold mb-2">Delete Category</h2>
        <p>Are you sure you want to delete this item?</p>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="flex justify-end">
            <LoadingButton type="submit" loading={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md" buttonText="Delete" />
            <button className="ml-2 text-gray-600" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteCategory;