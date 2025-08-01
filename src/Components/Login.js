import React, { useState } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './images/logo.png';

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Pacifico&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: white;
    color: white;
  }

  button {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
    color: white;
    font-family: 'Pacifico', cursive;
    border: none;
    border-radius: 15px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
    margin-top: 20px;
  }

  button:hover {
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158));
  }

  label {
    display: block;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
    font-size: 0.95rem;
    text-transform: capitalize;
  }

  h3 {
    font-family: 'Pacifico', cursive;
    color: white;
    font-size: 30px;
    margin: 0;
    text-align: center;
  }

  h4 {
    display: block;
    color: #4B9EB0;
    margin-bottom: 8px;
    font-size: 0.95rem;
    font-family: 'Pacifico', cursive;
  }

  h5 {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
    font-family: 'Pacifico', cursive;
    margin: 30px 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #ecf0f1;
    display: flex;
    align-items: center;
    position: relative;
  }

  table {
    background-color: white;
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  th {
    color: #4B9EB0;
    font-weight: bold;
    padding: 12px 16px;
    text-align: left;
    background-color: #f0f8fa;
  }

  td {
    color: black;
    padding: 12px 16px;
    border-top: 1px solid #ddd;
  }

  strong {
    color: black;
  }

  /* Custom Toastify Styles */
  .Toastify__toast-container {
    font-family: 'Roboto', sans-serif;
  }

  .Toastify__toast--success {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  }

  .Toastify__toast--error {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
  }

  .Toastify__toast--info {
    background: linear-gradient(135deg, #3498db, #2980b9);
  }

  .Toastify__progress-bar--success {
    background: rgba(255, 255, 255, 0.7);
  }

  .Toastify__progress-bar--error {
    background: rgba(255, 255, 255, 0.7);
  }
`;

// Breakpoints for responsive design
const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
};

const media = {
  xs: (...args) => css`@media (max-width: ${breakpoints.xs}) { ${css(...args)} }`,
  sm: (...args) => css`@media (max-width: ${breakpoints.sm}) { ${css(...args)} }`,
  md: (...args) => css`@media (max-width: ${breakpoints.md}) { ${css(...args)} }`,
  lg: (...args) => css`@media (max-width: ${breakpoints.lg}) { ${css(...args)} }`,
  xl: (...args) => css`@media (max-width: ${breakpoints.xl}) { ${css(...args)} }`,
  minSm: (...args) => css`@media (min-width: ${breakpoints.sm}) { ${css(...args)} }`,
  minMd: (...args) => css`@media (min-width: ${breakpoints.md}) { ${css(...args)} }`,
  minLg: (...args) => css`@media (min-width: ${breakpoints.lg}) { ${css(...args)} }`,
  landscape: (...args) => css`@media (orientation: landscape) and (max-height: 600px) { ${css(...args)} }`
};

// Keyframe animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(111, 177, 196, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(111, 177, 196, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(111, 177, 196, 0);
  }
`;

const slideInMobile = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #6FB1C4, #4B9EB0, #5BC0DE, #6FB1C4);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow-x: hidden;

  ${media.sm`
    padding: 16px;
    min-height: 100vh;
    min-height: 100svh;
  `}

  ${media.xs`
    padding: 12px;
  `}

  ${media.landscape`
    padding: 12px;
    min-height: 100vh;
  `}
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6FB1C4, #4B9EB0);
  }

  ${media.md`
    max-width: 380px;
    padding: 40px 32px;
    border-radius: 20px;
  `}

  ${media.sm`
    max-width: 100%;
    padding: 32px 24px;
    border-radius: 16px;
    animation: ${slideInMobile} 0.6s ease-out;
    margin: auto;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  `}

  ${media.xs`
    padding: 24px 20px;
    border-radius: 12px;
  `}

  ${media.landscape`
    max-width: 380px;
    padding: 24px 32px;
  `}
`;

// Updated Logo component to use actual image
const LogoContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 32px;
  animation: ${float} 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(111, 177, 196, 0.3);

  ${media.sm`
    width: 70px;
    height: 70px;
    border-radius: 14px;
    margin-bottom: 24px;
  `}

  ${media.xs`
    width: 60px;
    height: 60px;
    border-radius: 12px;
    margin-bottom: 20px;
  `}

  ${media.landscape`
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
  `}
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  padding: 8px;
  border-radius: inherit;
`;

const Title = styled.h3`
  text-align: center;
  margin: 0 0 8px;
  font-size: clamp(24px, 5vw, 30px);
  font-weight: 700;
  font-family: 'Pacifico', cursive;
  color: #4B9EB0;
  line-height: 1.2;

  ${media.sm`
    font-size: clamp(22px, 6vw, 28px);
  `}

  ${media.xs`
    font-size: clamp(20px, 7vw, 26px);
  `}

  ${media.landscape`
    font-size: 24px;
    margin-bottom: 4px;
  `}
`;

const Subtitle = styled.h4`
  text-align: center;
  margin: 0 0 40px;
  color: #4B9EB0;
  font-size: clamp(14px, 3.5vw, 16px);
  line-height: 1.4;
  font-family: 'Pacifico', cursive;

  ${media.sm`
    margin-bottom: 32px;
  `}

  ${media.xs`
    margin-bottom: 24px;
  `}

  ${media.landscape`
    margin-bottom: 24px;
    font-size: 14px;
  `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${media.sm`
    gap: 20px;
  `}

  ${media.xs`
    gap: 18px;
  `}

  ${media.landscape`
    gap: 16px;
  `}
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 600;
  color: #4B9EB0;
  transition: color 0.3s ease;
  text-transform: capitalize;

  ${media.sm`
    margin-bottom: 6px;
  `}

  ${media.landscape`
    margin-bottom: 4px;
    font-size: 13px;
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 15px;
  font-size: clamp(14px, 3.5vw, 16px);
  background: white;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  color: #333;
  
  &:focus {
    border-color: #6FB1C4;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(111, 177, 196, 0.15);
  }
  
  &:focus + ${InputLabel} {
    color: #6FB1C4;
  }
  
  &::placeholder {
    color: #9ca3af;
  }

  ${media.sm`
    padding: 14px 18px;
    border-radius: 12px;
    
    &:focus {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(111, 177, 196, 0.12);
    }
  `}

  ${media.xs`
    padding: 12px 16px;
    border-radius: 10px;
  `}

  ${media.landscape`
    padding: 12px 16px;
    
    &:focus {
      transform: translateY(-1px);
    }
  `}

  @media (max-width: 768px) {
    font-size: 16px !important;
    zoom: 1;
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 56px;

  ${media.sm`
    padding-right: 50px;
  `}

  ${media.xs`
    padding-right: 46px;
  `}
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #6b7280;
  transition: all 0.3s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  margin-top: 0;
  
  &:hover {
    color: #6FB1C4;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  ${media.sm`
    right: 14px;
    width: 20px;
    height: 20px;
    font-size: 16px;
  `}

  ${media.xs`
    right: 12px;
    width: 18px;
    height: 18px;
    font-size: 14px;
  `}
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 8px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  min-height: 48px;
  font-family: 'Pacifico', cursive;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(111, 177, 196, 0.4);
    animation: ${pulse} 1.5s infinite;
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158));
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }

  ${media.sm`
    padding: 14px;
    border-radius: 12px;
    min-height: 44px;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(111, 177, 196, 0.35);
    }
  `}

  ${media.xs`
    padding: 12px;
    border-radius: 10px;
    min-height: 42px;
  `}

  ${media.landscape`
    padding: 12px;
    min-height: 40px;
  `}

  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
      animation: none;
    }
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 4px 12px rgba(111, 177, 196, 0.3);
    }
  }
`;

const ForgotLink = styled.a`
  display: block;
  text-align: center;
  color: #6FB1C4;
  text-decoration: none;
  font-size: clamp(13px, 3vw, 14px);
  font-weight: 500;
  margin-top: 20px;
  transition: color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  padding: 8px;
  
  &:hover {
    color: #4B9EB0;
    text-decoration: underline;
  }

  &:active {
    opacity: 0.7;
  }

  ${media.sm`
    margin-top: 16px;
    padding: 6px;
  `}

  ${media.xs`
    margin-top: 12px;
    padding: 4px;
  `}

  ${media.landscape`
    margin-top: 12px;
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  ${media.sm`
    width: 14px;
    height: 14px;
    margin-right: 6px;
  `}
`;

const Login = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${franchiseurl}login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          franchise_id: formData.id,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful! Welcome back.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log("Franchise Info:", data.details);
        localStorage.setItem("franchise_id", data.franchise_id);
        localStorage.setItem("franchise_name", data.name);
        
        // Delay navigation to show toast
        setTimeout(() => {
          navigate("/PatientRegisterForm");
        }, 1500);
      } else {
        toast.error(data.message || "Account is inactive. Please contact admin.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong! Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <LoginCard>
          <LogoContainer>
            <LogoImage 
              src={logo} 
              alt="Company Logo" 
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '🔐';
                e.target.parentNode.style.fontSize = '24px';
                e.target.parentNode.style.background = 'linear-gradient(135deg, #6FB1C4, #4B9EB0)';
              }}
            />
          </LogoContainer>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputLabel htmlFor="id">User ID</InputLabel>
              <Input
                id="id"
                name="id"
                type="text"
                placeholder="Enter your user ID"
                value={formData.id}
                onChange={handleChange}
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </InputGroup>
            
            <InputGroup>
              <InputLabel htmlFor="password">Password</InputLabel>
              <PasswordInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <PasswordToggle
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </PasswordToggle>
            </InputGroup>
            
            <LoginButton type="submit" disabled={isLoading}>
              {isLoading && <LoadingSpinner />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </LoginButton>
          </Form>
          
          <ForgotLink href="#forgot">
            Forgot your password?
          </ForgotLink>
        </LoginCard>
      </Container>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Login;
