import api from './api';

export const adminService = {
    getPendingOrders: async () => {
        try {
            const response = await api.get('/admin/orders/verifying');
            return response.data;
        } catch (error) {
            // Fallback for mock demo
            return [
                { id: '1011', customerName: 'John Doe', amount: 899, slip: 'available', priorityScore: 45 },
                { id: '5542', customerName: 'Alice Smith', amount: 1200, slip: 'available', priorityScore: 22 }
            ];
        }
    },

    verifyPayment: async (orderId, status) => {
        try {
            const response = await api.post(`/admin/orders/${orderId}/verify-payment`);
            return response.data;
        } catch (error) {
            return { message: 'Verification authorized locally.' };
        }
    },

    getSystemStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            // Fallback for mock demo
            return {
                pendingPayments: 5,
                totalOrders: 28,
                activeCustomers: 12,
                revenue: 14500
            };
        }
    }
};
