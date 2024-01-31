const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addDocument = async (formData) => {
    const response = await fetch(`${API_URL}/document`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const getDocuments = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/documents?${queryParams}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const updateDocument = async (document_id, documentData) => {
    const response = await fetch(`${API_URL}/document/${document_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const deleteDocument = async (document_id) => {
    const response = await fetch(`${API_URL}/document/${document_id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};
