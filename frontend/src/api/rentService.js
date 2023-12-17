const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRentDetails = async (unitId) => {
  const response = await fetch(`${API_URL}/rent/${unitId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addRentDetails = async (rentData) => {
  const response = await fetch(`${API_URL}/rent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rentData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateRentDetails = async (unitId, rentData) => {
  const response = await fetch(`${API_URL}/rent/${unitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rentData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteRentDetails = async (unitId) => {
  const response = await fetch(`${API_URL}/rent/${unitId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
