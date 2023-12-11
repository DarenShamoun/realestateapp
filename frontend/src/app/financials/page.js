export default function Financials() {
  // Placeholder data
  const overallSummary = {
    profit: "100,000",
    cost: "50,000",
  };

  const propertyDetails = [
    { name: 'Property 1', profit: '20,000', cost: '10,000' },
    { name: 'Property 2', profit: '30,000', cost: '15,000' },
    // ... other properties
  ];

  // For simplicity, not including the tenant details and payment history in this example

  return (
    <main className="flex-grow p-10">
      {/* Overall Summary */}
      <div className="mb-10 p-6 rounded-lg bg-gradient-to-r from-green-300 to-blue-500 shadow-xl">
        <h2 className="text-xl font-semibold text-white">Overall Financial Summary</h2>
        <p>Profit: ${overallSummary.profit}</p>
        <p>Cost: ${overallSummary.cost}</p>
      </div>

      {/* Property-Level Details */}
      <div className="space-y-6">
        {propertyDetails.map((property, index) => (
          <div key={index} className="p-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 shadow-xl">
            <h3 className="text-lg font-semibold text-white">{property.name} - Financials</h3>
            <p>Profit: ${property.profit}</p>
            <p>Cost: ${property.cost}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
