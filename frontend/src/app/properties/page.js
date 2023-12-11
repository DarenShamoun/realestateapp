const PropertiesPage = () => {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Properties</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder content for properties */}
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Property {i + 1}</h2>
              <p className="text-gray-600">
                Description for Property {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
              </p>
              <button className="mt-4 rounded bg-blue-500 py-2 px-4 text-white shadow transition-colors duration-300 hover:bg-blue-600">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
};
  
export default PropertiesPage;
  