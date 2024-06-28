"use client";

import { logout } from "@/utils/client-helpers";
import { showErrorToast, showSuccessToast } from "@/utils/toast-helpers";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Spinner from "./Modals/Spinner";

const SessionExpired = () => {
  const router = useRouter();

  const { mutate: handleLogout, isPending: loading } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      showSuccessToast('Logout successful');
      router.push(data?.url || '/login');
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while logging out');
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogout();
  };

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-center">
        <h1 className="text-2xl font-bold mb-4">Session Expired</h1>
        <p className="text-gray-600 mb-6">Your session has expired. Please logout and login again to continue.</p>
        <form onSubmit={(handleSubmit)}>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default SessionExpired;