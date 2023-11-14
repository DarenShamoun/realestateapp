const UnitGrid = ({ units, onUnitSelect }) => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {units.map((unit) => (
          <div 
            key={unit.id} 
            className="p-4 border rounded shadow-lg cursor-pointer hover:bg-gray-100"
            onClick={() => onUnitSelect(unit)}
          >
            <h3 className="text-lg font-bold">Unit {unit.unit_number}</h3>
            <p>Rent: ${unit.rent}</p>
            {/* Additional unit details */}
          </div>
        ))}
      </div>
    );
};
  