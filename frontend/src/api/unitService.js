const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUnits = async () => {
  const response = await fetch(`${API_URL}/unit`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getUnit = async (id) => {
  const response = await fetch(`${API_URL}/unit/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getUnitsByPropertyId = async (propertyId) => {
  const response = await fetch(`${API_URL}/unit?propertyId=${propertyId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getUnitsByTenantId = async (tenantId) => {
  const response = await fetch(`${API_URL}/unit?tenantId=${tenantId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getUnitFinancialSummary = async (id, year, month) => {
  let url = `${API_URL}/unit/${id}/financial-summary`;
  
  // Adding query parameters for year and month
  const queryParams = new URLSearchParams();
  if (year) queryParams.append('year', year);
  if (month) queryParams.append('month', month);
  if (queryParams.toString()) url += `?${queryParams}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addUnit = async (unitData) => {
  const response = await fetch(`${API_URL}/unit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(unitData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateUnit = async (id, unitData) => {
    const response = await fetch(`${API_URL}/unit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unitData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};

export const deleteUnit = async (id) => {
    const response = await fetch(`${API_URL}/unit/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
