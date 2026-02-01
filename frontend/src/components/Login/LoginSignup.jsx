import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaArrowLeft, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaCheckCircle, FaCar } from "react-icons/fa";
import { login as apiLogin } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import toast from "../../utils/toast";
import axios from "axios";

const Base_URL = "http://localhost:3000/api";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ed4e9d 0%, #f86c6b 50%, #ff8866 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 700px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 968px) {
    flex-direction: column;
    height: auto;
    max-width: 500px;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #5ECFCC 0%, #4DB8C4 100%);
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  color: white;
  position: relative;
  
  @media (max-width: 968px) {
    padding: 40px 30px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin: 40px 0 30px 0;
  font-size: 40px;
`;

const BrandTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
`;

const BrandSubtitle = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: auto;
`;

const IllustrationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  font-size: 120px;
  opacity: 0.3;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
`;

const RightPanel = styled.div`
  flex: 1;
  background: #2D3748;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 968px) {
    padding: 40px 30px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-bottom: 50px;
`;

const Tab = styled.button`
  padding: 10px 30px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active ? '#5ECFCC' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#A0AEC0'};
  
  &:hover {
    background: ${props => props.$active ? '#4DB8C4' : 'rgba(94, 207, 204, 0.1)'};
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #A0AEC0;
  margin-bottom: 40px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #A0AEC0;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  padding-left: 45px;
  background: #1A202C;
  border: 2px solid ${props => props.$error ? '#FC8181' : '#4A5568'};
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #718096;
  }
  
  &:focus {
    outline: none;
    border-color: #5ECFCC;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  color: #718096;
  font-size: 16px;
  pointer-events: none;
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 15px;
  color: #718096;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    color: #A0AEC0;
  }
`;

const ErrorMessage = styled.div`
  color: #FC8181;
  font-size: 12px;
  margin-top: 5px;
`;

const RememberRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 30px 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #A0AEC0;
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ForgotLink = styled.a`
  font-size: 14px;
  color: #5ECFCC;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TermsCheckbox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #A0AEC0;
  margin: 20px 0;
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    cursor: pointer;
  }
  
  a {
    color: #5ECFCC;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #5ECFCC;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4DB8C4;
  }
  
  &:disabled {
    background: #4A5568;
    cursor: not-allowed;
  }
`;

const BottomText = styled.div`
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #A0AEC0;
  
  a {
    color: #5ECFCC;
    cursor: pointer;
    text-decoration: none;
    margin-left: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login: setAuthLogin } = useAuth();
  const [action, setAction] = useState("Sign In");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiLogin({ email, password });
      toast.success("Login successful!");
      setAuthLogin();
      
      // Navigate based on role
      if (response.user && response.user.role === 'Customer') {
        navigate('/customer');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms of service");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${Base_URL}/auth/register`, { username, email, password });
      toast.success("Account created successfully! Please login.");
      
      setTimeout(() => {
        setAction("Sign In");
        setUsername("");
        setEmail("");
        setPassword("");
        setAgreeTerms(false);
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <LeftPanel>
          <BackButton onClick={() => navigate('/booking')}>
            <FaArrowLeft /> Back to Home
          </BackButton>
          
          <LogoContainer>
            <FaCar />
          </LogoContainer>
          
          <BrandTitle>AutoCare Pro</BrandTitle>
          <BrandSubtitle>
            Plan your vehicle service and control your car maintenance online
          </BrandSubtitle>
          
          <IllustrationContainer>
            🚀
          </IllustrationContainer>
          
          <FeatureList>
            <FeatureItem>
              <FaCheckCircle /> Easy Online Booking
            </FeatureItem>
            <FeatureItem>
              <FaCheckCircle /> Track Service History
            </FeatureItem>
          </FeatureList>
        </LeftPanel>
        
        <RightPanel>
          <TabContainer>
            <Tab 
              $active={action === "Sign In"}
              onClick={() => {
                setAction("Sign In");
                setEmailError("");
              }}
            >
              Sign In
            </Tab>
            <Tab 
              $active={action === "Sign Up"}
              onClick={() => {
                setAction("Sign Up");
                setEmailError("");
              }}
            >
              Sign Up
            </Tab>
          </TabContainer>
          
          <FormContainer>
            {action === "Sign In" ? (
              <>
                <FormTitle>Welcome Back</FormTitle>
                <FormSubtitle>Sign in to continue to AutoCare Pro</FormSubtitle>
                
                <form onSubmit={handleLogin}>
                  <InputGroup>
                    <Label>EMAIL</Label>
                    <InputWrapper>
                      <InputIcon><FaEnvelope /></InputIcon>
                      <Input
                        type="email"
                        placeholder="Your e-mail goes here"
                        value={email}
                        onChange={handleEmailChange}
                        $error={emailError}
                      />
                    </InputWrapper>
                    {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>PASSWORD</Label>
                    <InputWrapper>
                      <InputIcon><FaLock /></InputIcon>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </EyeIcon>
                    </InputWrapper>
                  </InputGroup>
                  
                  <RememberRow>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </CheckboxLabel>
                    <ForgotLink>Forgot Password?</ForgotLink>
                  </RememberRow>
                  
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </SubmitButton>
                  
                  <BottomText>
                    Don't have an account?
                    <a onClick={() => setAction("Sign Up")}>Sign Up</a>
                  </BottomText>
                </form>
              </>
            ) : (
              <>
                <FormTitle>Create Account</FormTitle>
                <FormSubtitle>Join AutoCare Pro today</FormSubtitle>
                
                <form onSubmit={handleSignup}>
                  <InputGroup>
                    <Label>USERNAME</Label>
                    <InputWrapper>
                      <InputIcon><FaUser /></InputIcon>
                      <Input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </InputWrapper>
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>EMAIL</Label>
                    <InputWrapper>
                      <InputIcon><FaEnvelope /></InputIcon>
                      <Input
                        type="email"
                        placeholder="Your e-mail goes here"
                        value={email}
                        onChange={handleEmailChange}
                        $error={emailError}
                      />
                    </InputWrapper>
                    {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>PASSWORD</Label>
                    <InputWrapper>
                      <InputIcon><FaLock /></InputIcon>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </EyeIcon>
                    </InputWrapper>
                  </InputGroup>
                  
                  <TermsCheckbox>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>
                      I AGREE ALL STATEMENTS IN <a href="#">TERMS OF SERVICE</a>
                    </span>
                  </TermsCheckbox>
                  
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                  </SubmitButton>
                  
                  <BottomText>
                    I'm already member
                    <a onClick={() => setAction("Sign In")}>Sign In</a>
                  </BottomText>
                </form>
              </>
            )}
          </FormContainer>
        </RightPanel>
      </Container>
    </PageWrapper>
  );
};

export default LoginSignup;