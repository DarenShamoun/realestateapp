const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRentDetails = async (id) => {
  const response = await fetch(`${API_URL}/rent/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getRecentRentByUnitId = async (unitId) => {
  const response = await fetch(`${API_URL}/rent/recent/${unitId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getAllRents = async () => {
  const response = await fetch(`${API_URL}/rent/all`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getMonthlyRent = async (unitId, year, month) => {
  let queryParams = new URLSearchParams({ unitId, year, month }).toString();
  const response = await fetch(`${API_URL}/rent/monthly?${queryParams}`);
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

export const updateRentDetails = async (id, rentData) => {
  const response = await fetch(`${API_URL}/rent/${id}`, {
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

export const deleteRentDetails = async (id) => {
  const response = await fetch(`${API_URL}/rent/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
