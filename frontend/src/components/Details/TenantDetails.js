import React from 'react';

const TenantDetails = ({ tenant }) => (
  <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/3">
    <h2 className="text-xl text-white">Tenant Details</h2>
    {tenant ? (
      <>
        <p className="text-gray-300">Name: {tenant.full_name || 'None'}</p>
        <p className="text-gray-300">Primary Phone: {tenant.primary_phone || 'None'} </p>
        <p className="text-gray-300">Secondary Phone: {tenant.secondary_phone || 'N/A'}</p>
        <p className="text-gray-300">Contact Notes: {tenant.contact_notes || 'None'}</p>
      </>
    ) : <p className="text-gray-300">No tenant details available</p>}
  </div>
);

export default TenantDetails;
