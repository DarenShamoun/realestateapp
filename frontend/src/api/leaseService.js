const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addLease = async (leaseData) => {
  const response = await fetch(`${API_URL}/lease`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leaseData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getLeases = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/lease?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateLease = async (lease_id, leaseData) => {
  const response = await fetch(`${API_URL}/lease/${lease_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leaseData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteLease = async (lease_id) => {
  const response = await fetch(`${API_URL}/lease/${lease_id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
