const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usersRepo } = require('../repositories');

const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_DAYS = 7;

async function createTokensForUser(user) {
    const displayName = user.full_name || user.name || user.username || null;

    const accessToken = jwt.sign(
        { id: user.id, role: user.Role?.name || user.role, name: displayName, phone: user.phone, address: user.address },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: `${REFRESH_EXPIRES_DAYS}d` }
    );

    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await usersRepo.updateRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken, displayName };
}

async function verifyPassword(plain, hash) {
    return await bcrypt.compare(plain, hash);
}

const { RefreshToken } = require('../models');

async function login(email, password) {
    const user = await usersRepo.findByEmailWithPassword(email);
    if (!user) throw new Error('Invalid email');

    const match = await verifyPassword(password, user.password_hash);
    if (!match) throw new Error('Invalid password');

    const tokens = await createTokensForUser(user);
    return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, displayName: tokens.displayName || (user.full_name || user.name || user.username) };
}

async function refresh(oldRefreshToken) {
    if (!oldRefreshToken) throw new Error('Refresh token required');

    let payload;
    try {
        payload = require('jsonwebtoken').verify(oldRefreshToken, process.env.REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }

    const tokenInDb = await RefreshToken.findOne({ where: { token: oldRefreshToken } });
    if (!tokenInDb) throw new Error('Token reused or invalid');

    if (new Date(tokenInDb.expires_at) < new Date()) {
        await tokenInDb.destroy();
        throw new Error('Refresh token expired');
    }

    const user = await usersRepo.findById(payload.id);
    if (!user) throw new Error('User not found');

    // rotate
    await tokenInDb.destroy();
    const tokens = await createTokensForUser(user);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user };
}

async function logout(refreshToken) {
    if (!refreshToken) return;
    await RefreshToken.destroy({ where: { token: refreshToken } });
}

module.exports = {
    createTokensForUser,
    verifyPassword
    , login, refresh, logout
};
