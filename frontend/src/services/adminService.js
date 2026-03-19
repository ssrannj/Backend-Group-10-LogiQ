import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const getAuthHeader = () => {
    const token = localStorage.getItem('logiq_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
    getPendingOrders: async () => {
        try {
            const response = await axios.get(`${API_URL}/orders/pending-payment`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch pending orders');
        }
    },

    verifyPayment: async (orderId, status) => {
        try {
            const response = await axios.post(`${API_URL}/orders/verify-payment`, { orderId, status }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to verify payment');
        }
    },

    getSystemStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/stats`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch admin statistics');
        }
    }
};
