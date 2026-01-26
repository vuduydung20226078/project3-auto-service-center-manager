import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout as apiLogout } from '../api/auth';
import { FaCar, FaHistory, FaUser, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import toast from '../utils/toast';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.header`
  background: white;
  padding: 20px 40px;
  border-radius: 15px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  color: #666;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const Card = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  font-size: 40px;
  color: ${props => props.$color};
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
`;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout: contextLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await apiLogout();
      contextLogout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <Container>
      <Header>
        <Logo>
          <FaCar /> AutoCare Pro
        </Logo>
        <UserInfo>
          <UserName>Welcome, {user?.email || 'Customer'}</UserName>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </LogoutButton>
        </UserInfo>
      </Header>

      <Content>
        <WelcomeCard>
          <WelcomeTitle>Customer Dashboard</WelcomeTitle>
          <WelcomeText>
            Manage your vehicle services, track bookings, and view service history
          </WelcomeText>
        </WelcomeCard>

        <CardGrid>
          <Card onClick={() => navigate('/booking')}>
            <CardIcon $color="#667eea">
              <FaCalendarAlt />
            </CardIcon>
            <CardTitle>Book a Service</CardTitle>
            <CardDescription>
              Schedule a new service appointment for your vehicle
            </CardDescription>
          </Card>

          <Card onClick={() => toast.info('Coming soon!')}>
            <CardIcon $color="#764ba2">
              <FaHistory />
            </CardIcon>
            <CardTitle>Service History</CardTitle>
            <CardDescription>
              View your past services and maintenance records
            </CardDescription>
          </Card>

          <Card onClick={() => toast.info('Coming soon!')}>
            <CardIcon $color="#f093fb">
              <FaUser />
            </CardIcon>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </Card>
        </CardGrid>
      </Content>
    </Container>
  );
};

export default CustomerDashboard;
