const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getExpenses = async ({ propertyId, year, month } = {}) => {
  let queryParams = new URLSearchParams({ propertyId, year, month }).toString();
  const response = await fetch(`${API_URL}/expense?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getExpensesByPropertyId = async (propertyId) => {
  const response = await fetch(`${API_URL}/expense?propertyId=${propertyId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getExpense = async (id) => {
  const response = await fetch(`${API_URL}/expense/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const addExpense = async (expenseData) => {
  const response = await fetch(`${API_URL}/expense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateExpense = async (id, expenseData) => {
    const response = await fetch(`${API_URL}/expense/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
  
export const deleteExpense = async (id) => {
    const response = await fetch(`${API_URL}/expense/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
