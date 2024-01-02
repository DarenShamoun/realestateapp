const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getTenants = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/tenant?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addTenant = async (tenantData) => {
  const response = await fetch(`${API_URL}/tenant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tenantData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateTenant = async (tenant_id, tenantData) => { 
  const response = await fetch(`${API_URL}/tenant/${tenant_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tenantData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
  
export const deleteTenant = async (tenant_id) => {
  const response = await fetch(`${API_URL}/tenant/${tenant_id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
