import axios from "axios";
import { setAccessToken, clearAccessToken } from './tokenManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Đăng nhập
export const login = async (payload) => {
    try {
        console.log(' Sending login request...');
        const response = await axios.post(`${API_URL}/auth/login`, payload, {
            withCredentials: true // Gửi cookie 
        });

        console.log(' Login response:', response.data);

        // Lưu access token vào memory
        setAccessToken(response.data.accessToken);

        // Lưu user vào localStorage (không nhạy cảm)
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        console.error(' Login error:', error);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Đăng ký
export const register = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

// Đăng xuất
export const logout = async () => {
    try {
        await axios.post(`${API_URL}/auth/logout`, {}, {
            withCredentials: true // Gửi cookie để xóa
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Xóa token và user
        clearAccessToken();
        localStorage.removeItem('user');
    }
};

// Refresh access token
let refreshPromise = null; // Global lock để tránh duplicate calls

export const refreshAccessToken = async () => {
    // Nếu đang refresh, return promise hiện tại
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
                withCredentials: true
            });
            setAccessToken(response.data.accessToken);
            console.log('Access token refreshed');
            return response.data.accessToken;
        } catch (error) {
            clearAccessToken();
            throw error;
        } finally {
            // Clear lock sau khi xong
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};
