const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getUnits = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/unit?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateUnit = async (unit_id, unitData) => {
    const response = await fetch(`${API_URL}/unit/${unit_id}`, {
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

export const deleteUnit = async (unit_id) => {
    const response = await fetch(`${API_URL}/unit/${unit_id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
