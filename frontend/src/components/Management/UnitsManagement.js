'use client'

import React, { useEffect, useState } from 'react';
import { getUnits, deleteUnit } from '@/api/unitService';
import UnitCard from '@/components/Cards/UnitCard';
import AddUnitModal from '@/components/Modals/AddUnitModal';
import EditUnitModal from '@/components/Modals/EditUnitModal';

const UnitsManagement = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    const data = await getUnits();
    setUnits(data);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const handleDelete = async (unitId) => {
    await deleteUnit(unitId);
    fetchUnits(); // Refresh units after deletion
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    fetchUnits(); // Refresh units after any modal action
  };

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl text-white font-bold">Manage Units</h2>
        <button onClick={handleAddClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Unit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {units.map(unit => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onEdit={() => handleEditClick(unit)}
            onDelete={() => handleDelete(unit.id)}
          />
        ))}
      </div>
      <AddUnitModal show={showAddModal} onClose={handleCloseModal} />
      {selectedUnit && <EditUnitModal property={selectedUnit} show={showEditModal} onClose={handleCloseModal} />}
    </section>
  );
};

export default UnitsManagement;
