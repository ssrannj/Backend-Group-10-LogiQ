// A temporary fake authentication service
// Easy to replace with real API calls using fetch or axios

export const authService = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@logiq.com' && password === 'admin123') {
                    resolve({
                        id: 1,
                        fullName: 'Admin User',
                        email: 'admin@logiq.com',
                        role: 'ADMIN',
                        token: 'mock-jwt-token-admin'
                    });
                } else if (email === 'customer@logiq.com' && password === 'customer123') {
                    resolve({
                        id: 2,
                        fullName: 'Regular Customer',
                        email: 'customer@logiq.com',
                        role: 'CUSTOMER',
                        token: 'mock-jwt-token-customer'
                    });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 800);
        });
    },

    register: async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock successful registration
                if (!userData.email || !userData.password) {
                    reject(new Error('Missing required fields'));
                } else {
                    resolve({
                        id: Math.floor(Math.random() * 1000) + 3,
                        fullName: userData.fullName,
                        email: userData.email,
                        role: userData.role || 'CUSTOMER',
                        token: `mock-jwt-token-new-${Date.now()}`
                    });
                }
            }, 800);
        });
    }
};
