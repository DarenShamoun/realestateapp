const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadDocument = async (formData) => {
    const response = await fetch(`${API_URL}/document/upload`, {
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

export const deleteDocument = async (document_id) => {
    const response = await fetch(`${API_URL}/document/${document_id}/delete`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};
