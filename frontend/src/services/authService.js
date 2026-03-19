import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to login');
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to register');
        }
    }
};
