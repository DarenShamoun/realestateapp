const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUnits = async () => {
  const response = await fetch(`${API_URL}/unit`);
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
