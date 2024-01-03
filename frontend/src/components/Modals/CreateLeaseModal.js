import React, { useState, useEffect } from 'react';
import { getTenants } from '@/api/tenantService';
import { addTenant } from '@/api/tenantService';
import { addLease } from '@/api/leaseService';
import { addRent } from '@/api/rentService';

const CreateLeaseModal = ({ isOpen, onClose, unitId }) => {
  const [step, setStep] = useState(1);
  const [existingTenants, setExistingTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [tenantDetails, setTenantDetails] = useState({ full_name: '', primary_phone: '', secondary_phone: '', email: '', contact_notes: '' });
  const [leaseDetails, setLeaseDetails] = useState({});
  const [rentDetails, setRentDetails] = useState({});
  const [rentDate, setRentDate] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState({});

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

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };  

  const validateTenantDetails = () => {
    let newErrors = {};
    if (!tenantDetails.full_name.trim()) {
      newErrors.full_name = 'Please enter a full name.';
    }
    if (!/^(\d{3})-?(\d{3})-?(\d{4})$/.test(tenantDetails.primary_phone)) {
      newErrors.primary_phone = 'Please enter a valid primary phone number.';
    }
    if (tenantDetails.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(tenantDetails.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    
  const validateLeaseDetails = () => {
    let newErrors = {};
    if (!leaseDetails.start_date || isNaN(new Date(leaseDetails.start_date).getTime())) {
      newErrors.start_date = 'Please enter a valid start date.';
    }
    if (leaseDetails.end_date && (isNaN(new Date(leaseDetails.end_date).getTime()) || new Date(leaseDetails.end_date) < new Date(leaseDetails.start_date))) {
      newErrors.end_date = 'End date must be after the start date.';
    }
    if (leaseDetails.monthly_rent < 0) {
      newErrors.monthly_rent = 'Monthly rent cannot be negative.';
    }
    setErrors({...errors, ...newErrors});
    return Object.keys(newErrors).length === 0;
  };
  
  const validateRentDetails = () => {
    let newErrors = {};
    const fields = ['rent', 'trash', 'water_sewer', 'parking', 'debt', 'breaks'];
    fields.forEach(field => {
      if (rentDetails[field] < 0) {
        newErrors[field] = `The ${field} value cannot be negative.`;
      }
    });
    setErrors({...errors, ...newErrors});
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Skip tenant details validation if an existing tenant is selected
    if (!selectedTenant && !validateTenantDetails()) {
      return;
    }
  
    if (!validateLeaseDetails() || !validateRentDetails()) {
      return;
    }

    const formattedRentDetails = {
        rent: parseFloat(rentDetails.rent || 0),
        trash: parseFloat(rentDetails.trash || 0),
        water_sewer: parseFloat(rentDetails.water_sewer || 0),
        parking: parseFloat(rentDetails.parking || 0),
        debt: parseFloat(rentDetails.debt || 0),
        breaks: parseFloat(rentDetails.breaks || 0),
    };
        
    try {
        let tenantId = selectedTenant;
    
        // If a new tenant is being added
        if (!selectedTenant) {
            const newTenantResponse = await addTenant(tenantDetails);
            tenantId = newTenantResponse.id;
        }
    
        // Create lease
        const leaseData = {
            ...leaseDetails,
            tenant_id: tenantId,
            unit_id: unitId,
            end_date: leaseDetails.end_date || null,
            deposit: leaseDetails.deposit || null,
            terms: leaseDetails.terms || null,
        };        

        console.log(leaseData);
    
        const leaseResponse = await addLease(leaseData);
        const leaseId = leaseResponse.id;
    
        // Create rent details
        const rentData = {
            ...formattedRentDetails,
            lease_id: leaseId,
            date: rentDate,
        };
        console.log(rentData);
        await addRent(rentData);
        
        // Success message
        console.log('Lease created successfully!');
        onClose(); // Close the modal and update UI as needed
    } catch (error) {
        console.error('Error creating lease:', error);
        alert('An error occurred while creating the lease. Please try again.');
    }
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
                value={selectedTenant || ''}
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
                {errors.full_name && <p className="text-red-500 text-xs italic">{errors.full_name}</p>}
                                        
                <label className="block mb-2 text-sm font-bold text-white">Primary Phone</label>
                <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Primary Phone"
                    value={tenantDetails.primary_phone}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, primary_phone: formatPhoneNumber(e.target.value) })}
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}    

                <label className="block mb-2 text-sm font-bold text-white">Secondary Phone</label>
                <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Secondary Phone"
                    value={tenantDetails.secondary_phone}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, secondary_phone: formatPhoneNumber(e.target.value) })}
                />
                {errors.secondary_phone && <p className="text-red-500 text-xs italic">{errors.secondary_phone}</p>}

                <label className="block mb-2 text-sm font-bold text-white">Email</label>
                <input
                    type="email"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Email"
                    value={tenantDetails.email}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}

                <label className="block mb-2 text-sm font-bold text-white">Contact Notes</label>
                <textarea
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    placeholder="Contact Notes"
                    value={tenantDetails.contact_notes}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, contact_notes: e.target.value })}
                />
                {errors.contact_notes && <p className="text-red-500 text-xs italic">{errors.contact_notes}</p>}
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
            {errors.start_date && <p className="text-red-500 text-xs italic">{errors.start_date}</p>}
            
            <label className="block mb-2 text-sm font-bold text-white">End Date</label>
            <input
                type="date"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="yyyy-mm-dd"
                value={leaseDetails.end_date}
                onChange={(e) => setLeaseDetails({ ...leaseDetails, end_date: e.target.value })}
            />
            {errors.end_date && <p className="text-red-500 text-xs italic">{errors.end_date}</p>}
            
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
            {errors.monthly_rent && <p className="text-red-500 text-xs italic">{errors.monthly_rent}</p>}
      
            <label className="block mb-2 text-sm font-bold text-white">Deposit</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Deposit"
                value={leaseDetails.deposit}
                onChange={(e) => setLeaseDetails({ ...leaseDetails, deposit: e.target.value })}
            />
            {errors.deposit && <p className="text-red-500 text-xs italic">{errors.deposit}</p>}

            <label className="block mb-2 text-sm font-bold text-white">Terms</label>
            <textarea
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Lease Terms"
                value={leaseDetails.terms}
                onChange={(e) => setLeaseDetails({ ...leaseDetails, terms: e.target.value })}
            />
            {errors.terms && <p className="text-red-500 text-xs italic">{errors.terms}</p>}
        </div>
        )}

        {step === 3 && (
        <div>
            <label className="block mb-2 text-sm font-bold text-white">Rent Date</label>
            <input
                type="date"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                value={rentDate}
                onChange={(e) => setRentDate(e.target.value)}
            />
            {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}

            <label className="block mb-2 text-sm font-bold text-white">Rent</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                value={rentDetails.rent}
                readOnly
            />
            {errors.rent && <p className="text-red-500 text-xs italic">{errors.rent}</p>}
              
            <label className="block mb-2 text-sm font-bold text-white">Trash Fee</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Trash Fee"
                value={rentDetails.trash}
                onChange={(e) => setRentDetails({ ...rentDetails, trash: e.target.value })}
            />
            {errors.trash && <p className="text-red-500 text-xs italic">{errors.trash}</p>}
      
            <label className="block mb-2 text-sm font-bold text-white">Water & Sewer Fee</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Water & Sewer Fee"
                value={rentDetails.water_sewer}
                onChange={(e) => setRentDetails({ ...rentDetails, water_sewer: e.target.value })}
            />
            {errors.water_sewer && <p className="text-red-500 text-xs italic">{errors.water_sewer}</p>}
      
            <label className="block mb-2 text-sm font-bold text-white">Parking Fee</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Parking Fee"
                value={rentDetails.parking}
                onChange={(e) => setRentDetails({ ...rentDetails, parking: e.target.value })}
            />
            {errors.parking && <p className="text-red-500 text-xs italic">{errors.parking}</p>}
      
            <label className="block mb-2 text-sm font-bold text-white">Debt</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Debt"
                value={rentDetails.debt}
                onChange={(e) => setRentDetails({ ...rentDetails, debt: e.target.value })}
            />
            {errors.debt && <p className="text-red-500 text-xs italic">{errors.debt}</p>}
      
            <label className="block mb-2 text-sm font-bold text-white">Breaks</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                placeholder="Breaks"
                value={rentDetails.breaks}
                onChange={(e) => setRentDetails({ ...rentDetails, breaks: e.target.value })}
            />
            {errors.breaks && <p className="text-red-500 text-xs italic">{errors.breaks}</p>}
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