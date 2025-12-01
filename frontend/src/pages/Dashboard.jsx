// src/components/Dashboard.js
import React, { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Nếu không có token, chuyển hướng người dùng về trang đăng nhập
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <h2>Chào mừng đến với Dashboard!</h2>
    </div>
  );
};

export default Dashboard;
