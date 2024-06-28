export default function Skeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center mb-4">
        <div className="animate-spin h-8 w-8 border-t-4 border-blue-500"></div>
        <span className="ml-2 text-lg text-gray-700 font-semibold">Loading...</span>
      </div>
    </div>
  );
}
