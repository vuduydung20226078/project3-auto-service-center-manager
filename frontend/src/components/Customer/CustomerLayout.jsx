import React from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaCar, FaUser } from 'react-icons/fa';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const ContentArea = styled.div`
  padding-bottom: 80px;
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavItem = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.$active ? '#2563eb' : '#999'};
  
  &:hover {
    color: #2563eb;
  }
`;

const NavIcon = styled.div`
  font-size: 22px;
`;

const NavLabel = styled.div`
  font-size: 12px;
  font-weight: ${props => props.$active ? '600' : '500'};
`;

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/customer', icon: FaHome, label: 'Home' },
    { path: '/customer/bookings', icon: FaCalendarAlt, label: 'Bookings' },
    { path: '/customer/vehicles', icon: FaCar, label: 'Vehicles' },
    { path: '/customer/profile', icon: FaUser, label: 'Profile' }
  ];

  const isActive = (path) => {
    if (path === '/customer') {
      return location.pathname === '/customer';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <LayoutContainer>
      <ContentArea>
        <Outlet />
      </ContentArea>
      
      <BottomNav>
        {navItems.map(item => (
          <NavItem
            key={item.path}
            $active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            <NavIcon>
              <item.icon />
            </NavIcon>
            <NavLabel $active={isActive(item.path)}>
              {item.label}
            </NavLabel>
          </NavItem>
        ))}
      </BottomNav>
    </LayoutContainer>
  );
};

export default CustomerLayout;
