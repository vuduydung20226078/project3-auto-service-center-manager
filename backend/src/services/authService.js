const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');  // Import models từ Sequelize
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

    // Tạo JWT token
    const token = jwt.sign(
        { id: user.id, role: user.Role.name }, // Payload: user.id và role
        process.env.JWT_SECRET,  // Mã bí mật
        { expiresIn: '8h' }  // Thời gian hết hạn token
    );

    return { token, user: { id: user.id, email: user.email, role: user.Role.name } };
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
