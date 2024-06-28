import { Card } from "@/database/models";

const CardsPopup = ({ cards, onClose }: { cards: Card[], onClose: () => void }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-full md:max-w-3xl mx-4 md:mx-auto rounded-lg overflow-hidden shadow-lg z-50 max-h-[26rem] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Card Codes</h2>
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none" onClick={onClose}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto m-0">
              <thead>
                <tr className="border-b">
                  <th className="p-3 whitespace-nowrap">Sr No</th>
                  <th className="p-3">Card Number</th>
                  <th className="p-3">Pin Code</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{card.card_number}</td>
                    <td className="p-3">{card.pin_code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsPopup;