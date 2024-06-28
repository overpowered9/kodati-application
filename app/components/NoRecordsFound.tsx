const NoRecordsFound = ({ record }: { record?: string }) => {
  return (
    <div className="p-8 text-center">
      <p className="text-2xl font-semibold text-gray-800 mb-4">No {record ?? "records"} found</p>
      <p className="text-gray-600">We couldn't find any {record ?? "records"} matching your criteria.</p>
    </div>
  );
};

export default NoRecordsFound;