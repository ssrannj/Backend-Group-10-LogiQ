import api from './api';

export const adminService = {
    getPendingOrders: async () => {
        const response = await api.get('/admin/orders/verifying');
        return response.data;
    },

    verifyPayment: async (id) => {
        const response = await api.post(`/admin/orders/${id}/verify-payment`);
        return response.data;
    },

    getSystemStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    }
};
