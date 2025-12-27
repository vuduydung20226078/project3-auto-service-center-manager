const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, RefreshToken } = require('../models');  // Import models từ Sequelize
const e = require('express');

// Đăng nhập
exports.login = async (email, password) => {
    const user = await User.findOne({
        where: { email },
        include: [{ model: Role }]  // Lấy thông tin role của người dùng
    });

    if (!user) throw new Error('Invalid email');

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid password');

    // Tạo JWT access token (ngắn hạn - 15 phút)
    const accessToken = jwt.sign(
        { id: user.id, role: user.Role.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Tạo refresh token (dài hạn - 7 ngày)
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Lưu refresh token vào DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    await RefreshToken.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: expiresAt
    });

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.Role.name }
    };
};

// Đăng ký
exports.register = async (email, username, password) => {
    const passwordHash = await bcrypt.hash(password, 10);

    // Kiểm tra xem email, username đã tồn tại chưa
    const existingUserByEmail = await User.findOne({ where: { email } });
    const existingUserByUsername = await User.findOne({ where: { username } });

    if (existingUserByEmail) throw new Error('Email already exists');
    if (existingUserByUsername) throw new Error('Username already exists');

    // Tạo người dùng mới trong DB
    const user = await User.create({
        username,
        email,
        password_hash: passwordHash,
        role_id: 5  // Gán role_id mặc định là 5 (Customer)
    });

    return {
        user: { id: user.id, email: user.email, role: user.role_id },
        message: 'User registered successfully'
    };
};

// Refresh token rotation
exports.refreshToken = async (oldRefreshToken) => {
    if (!oldRefreshToken) throw new Error('Refresh token required');

    // 1. Verify token
    let payload;
    try {
        payload = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }

    // 2. Kiểm tra token trong DB
    const tokenInDb = await RefreshToken.findOne({ where: { token: oldRefreshToken } });
    if (!tokenInDb) {
        throw new Error('Token reused or invalid');
    }

    // 3. Kiểm tra hết hạn
    if (new Date(tokenInDb.expires_at) < new Date()) {
        await tokenInDb.destroy();
        throw new Error('Refresh token expired');
    }

    // 4. Lấy user info
    const user = await User.findByPk(payload.id, { include: [{ model: Role }] });
    if (!user) throw new Error('User not found');

    // 5. Xóa token cũ (rotation)
    await tokenInDb.destroy();

    // 6. Tạo token mới
    const newAccessToken = jwt.sign(
        { id: user.id, role: user.Role.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const newRefreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // 7. Lưu refresh token mới
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
        user_id: user.id,
        token: newRefreshToken,
        expires_at: expiresAt
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Revoke refresh token (logout)
exports.revokeRefreshToken = async (refreshToken) => {
    if (!refreshToken) return;

    await RefreshToken.destroy({ where: { token: refreshToken } });
};
