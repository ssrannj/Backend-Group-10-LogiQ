import api from './api';

export const productService = {
    getProducts: async (category = '', search = '', page = 0, size = 12) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('size', size);

        const response = await api.get(`/products?${params.toString()}`);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    }
};
