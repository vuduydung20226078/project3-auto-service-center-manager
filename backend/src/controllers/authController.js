const authService = require('../services/authService');

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await authService.login(email, password);
        res.json(response);  // Trả về token và user
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Đăng ký
exports.register = async (req, res) => {
    const { username, email, password} = req.body;

    try {
        const response = await authService.register(email, username, password);
        res.status(201).json({ message: 'User registered successfully', user: response });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.error(error);
    }
};
