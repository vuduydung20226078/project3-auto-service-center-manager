import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {FaKey, FaEnvelope, FaUser, FaTimes} from "react-icons/fa";
import { login as apiLogin } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

import axios from "axios";
const Base_URL = "http://localhost:3000/api";
const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 30px;
  border-radius: 20px;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  with: 100%;
  margin-top: 30px;
`;
const Title = styled.h2`
  color: #3c009d;
  font-size: 48px;
  font-weight: 700;
`;
const Underline = styled.div`
  width: 65px;
  height: 6px;
  background-color: #3c009d;
  border-radius: 9px;
`;

const Form = styled.form`
  margin-top: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 480x;
  height: 50px;
  background-color: #eaeaea;
  border-radius: 6px;
`;
const Icon = styled.div`
  margin-left: 20px;
`;
const Input = styled.input`
  width: 400px;
  height: 40px;
  border: none;
  outline: none;
  color: #797979;
  background-color: transparent;
  font-size: 19px;
`;
const ForgotPassword = styled.div`
  padding-left: 240px;
  margin-top: 20px
  font-size: 18px;
  color: #797979
  span {
    color: #4c00;
  }
  span:hover {
    text-decoration: underline;
    cursor: pointer;
    color: #3c009d;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 30px;
  margin: 60px auto;
`;
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 50px;
  border-radius: 50px;
  font-size: 19px;
  font-weight: 600;
  cursor: pointer;
  background-color: ${(props) => (props.$active? "#EAEAEA" : "#4c00b4")};
  color: ${(props) => (props.$active? "#676767" : "#fff")};

  &:hover {
    background-color: ${(props) => (props.$active? "#d4d4d4" : "#3c009d")};
  }
`;

const SuccessNotification = styled.div`
  position: fixed;
  top: ${props => props.$show ? '20px' : '-100px'};
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: top 0.3s ease-in-out;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login: setAuthLogin } = useAuth();
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address (e.g., user@gmail.com)");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    setEmailError("");
    try {
      // Login API - sets access token in memory and refresh token in cookie
      await apiLogin({ email, password });
      
      console.log("Login successful");
      
      // Update auth context (NO reload needed - token already in memory)
      setAuthLogin();
      
      // Navigate to admin
      navigate('/admin');
      setLoading(false);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      setLoading(false);
    } 
  };
  const handleSignup = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    setEmailError("");
    try {
      const response = await axios.post(`${Base_URL}/auth/register`, { username, email, password });
      console.log("Signup successful");
      setLoading(false);
      
      // Hiển thị thông báo thành công
      setSuccessMessage("Account created successfully! Please login.");
      
      // Sau 3 giây, ẩn thông báo và chuyển sang login
      setTimeout(() => {
        setSuccessMessage("");
        setAction("Login");
        // Reset form
        setUsername("");
        setPassword("");
      }, 3000);
    } catch (err) {
      setError("Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return(
    <>
      <SuccessNotification $show={!!successMessage}>
        ✓ {successMessage}
      </SuccessNotification>
      
      <Container>
          <Header>
            <Title>{action}</Title>
            <Underline></Underline>
          </Header>
          
          <Form>
            <InputGroup>
              {action === "Login" ? null: <Icon><FaUser /></Icon>}
              {action === "Login" ? null : 
              <Input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />}
              
            </InputGroup>
            <InputGroup style={{ borderColor: emailError ? '#ff0000' : '#eaeaea' }}>
              <Icon><FaEnvelope /></Icon>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={handleEmailChange}
                required
              />
            </InputGroup>
            {emailError && <div style={{ color: '#ff0000', fontSize: '13px', marginTop: '-15px', width: '400px' }}>{emailError}</div>}
            <InputGroup>
              <Icon><FaKey /></Icon>
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </InputGroup>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ForgotPassword>Lost Password? <span>Click Here!</span></ForgotPassword>
            <ButtonGroup>
              <Button 
              type="button"
              $active={action === "Sign Up"}
              onClick={() => {
                if (action === "Login") {
                  handleLogin();
                  return;
                }
                setAction("Login");

              }}
              >Login</Button>
              <Button 
              type="button"
              $active={action === "Login"}
              onClick={() => {
                if (action === "Sign Up") {
                  handleSignup();
                  return;
                }
                setAction("Sign Up");
              }}
              >Sign Up</Button>
            </ButtonGroup>
          </Form>
        
      </Container>
    </>
  )
};
export default LoginSignup;