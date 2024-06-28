"use client";

import { ChangeEvent, FormEvent, useState } from 'react';
import style from './settings.module.css';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import Spinner from '../Modals/Spinner';
import { useRouter } from 'next/navigation';

const UpdatePassword = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    let isValid = true;
    if (!formData.currentPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: 'Current password is required',
      }));
      isValid = false;
    }
    if (!formData.newPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: 'New password is required',
      }));
      isValid = false;
    }
    if (!formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Confirm password is required',
      }));
      isValid = false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Passwords must match',
      }));
      isValid = false;
    }
    if (formData.newPassword.length < 10 || formData.confirmPassword.length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: 'Password must be at least 10 characters long',
        confirmPassword: 'Password must be at least 10 characters long',
      }));
      isValid = false;
    }

    if (isValid) {
      handleUpdatePassword();
    }
  };

  const updatePassword = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await fetch('/api/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error);
    }
  };

  const { mutate: handleUpdatePassword, isPending: loading } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      showSuccessToast('Password updated successfully');
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while updating the password');
    },
    onSettled: () => {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
  });

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={style.InputsParent}>
          <div className={style.longinput}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
              Current Password
            </label>
            <p className="text-xs text-gray-600 mt-1">Note: Password must be at least 10 characters long.</p>
            <input type="password" id="currentPassword" value={formData.currentPassword} onChange={handleChange} />
            {errors.currentPassword && <p className="text-red-500 text-xs italic">{errors.currentPassword}</p>}
          </div>
          <div className={style.normalinput}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input type="password" id="newPassword" value={formData.newPassword} onChange={handleChange} />
            {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword}</p>}
          </div>
          <div className={style.normalinput}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
          </div>
        </div>
        <button type="submit" className={style.updatebutton}>Update</button>
      </form>
    </div>
  )
};

export default UpdatePassword;