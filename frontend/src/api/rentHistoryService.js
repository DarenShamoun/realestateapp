const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRentHistory = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    try {
        const response = await fetch(`${API_URL}/rent-history?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching rent history:', error);
        throw error;
    }
};
