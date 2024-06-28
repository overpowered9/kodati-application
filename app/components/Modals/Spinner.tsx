const Spinner = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
			<div className="bg-white p-8 rounded-lg shadow-lg w-72">
				<div className="flex justify-center items-center mb-4">
					<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-opacity-75 border-b-4 border-r-4 border-l-4"></div>
				</div>
				<p className="text-center text-gray-700">Loading...</p>
			</div>
		</div>
	);
};

export default Spinner;