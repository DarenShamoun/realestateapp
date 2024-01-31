const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addRent = async (rentData) => {
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

export const getRents = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/rent?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateRent = async (rent_id, rentData) => {
  const response = await fetch(`${API_URL}/rent/${rent_id}`, {
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

export const deleteRent = async (rent_id) => {
  const response = await fetch(`${API_URL}/rent/${rent_id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
