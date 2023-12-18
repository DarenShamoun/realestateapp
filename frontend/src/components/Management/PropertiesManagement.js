'use client'

import React, { useEffect, useState } from 'react';
import { getProperties, updateProperty, deleteProperty } from '@/api/propertyService';
import AddPropertyModal from '@/components/Modals/AddPropertyModal';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';
import PropertyCard from '@/components/Cards/PropertyCard';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleAddClick = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleEditClick = (property) => {
    setCurrentProperty(property);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
      fetchProperties(); // Refresh the list
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl text-white font-bold">Properties Management</h2>
        <button onClick={handleAddClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Property
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            isManagementMode={true}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <AddPropertyModal show={showAddModal} onClose={handleCloseAddModal} />
      {showEditModal && (
        <EditPropertyModal property={currentProperty} show={showEditModal} onClose={handleCloseEditModal} />
      )}
    </section>
  );
};

export default PropertiesManagement;
