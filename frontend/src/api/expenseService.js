const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getExpenses = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/expense?${queryParams}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateExpense = async (expense_id, expenseData) => {
  const response = await fetch(`${API_URL}/expense/${expense_id}`, {
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

export const deleteExpense = async (expense_id) => {
  const response = await fetch(`${API_URL}/expense/${expense_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
