import api from './api';

export const checkoutService = {
    submitBankTransfer: async (orderId, file) => {
        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('file', file);

        const response = await api.post('/orders/checkout/bank-transfer', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
