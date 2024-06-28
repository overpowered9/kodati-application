import Link from "next/link";

export default function Denied() {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-5xl text-red-500 font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-8">
          You are logged in, but you do not have the required access level to view this page.
        </p>
        <Link href="/dashboard" className="text-lg text-blue-500 underline">
          Return to dashboard
        </Link>
      </div>
    </section>
  );
}
