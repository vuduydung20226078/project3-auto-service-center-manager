import React, { useState } from "react";
import styled from "styled-components";
import {FaKey, FaEnvelope, FaUser, FaTimes} from "react-icons/fa";
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
const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${Base_URL}/auth/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      // Redirect to admin dashboard after successful login
      window.location.href = '/admin';
      console.log("Login successful");
      setLoading(false);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      setLoading(false);
    } 
  };
  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${Base_URL}/auth/register`, { username, email, password });
      console.log("Signup successful");
      setLoading(false);
    } catch (err) {
      setError("Signup failed. Please try again.");
      setLoading(false);
    }
  };
  return(
    <>
      <Container>
          <Header>
            <Title>{action}</Title>
            <Underline></Underline>
          </Header>
          
          <Form>
            <InputGroup>
              {action === "Login" ? null: <Icon><FaUser /></Icon>}
              {action === "Login" ? null : 
              <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>}
              
            </InputGroup>
            <InputGroup>
              <Icon><FaEnvelope /></Icon>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Icon><FaKey /></Icon>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
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