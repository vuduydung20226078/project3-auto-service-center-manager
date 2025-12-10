import React from 'react';
import styled from 'styled-components';
import { 
  FaBox, 
  FaFolderOpen, 
  FaCalendarAlt, 
  FaUsers, 
  FaCog,
  FaSignOutAlt 
} from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 280px;
  background-color: #f5f5f5;
  padding: 20px;
  min-height: 100vh;
  border-right: 1px solid #e0e0e0;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
`;

const LogoSection = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const LogoTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
`;

const LogoSubtitle = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 10px;
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${props => props.$active ? '#4c00b4' : '#666'};
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${props => props.$active ? '#f0e6ff' : 'transparent'};
  font-weight: ${props => props.$active ? 600 : 500};
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0e6ff;
    color: #4c00b4;
  }

  svg {
    font-size: 18px;
  }
`;

const UserSection = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4c00b4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
`;

const UserDetails = styled.div`
  font-size: 12px;

  .name {
    font-weight: 600;
    color: #333;
  }

  .email {
    color: #999;
  }
`;

const LogoutBtn = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }
`;

const AdminSidebar = ({ activeMenu, onMenuClick, onLogout }) => {
  const menuItems = [
    { id: 'inventory', label: 'Inventory Management', icon: FaBox },
    { id: 'category', label: 'Category Management', icon: FaFolderOpen },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'appointment', label: 'Appointment Management', icon: FaCalendarAlt },
    { id: 'workorder', label: 'Work Order', icon: FaBox },
    { id: 'technician', label: 'Technician Assignment', icon: FaUsers },
    { id: 'control', label: 'Control Panel', icon: FaCog },
  ];

  return (
    <SidebarContainer>
      <LogoSection>
        <LogoTitle>Admin Panel</LogoTitle>
        <LogoSubtitle>Service Management</LogoSubtitle>
      </LogoSection>

      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.id}>
            <MenuLink
              $active={activeMenu === item.id}
              onClick={() => onMenuClick(item.id)}
            >
              <item.icon />
              {item.label}
            </MenuLink>
          </MenuItem>
        ))}
      </MenuList>

      <UserSection>
        <UserInfo>
          <UserAvatar>A</UserAvatar>
          <UserDetails>
            <div className="name">Admin User</div>
            <div className="email">admin@service.com</div>
          </UserDetails>
        </UserInfo>
        <LogoutBtn onClick={onLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutBtn>
      </UserSection>
    </SidebarContainer>
  );
};

export default AdminSidebar;
