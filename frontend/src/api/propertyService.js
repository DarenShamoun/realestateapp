const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getProperties = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/property?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateProperty = async (property_id, propertyData) => {
    const response = await fetch(`${API_URL}/property/${property_id}`, {
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
  
export const deleteProperty = async (property_id) => {
    const response = await fetch(`${API_URL}/property/${property_id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};