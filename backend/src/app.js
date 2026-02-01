const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { sequelize } = require('./models');  // Kết nối DB

// Import Routes
const authRoutes = require('./routes/authRoute');
const catalogsRoutes = require('./routes/catalogsRoute');


// Create Express app
const app = express();

// CORS configuration for credentials
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies
}));

app.use(cookieParser()); // Parse cookies
app.use(express.json());  // Parse JSON requests

// Setup routes
app.use('/api/auth', authRoutes);  // Đăng ký route cho auth
app.use('/api/catalogs', catalogsRoutes);  // Đăng ký route cho catalogs
app.use('/api/users', require('./routes/usersRoute')); // Đăng ký route cho users
app.use('/api/customers', require('./routes/customersRoute')); // Đăng ký route cho customers
app.use('/api/vehicles', require('./routes/vehiclesRoute')); // Đăng ký route cho vehicles
app.use('/api/bookings', require('./routes/bookingsRoute')); // Đăng ký route cho bookings
app.use('/api/technicians', require('./routes/techniciansRoute')); // Đăng ký route cho technicians
app.use('/api/work-orders', require('./routes/workOrdersRoute')); // Đăng ký route cho work orders  
app.use('/api/billing', require('./routes/billingRoute')); // Đăng ký route cho billing
app.use('/api/stocks', require('./routes/stocksRoute')); // Đăng ký route cho stocks
app.use('/api/dashboard', require('./routes/dashboardRoute')); // Đăng ký route cho dashboard
app.use('/api/technician', require('./routes/technicianRoute')); // Đăng ký route cho technician portal
app.use('/api/payment', require('./routes/paymentRoute')); // Đăng ký route cho payment

app.use((err, req, res, next) => {
    // In ra thông tin lỗi chi tiết vào console để debug
    console.error(err.stack);

    // Gửi phản hồi lỗi cho client với mã lỗi 500 và thông báo đơn giản
    res.status(500).send('Something went wrong!');
});
// Set up server port

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await sequelize.authenticate(); // Kiểm tra kết nối DB
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('Failed to connect to database:', err);
    }
}

start();
