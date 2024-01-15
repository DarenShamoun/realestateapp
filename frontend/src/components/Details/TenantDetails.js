import React, { useState } from 'react';
import EditTenantModal from '@/components/Modals/EditTenantModal';

const TenantDetails = ({ tenant }) => {
  const [isEditTenantModalOpen, setIsEditTenantModalOpen] = useState(false);

  const onOpenEditTenant = () => {
    setIsEditTenantModalOpen(true);
  };

  const onCloseEditTenantModal = () => {
    setIsEditTenantModalOpen(false);
  };

  return (
    <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-white">Tenant Details</h2>
        {/* Edit Tenant Button */}
        {tenant && (
          <button onClick={onOpenEditTenant} className="ml-4">
            <img src="/edit-button.svg" alt="Edit" className="h-4 w-4" />
          </button>
        )}
      </div>
      {tenant ? (
        <>
          <p className="text-gray-300">Name: {tenant.full_name || 'None'}</p>
          <p className="text-gray-300">Primary Phone: {tenant.primary_phone || 'None'}</p>
          <p className="text-gray-300">Secondary Phone: {tenant.secondary_phone || 'N/A'}</p>
          <p className="text-gray-300">Contact Notes: {tenant.contact_notes || 'None'}</p>
        </>
      ) : (
        <p className="text-gray-300">No tenant details available</p>
      )}
      {/* Edit Tenant Modal */}
      {isEditTenantModalOpen && (
        <EditTenantModal
          isOpen={isEditTenantModalOpen}
          onClose={onCloseEditTenantModal}
          tenant={tenant}
        />
      )}
    </div>
  );
}

export default TenantDetails;
