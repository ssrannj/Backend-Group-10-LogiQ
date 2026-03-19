import axios from 'axios';

const API_URL = 'http://localhost:8080/api/checkout';

const getAuthHeader = () => {
    const token = localStorage.getItem('logiq_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const checkoutService = {
    submitBankTransfer: async (orderId, file) => {
        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('paymentSlip', file);

        try {
            const response = await axios.post(`${API_URL}/bank-transfer`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to submit payment slip');
        }
    }
};
