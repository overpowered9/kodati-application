import React, { ButtonHTMLAttributes } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  buttonText: string;
}

const LoadingButton = ({ loading, buttonText, ...rest }: LoadingButtonProps) => {
  return (
    <button {...rest} disabled={loading} className={`bg-blue-500 w-32 text-white whitespace-nowrap px-4 py-2 rounded-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300'}`} >
      {loading ? 'Loading...' : buttonText}
    </button>
  );
};

export default LoadingButton;