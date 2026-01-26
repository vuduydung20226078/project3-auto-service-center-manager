import React, { useState } from 'react';
import styled from 'styled-components';
import { FaWrench, FaUser, FaLock } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 16px;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 16px rgba(245, 158, 11, 0.3);
`;

const Icon = styled(FaWrench)`
  font-size: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 40px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #1f2937;
  transition: all 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Version = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  margin-top: 24px;
`;

const TechnicianLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - sẽ thay bằng API call sau
    if (credentials.username && credentials.password) {
      onLogin?.({
        id: 1,
        username: credentials.username,
        fullName: 'Nguyễn Văn A',
        email: 'vuduyduong0811997@gmail.com'
      });
    }
  };

  return (
    <Container>
      <LoginCard>
        <IconWrapper>
          <Icon />
        </IconWrapper>
        
        <Title>Technician Portal</Title>
        <Subtitle>AutoCare Service Center</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FaUser /> Username
            </Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>
              <FaLock /> Password
            </Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </InputWrapper>
          </FormGroup>

          <SignInButton type="submit">
            Sign In
          </SignInButton>
        </Form>

        <Version>Version 1.0.0</Version>
      </LoginCard>
    </Container>
  );
};

export default TechnicianLogin;
