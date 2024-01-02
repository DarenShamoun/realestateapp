import React, { useState, useEffect } from 'react';
import { getTenants } from '@/api/tenantService';

const CreateLeaseModal = ({ isOpen, onClose, unitId }) => {
  const [step, setStep] = useState(1);
  const [existingTenants, setExistingTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const [leaseDetails, setLeaseDetails] = useState({});
  const [rentDetails, setRentDetails] = useState({});

  useEffect(() => {
    // Fetch existing tenants when modal opens
    const fetchTenants = async () => {
      const tenants = await getTenants();
      setExistingTenants(tenants);
    };
    if (isOpen) {
      fetchTenants();
    }
  }, [isOpen]);

  const handleTenantSelect = (e) => {
    const tenantId = e.target.value;
    setSelectedTenant(tenantId);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Implement API calls here
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Create New Lease</h2>
        
        {step === 1 && (
        <div>
          <label className="block mb-2 text-sm font-bold text-white">Select Existing Tenant</label>
            <select
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-700"
                onChange={handleTenantSelect}
                value={selectedTenant}
            >
                <option value="">New Tenant</option>
                {existingTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.full_name}</option>
                ))}
            </select>

            {!selectedTenant && (
            <>
                <label className="block mb-2 text-sm font-bold text-white">Full Name</label>
                    <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Full Name"
                    value={tenantDetails.full_name}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, full_name: e.target.value })}
                />
                    
                <label className="block mb-2 text-sm font-bold text-white">Primary Phone</label>
                    <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Primary Phone"
                    value={tenantDetails.primary_phone}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, primary_phone: e.target.value })}
                />

                <label className="block mb-2 text-sm font-bold text-white">Secondary Phone</label>
                    <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Secondary Phone"
                    value={tenantDetails.secondary_phone}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, secondary_phone: e.target.value })}
                />

                <label className="block mb-2 text-sm font-bold text-white">Email</label>
                    <input
                    type="email"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Email"
                    value={tenantDetails.email}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, email: e.target.value })}
                />

                <label className="block mb-2 text-sm font-bold text-white">Contact Notes</label>
                    <textarea
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Contact Notes"
                    value={tenantDetails.contact_notes}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, contact_notes: e.target.value })}
                />
            </>
            )}
        </div>
        )}   

        {step === 2 && (
        <div>
            <label className="block mb-2 text-sm font-bold text-white">Start Date</label>
            <input
                type="date"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="yyyy-mm-dd"
                value={leaseDetails.start_date}
                onChange={(e) => setLeaseDetails({ ...leaseDetails, start_date: e.target.value })}
            />

            <label className="block mb-2 text-sm font-bold text-white">End Date</label>
            <input
                type="date"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="yyyy-mm-dd"
                value={leaseDetails.end_date}
                onChange={(e) => setLeaseDetails({ ...leaseDetails, end_date: e.target.value })}
            />

            <label className="block mb-2 text-sm font-bold text-white">Monthly Rent</label>
            <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Monthly Rent"
            value={leaseDetails.monthly_rent}
            onChange={(e) => {
                setLeaseDetails({ ...leaseDetails, monthly_rent: e.target.value });
                setRentDetails({ ...rentDetails, rent: e.target.value });
            }}
            />

            <label className="block mb-2 text-sm font-bold text-white">Deposit</label>
            <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Deposit"
            value={leaseDetails.deposit}
            onChange={(e) => setLeaseDetails({ ...leaseDetails, deposit: e.target.value })}
            />

            <label className="block mb-2 text-sm font-bold text-white">Terms</label>
            <textarea
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Lease Terms"
            value={leaseDetails.terms}
            onChange={(e) => setLeaseDetails({ ...leaseDetails, terms: e.target.value })}
            />
        </div>
        )}

        {step === 3 && (
        <div>
            <label className="block mb-2 text-sm font-bold text-white">Rent</label>
            <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            value={rentDetails.rent}
            readOnly
            />
      
          <label className="block mb-2 text-sm font-bold text-white">Trash Fee</label>
          <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Trash Fee"
            value={rentDetails.trash}
            onChange={(e) => setRentDetails({ ...rentDetails, trash: e.target.value })}
          />
      
          <label className="block mb-2 text-sm font-bold text-white">Water & Sewer Fee</label>
          <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Water & Sewer Fee"
            value={rentDetails.water_sewer}
            onChange={(e) => setRentDetails({ ...rentDetails, water_sewer: e.target.value })}
          />
      
          <label className="block mb-2 text-sm font-bold text-white">Parking Fee</label>
          <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Parking Fee"
            value={rentDetails.parking}
            onChange={(e) => setRentDetails({ ...rentDetails, parking: e.target.value })}
          />
      
          <label className="block mb-2 text-sm font-bold text-white">Debt</label>
          <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Debt"
            value={rentDetails.debt}
            onChange={(e) => setRentDetails({ ...rentDetails, debt: e.target.value })}
          />
      
          <label className="block mb-2 text-sm font-bold text-white">Breaks</label>
          <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Breaks"
            value={rentDetails.breaks}
            onChange={(e) => setRentDetails({ ...rentDetails, breaks: e.target.value })}
          />
        </div>
        )}      

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400">
              Back
            </button>
          )}
          {step < 3 && (
            <button onClick={() => setStep(step + 1)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
              Next
            </button>
          )}
          {step === 3 && (
            <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
              Submit
            </button>
          )}
          <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaseModal;