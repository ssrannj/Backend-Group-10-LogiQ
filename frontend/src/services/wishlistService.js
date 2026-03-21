import api from './api';

export const wishlistService = {
    getWishlist: async () => {
        const response = await api.get('/wishlist/my');
        return response.data;
    },

    addToWishlist: async (productId) => {
        const response = await api.post('/wishlist', null, { params: { productId } });
        return response.data;
    },

    removeFromWishlist: async (id) => {
        const response = await api.delete(`/wishlist/${id}`);
        return response.data;
    }
};
