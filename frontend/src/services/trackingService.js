import api from './api';

/**
 * Service to handle order tracking requests
 */
export const trackingService = {
  /**
   * Fetch customer-visible tracking details
   */
  getCustomerTracking: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/tracking/customer`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer tracking:', error);
      throw error;
    }
  },

  /**
   * Fetch admin-visible tracking details
   */
  getAdminTracking: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin tracking:', error);
      throw error;
    }
  },

  /**
   * Helper to map raw status codes to user-friendly labels
   */
  getStatusLabel: (status) => {
    const statusMap = {
      'ORDER_PLACED': 'Order Received',
      'PAYMENT_VERIFYING': 'Payment Being Verified',
      'PROCESSING': 'Order Processing',
      'SHIPPED': 'Order Dispatched',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
  }
};
