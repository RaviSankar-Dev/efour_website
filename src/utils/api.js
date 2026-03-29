export const BASE_URL = import.meta.env.VITE_API_URL || '';

export const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-auth-token'] = token;
    }

    // Ensure the URL is absolute ONLY if we explicitly want to bypass proxy/rewrite.
    // Otherwise, let the browser/server handle it relative to the origin.
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    let res = await fetch(fullUrl, { ...options, headers });

    // If unauthorized, attempt to refresh the token using the HTTP-only cookie
    if (res.status === 401) {
        try {
            const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
                method: 'POST'
            });

            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                if (refreshData.token) {
                    token = refreshData.token;
                    localStorage.setItem('token', token);

                    // Update headers and retry the original request
                    headers['Authorization'] = `Bearer ${token}`;
                    headers['x-auth-token'] = token;
                    res = await fetch(fullUrl, { ...options, headers });

                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('efour-storage');
                        window.dispatchEvent(new Event('auth_expired'));
                        window.location.href = '/login';
                    }
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('efour-storage'); // Clear persisted zustand store
                window.dispatchEvent(new Event('auth_expired'));
                window.location.href = '/login'; // Force redirect to login
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('efour-storage');
            window.dispatchEvent(new Event('auth_expired'));
            window.location.href = '/login';
        }
    }

    return res;
};

export const sendOtp = async (mobile, additionalData = {}) => {
    return fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, location: 'E4', ...additionalData })
    });
};

export const verifyOtp = async (mobile, otp, additionalData = {}) => {
    return fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, location: 'E4', ...additionalData })
    });
};

export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}`, 'x-auth-token': token } : {};
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('efour-storage');
        return res;
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const deleteAccount = async () => {
    return fetchWithAuth('/api/profile', {
        method: 'DELETE'
    });
};

export const getMyTickets = async () => {
    return fetchWithAuth(import.meta.env.VITE_TICKETS_API_URL || 'https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/tickets/my-tickets');
};
