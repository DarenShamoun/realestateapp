import React from 'react';

const PropertyTile = ({ property }) => {
    return (
        <div className="border p-4 rounded-lg shadow-lg m-4 hover:shadow-xl transition duration-300 ease-in-out">
            <h3 className="text-lg font-semibold">{property.name}</h3>
            <p>Type: {property.type}</p>
            <p>Location: {property.location}</p>
            {/* Add more property details you want to display */}
            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Details
            </button>
        </div>
    );
};

export default PropertyTile;
