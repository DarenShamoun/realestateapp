const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPayments = async (filters = {}) => {
  const { unitId, tenantId, year, month } = filters;
  let queryParams = new URLSearchParams();

  if (unitId) queryParams.append('unitId', unitId);
  if (tenantId) queryParams.append('tenantId', tenantId);
  if (year) queryParams.append('year', year);
  if (month) queryParams.append('month', month);

  const response = await fetch(`${API_URL}/payment?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getPayment = async (id) => {
  const response = await fetch(`${API_URL}/payment/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updatePayment = async (id, paymentData) => {
    const response = await fetch(`${API_URL}/payment/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
  
export const deletePayment = async (id) => {
    const response = await fetch(`${API_URL}/payment/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
