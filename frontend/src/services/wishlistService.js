import axios from 'axios';

const API_URL = 'http://localhost:8080/api/wishlist';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('logiq_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const wishlistService = {
    getWishlist: async () => {
        try {
            const response = await axios.get(`${API_URL}/my`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    },

    addToWishlist: async (productId) => {
        try {
            const response = await axios.post(API_URL, { productId }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    },

    removeFromWishlist: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
};
