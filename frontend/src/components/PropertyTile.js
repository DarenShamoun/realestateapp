import React from 'react';

const PropertyTile = ({ property, onClick }) => {
    return (
        <div className="border p-4 rounded shadow" onClick={() => onClick(property.id)}>
            <h2 className="font-bold">{property.name}</h2>
            <p>Type: {property.property_type}</p>
            {/* Add more property details you wish to display */}
        </div>
    );
};

export default PropertyTile;
