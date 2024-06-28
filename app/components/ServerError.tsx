import Link from 'next/link';

const ServerError = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">500 Internal Server Error</h1>
        <p className="text-gray-700 mb-8">
          Oops! Something went wrong on our server. We are working to fix it. Please try again later.
        </p>
        <Link href="/dashboard" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
};

export default ServerError;