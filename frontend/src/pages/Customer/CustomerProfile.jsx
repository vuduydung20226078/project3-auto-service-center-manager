import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logout as apiLogout } from '../../api/auth';
import api from '../../api/api';
import { FaCar, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaBell, FaComment, FaSignOutAlt, FaCamera } from 'react-icons/fa';
import toast from '../../utils/toast';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
`;

const Header = styled.div`
  background: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const Content = styled.div`
  padding: 0;
`;

const ProfileHeader = styled.div`
  background: white;
  padding: 32px 20px;
  text-align: center;
  position: relative;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto;
`;

const EditAvatarButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #2563eb;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  cursor: pointer;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #666;
`;

const Section = styled.div`
  margin-top: 8px;
  background: white;
`;

const SectionTitle = styled.div`
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f5f5f5;
`;

const MenuItem = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MenuIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
`;

const MenuContent = styled.div`
  flex: 1;
`;

const MenuLabel = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const MenuSubLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const SaveButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  color: #333;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  width: 48px;
  height: 28px;
  background: ${props => props.$active ? '#2563eb' : '#e5e7eb'};
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$active ? '22px' : '2px'};
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s ease;
  }
`;

const LogoutButton = styled.button`
  width: calc(100% - 40px);
  margin: 20px;
  padding: 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

