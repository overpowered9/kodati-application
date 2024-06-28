import { Customer } from "@/database/models";

const CustomerPopup = ({ customer, onClose }: { customer: Customer, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Information</h2>
        <div className="text-gray-700">
          <p className="mb-2"><span className="font-semibold text-gray-900">ID:</span> {customer.id}</p>
          <p className="mb-2"><span className="font-semibold text-gray-900">Name:</span> {customer.name}</p>
          <p className="mb-2"><span className="font-semibold text-gray-900">Email:</span> {customer.email}</p>
          <p className="mb-2"><span className="font-semibold text-gray-900">Mobile:</span> {customer.mobile}</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomerPopup;