const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getLeases = async () => {
  const response = await fetch(`${API_URL}/lease`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getLease = async (id) => {
  const response = await fetch(`${API_URL}/lease/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

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

export const updateLease = async (id, leaseData) => {
    const response = await fetch(`${API_URL}/lease/${id}`, {
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
  
export const deleteLease = async (id) => {
    const response = await fetch(`${API_URL}/lease/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
