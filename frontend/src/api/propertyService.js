const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProperties = async () => {
  const response = await fetch(`${API_URL}/property`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProperty = async (id) => {
  const response = await fetch(`${API_URL}/property/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getPropertyFinancialSummary = async (id, year, month) => {
  let queryParams = new URLSearchParams({ year, month });
  const response = await fetch(`${API_URL}/property/${id}/financial-summary?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getMonthlyIncome = async (propertyId, year, month) => {
  let queryParams = new URLSearchParams({ year, month });
  const response = await fetch(`${API_URL}/property/${propertyId}/monthly-income?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getPropertyExpenses = async (id, year, month) => {
  let queryParams = new URLSearchParams({ year, month });
  const response = await fetch(`${API_URL}/property/${id}/expenses?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addProperty = async (propertyData) => {
  const response = await fetch(`${API_URL}/property`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(propertyData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateProperty = async (id, propertyData) => {
    const response = await fetch(`${API_URL}/property/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
  
export const deleteProperty = async (id) => {
    const response = await fetch(`${API_URL}/property/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
  