import { AdminLinkedProduct } from "@/database/models";

const LinkedProductsPopup = ({ linkedProducts, onClose }: { linkedProducts: AdminLinkedProduct[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {linkedProducts.map((product, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition duration-300">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.Provider?.name}</h3>
              <p className="text-sm text-gray-600">SKU: {product.provider_product_id}</p>
              <p className="text-sm text-gray-600">Price: {product.min_price} {product.currency_code}</p>
              <p className="text-sm text-gray-600">Price(SAR): {product.converted_price} SAR</p>
              <p className="text-sm text-gray-600">Admin Price: {product.max_price} SAR</p>
            </div>
          ))}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6 sm:mt-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LinkedProductsPopup;