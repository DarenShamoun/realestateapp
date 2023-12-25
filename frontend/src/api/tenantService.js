const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getTenants = async () => {
  const response = await fetch(`${API_URL}/tenant`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getTenant = async (id) => {
  const response = await fetch(`${API_URL}/tenant/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getTenantPayments = async (tenantId, startDate, endDate) => {
  const queryParams = new URLSearchParams({ startDate, endDate });
  const response = await fetch(`${API_URL}/tenant/${tenantId}/payments?${queryParams}`);
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

export const updateTenant = async (id, tenantData) => {
    const response = await fetch(`${API_URL}/tenant/${id}`, {
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
  
export const deleteTenant = async (id) => {
    const response = await fetch(`${API_URL}/tenant/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
  