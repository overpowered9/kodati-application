"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useRouter } from 'next/navigation';
import { Region } from '@/database/models';

const EditRegion = ({ region }: { region: Region }) => {
  const [name, setName] = useState(region?.name || '');
  const [code, setCode] = useState(region?.code || '');
  const [nameError, setNameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim() !== '') {
      setNameError('');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (e.target.value.trim() !== '') {
      setCodeError('');
    }
  };

  const updateRegion = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(`/api/regions/${region?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, code })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while updating the region');
    }
  };

  const { mutate: handleUpdateRegion, isPending: loading } = useMutation({
    mutationFn: updateRegion,
    onSuccess: () => {
      showSuccessToast('Region updated successfully');
      router.push('/admin/regions');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Region name cannot be empty');
      isValid = false;
    }

    if (code.trim() === '') {
      setCodeError('Region code cannot be empty');
      isValid = false;
    }

    if (isValid) {
      handleUpdateRegion();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-center">Update Region</h2>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Region Name</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} disabled={loading} className={`w-full px-4 py-2 rounded-lg border ${nameError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`} />
          {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">Region Code</label>
          <input type="text" id="code" value={code} onChange={handleCodeChange} disabled={loading} className={`w-full px-4 py-2 rounded-lg border ${codeError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`} />
          {codeError && <p className="text-sm text-red-500 mt-1">{codeError}</p>}
        </div>
        <button type="submit" disabled={loading} className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none ${loading && 'opacity-50 cursor-not-allowed'}`}>Update Region</button>
      </form>
    </div>
  );
};

export default EditRegion;
