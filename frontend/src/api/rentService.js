const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRentDetails = async (unitId) => {
  const response = await fetch(`${API_URL}/rent/${unitId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getRentByDate = async (year, month, day, unitId, propertyId) => {
  let queryParams = new URLSearchParams({ year, month, day, unitId, propertyId });
  const response = await fetch(`${API_URL}/rent/by-date?${queryParams}`);
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
  let queryParams = new URLSearchParams({ unitId, year, month });
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
