const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng nhập
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, accessToken, refreshToken, displayName } = await authService.login(email, password);

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        res.json({ accessToken, user: { id: user.id, email: user.email, role: user.Role?.name, name: displayName || user.full_name, phone: user.phone, address: user.address } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: error.message });
    }
};

// Đăng ký
const authOrchestrator = require('../orchestrators/auth.orchestrator');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Delegate multi-step creation to orchestrator which handles transaction
        const { user } = await authOrchestrator.registerUserAndCustomer({ username, email, password });

        // Create tokens and persist refresh token
        const tokens = await authService.createTokensForUser(user);

        // Set refresh token cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email, role: user.role_id, name: tokens.displayName || user.full_name || user.username },
            accessToken: tokens.accessToken
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.message && (error.message.includes('already exists') || error.name === 'SequelizeUniqueConstraintError')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Refresh token
exports.refresh = async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    try {
        const { accessToken, refreshToken } = await authService.refresh(oldRefreshToken);
        // Set new refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        res.json({ accessToken });
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(401).json({ message: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth'
        });
        res.status(204).send();
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: error.message });
    }
};