const Version = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 12px;
  color: #999;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$primary ? `
    background: #2563eb;
    color: white;
    
    &:hover {
      background: #1d4ed8;
    }
  ` : `
    background: #f3f4f6;
    color: #333;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, logout: contextLogout } = useAuth();
  console.log(user);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getUserInitials = () => {
    const name = profile.name || user?.username || user?.email;
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const getUserName = () => {
    return profile.name || user?.username || (user?.email && user.email.split('@')[0]) || 'User';
  };

  useEffect(() => {
    // Initialize profile from auth user
    setProfile(prev => ({
      ...prev,
      name: user?.username || prev.name,
      email: user?.email || prev.email
    }));

    // If user is a Customer, fetch customer profile to get full_name
    (async () => {
      try {
        if (user && (user.role === 'Customer' || (user.role && user.role.toLowerCase && user.role.toLowerCase() === 'customer'))) {
          const res = await api.get('/customers/me');
          const c = res.data;
          setProfile(prev => ({
            ...prev,
            name: c.name || prev.name,
            email: c.email || prev.email,
            phone: c.phone || prev.phone,
            address: c.address || prev.address
          }));
        }
      } catch (err) {
        // ignore
      }
    })();
  }, [user]);

  const startEdit = (fieldKey) => {
    setEditingField(fieldKey);
    setTempValue(profile[fieldKey] || '');
  };

  const cancelEdit = (e) => {
    if (e) e.stopPropagation();
    setEditingField(null);
    setTempValue('');
  };

  const saveField = async (fieldKey, e) => {
    if (e) e.stopPropagation();
    try {
      const payload = {};
      payload[fieldKey] = tempValue;
      await api.patch('/customers/me', payload);
      setProfile(prev => ({ ...prev, [fieldKey]: tempValue }));
      toast.success('Saved successfully');
      setEditingField(null);
      setTempValue('');
    } catch (err) {
      console.error('Failed to save profile field', err);
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleEditAvatar = () => {
    toast.info('Edit profile picture coming soon!');
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const submitPasswordChange = async () => {
    try {
      const { oldPassword, newPassword, confirmPassword } = passwordData;
      
      if (!oldPassword || !newPassword || !confirmPassword) {
        toast.error('Please fill all fields');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      await api.patch('/users/change-password', {
        oldPassword,
        newPassword
      });
      
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change password', err);
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordModal(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleEditProfile = () => {
    toast.info('Edit profile feature coming soon!');
  };

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
          <LogoIcon><FaCar /></LogoIcon>
          AutoCare
        </Logo>
      </Header>

      <Content>
        <ProfileHeader>
          <AvatarContainer>
            <Avatar>{getUserInitials()}</Avatar>
            <EditAvatarButton onClick={handleEditAvatar}>
              <FaCamera />
            </EditAvatarButton>
          </AvatarContainer>
          <UserName>{getUserName()}</UserName>
          <UserEmail>{user?.email || 'john.smith@email.com'}</UserEmail>
        </ProfileHeader>

        <SectionTitle>Personal Information</SectionTitle>
        <Section>
          <MenuItem onClick={() => startEdit('name')}>
            <MenuIcon><FaUser /></MenuIcon>
            <MenuContent>
              <MenuLabel>Full Name</MenuLabel>
              {editingField === 'name' ? (
                <div>
                  <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                  <SaveButton onClick={(e) => saveField('name', e)}>Save</SaveButton>
                  <CancelButton onClick={cancelEdit}>Cancel</CancelButton>
                </div>
              ) : (
                <MenuSubLabel>{profile.name || user.name}</MenuSubLabel>
              )}
            </MenuContent>
          </MenuItem>

          <MenuItem>
            <MenuIcon><FaEnvelope /></MenuIcon>
            <MenuContent>
              <MenuLabel>Email</MenuLabel>
              <MenuSubLabel>{profile.email || user?.email || 'Not set'}</MenuSubLabel>
            </MenuContent>
          </MenuItem>

          <MenuItem onClick={() => startEdit('phone')}>
            <MenuIcon><FaPhone /></MenuIcon>
            <MenuContent>
              <MenuLabel>Phone Number</MenuLabel>
              {editingField === 'phone' ? (
                <div>
                  <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                  <SaveButton onClick={(e) => saveField('phone', e)}>Save</SaveButton>
                  <CancelButton onClick={cancelEdit}>Cancel</CancelButton>
                </div>
              ) : (
                <MenuSubLabel>{profile.phone || 'Not set'}</MenuSubLabel>
              )}
            </MenuContent>
          </MenuItem>

          <MenuItem onClick={() => startEdit('address')}>
            <MenuIcon><FaMapMarkerAlt /></MenuIcon>
            <MenuContent>
              <MenuLabel>Address</MenuLabel>
              {editingField === 'address' ? (
                <div>
                  <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                  <SaveButton onClick={(e) => saveField('address', e)}>Save</SaveButton>
                  <CancelButton onClick={cancelEdit}>Cancel</CancelButton>
                </div>
              ) : (
                <MenuSubLabel>{profile.address || 'Not set'}</MenuSubLabel>
              )}
            </MenuContent>
          </MenuItem>
        </Section>

        <SectionTitle>Security</SectionTitle>
        <Section>
          <MenuItem onClick={handleChangePassword}>
            <MenuIcon><FaLock /></MenuIcon>
            <MenuContent>
              <MenuLabel>Change Password</MenuLabel>
              <MenuSubLabel>Update your password</MenuSubLabel>
            </MenuContent>
          </MenuItem>
        </Section>

        <SectionTitle>Preferences</SectionTitle>
        <Section>
          <MenuItem onClick={() => setEmailNotifications(!emailNotifications)}>
            <MenuIcon><FaBell /></MenuIcon>
            <MenuContent>
              <MenuLabel>Email Notifications</MenuLabel>
              <MenuSubLabel>Receive booking updates via email</MenuSubLabel>
            </MenuContent>
            <ToggleSwitch $active={emailNotifications} />
          </MenuItem>
          
          <MenuItem onClick={() => setSmsNotifications(!smsNotifications)}>
            <MenuIcon><FaComment /></MenuIcon>
            <MenuContent>
              <MenuLabel>SMS Notifications</MenuLabel>
              <MenuSubLabel>Receive reminders via SMS</MenuSubLabel>
            </MenuContent>
            <ToggleSwitch $active={smsNotifications} />
          </MenuItem>
        </Section>

        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>

        <Version>AutoCare v1.0.3</Version>
      </Content>

      {showPasswordModal && (
        <ModalOverlay onClick={cancelPasswordChange}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Change Password</ModalTitle>
            
            <ModalInput
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
            />
            
            <ModalInput
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            />
            
            <ModalInput
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            />
            
            <ModalButtons>
              <ModalButton onClick={cancelPasswordChange}>Cancel</ModalButton>
              <ModalButton $primary onClick={submitPasswordChange}>Change Password</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CustomerProfile;
