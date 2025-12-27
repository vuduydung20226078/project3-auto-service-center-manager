const authService = require('../services/authService');

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await authService.login(email, password);

        // Set refresh token trong httpOnly cookie
        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            path: '/api/auth'
        });

        // Trả về access token (frontend lưu trong memory)
        res.json({
            accessToken: response.accessToken,
            user: response.user
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Đăng ký
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const response = await authService.register(email, username, password);
        res.status(201).json({ message: 'User registered successfully', user: response });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.error(error);
    }
};

// Refresh token
exports.refresh = async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;

    try {
        const tokens = await authService.refreshToken(oldRefreshToken);

        // Set refresh token mới trong httpOnly cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        // Trả access token mới
        res.json({ accessToken: tokens.accessToken });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        await authService.revokeRefreshToken(refreshToken);

        // Xóa cookie
        res.clearCookie('refreshToken', { path: '/api/auth' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
