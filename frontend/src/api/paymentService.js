const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPayments = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/payment?${queryParams}`);
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

export const updatePayment = async (payment_id, paymentData) => {
    const response = await fetch(`${API_URL}/payment/${payment_id}`, {
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
  
export const deletePayment = async (payment_id) => {
    const response = await fetch(`${API_URL}/payment/${payment_id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
