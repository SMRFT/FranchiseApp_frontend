import React, { useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import logo from './images/logo.png'; // Update with correct path

// ---- GLOBAL STYLES ----

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Inter:400,700&display=swap');
  body {
    font-family: 'Inter', sans-serif;
    background: #f8fafc;
  }
`;

// ---- ANIMATIONS ----
const float = keyframes`0% {transform:translateY(0);} 50% {transform:translateY(-6px);} 100% {transform:translateY(0);}`;
const fadeIn = keyframes`from {opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);}`;
const gradientBg = keyframes`0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}`;

// ---- STYLED COMPONENTS ----
const PageContainer = styled.div`
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(-45deg,#e0f2f1,#eefcfc,#6FB1C4,#4B9EB0);
  background-size:400% 400%;animation:${gradientBg} 15s ease infinite;
  position:relative;overflow:hidden;padding:20px;
  &::before, &::after {
    content:'';position:absolute;border-radius:50%;filter:blur(60px);z-index:0;
  }
  &::before {width:400px;height:400px;background:rgba(111,177,196,0.18);top:-100px;left:-100px;}
  &::after {width:300px;height:300px;background:rgba(75,158,176,0.16);bottom:-60px;right:-50px;}
`;
const Card = styled.div`
  background:rgba(255,255,255,0.92);backdrop-filter:blur(20px);
  border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.09);
  max-width:400px;width:100%;padding:3rem;animation:${fadeIn} .7s;
  display:flex;flex-direction:column;align-items:center;z-index:1;
`;
const LogoWrapper = styled.div`
  width:80px;height:80px;background:linear-gradient(135deg,#fff,#f0f9ff);
  border-radius:20px;display:flex;align-items:center;justify-content:center;
  margin-bottom:1.5rem;box-shadow:0 10px 25px rgba(75,158,176,0.12);
  animation:${float} 3s ease-in-out infinite;
  img{width:60%;height:auto;object-fit:contain;}
`;
const HeaderGroup = styled.div`
  text-align:center;margin-bottom:2rem;
`;
const WelcomeText = styled.h1`
  font-weight:800;font-size:1.7rem;color:#2d3748;margin-bottom:.5rem;letter-spacing:-0.5px;
`;
const SubText = styled.p`
  color:#64748b;font-size:.96rem;
`;
const Form = styled.form`
  display:flex;flex-direction:column;gap:1.2rem;width:100%;
`;
const InputGroup = styled.div`
  position:relative;width:100%;
`;
const Label = styled.label`
  display:block;font-size:.88rem;font-weight:600;color:#475569;margin-bottom:.5rem;margin-left:.2rem;
`;
const Input = styled.input`
  width:100%;padding:.85rem 1rem;border-radius:12px;border:2px solid #e2e8f0;background:#f8fafc;color:#1e293b;font-size:.97rem;
  &:focus {outline:none;background: #fff;border-color:#6FB1C4;}
  &::placeholder {color:#94a3b8;}
`;
const PasswordToggle = styled.button`
  position:absolute;right:12px;top:36px;background:none;border:none;cursor:pointer;color:#94a3b8;
  padding:4px;display:flex;align-items:center;transition:color .2s;
  &:hover{color:#64748b;}
`;
const SubmitButton = styled.button`
  width:100%;padding:.87rem;margin-top:.5rem;
  background:linear-gradient(135deg,#6FB1C4 0%,#4B9EB0 100%);
  color:#fff;border:none;border-radius:12px;font-size:1.01rem;font-weight:600;cursor:pointer;
  transition:.3s;box-shadow:0 4px 14px rgba(75,158,176,0.18);gap:8px;
  display:flex;align-items:center;justify-content:center;
  &:hover:not(:disabled){background:linear-gradient(135deg,#66a9bc 0%,#428f9f 100%);}
  &:disabled{opacity:.7;cursor:not-allowed;}
`;
const FooterLink = styled.div`
  margin-top:1.5rem;text-align:center;
  a{color:#4B9EB0;font-size:.91rem;font-weight:600;text-decoration:none;transition:color .18s;padding:3px;}
   a:hover{color:#2e7a8a;text-decoration:underline;}
`;
const Spinner = styled.div`
  width:20px;height:20px;border:2px solid rgba(255,255,255,0.28);border-radius:50%;
  border-top-color:white;animation:spin .8s linear infinite;@keyframes spin{to{transform:rotate(360deg);}}
`;
// ---- MODAL STYLE ----
const ModalBg = styled.div`
  position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(60,90,130,0.09);
  display:flex;align-items:center;justify-content:center;z-index:77;
`;
const ModalCard = styled(Card)`
  max-width:350px;padding:2rem;animation:${fadeIn} .6s;
`;

// ---- PASSWORD RESET COMPONENT ----
function FranchisePasswordReset({ onClose }) {
  const [franchiseId, setFranchiseId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!franchiseId.trim()) {
      setStatus("Please enter Franchise ID");
      return;
    }
    setLoading(true);
    setStatus("Sending reset link...");
    try {
      const resp = await axios.post(
        `${franchiseurl}request-password-reset/`,
        { franchise_id: franchiseId.trim() }
      );
      if (resp.data.status === "ok") {
        setStatus(`Reset link sent to ${resp.data.email}`);
      } else {
        setStatus("Unexpected response from server.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send reset link";
      setStatus(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBg>
      <ModalCard>
        <HeaderGroup>
          <WelcomeText>Reset Password</WelcomeText>
          <SubText>Enter your franchise ID to receive a reset link.</SubText>
        </HeaderGroup>
        <form onSubmit={handleRequestReset} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Label htmlFor="franchiseId">Franchise ID</Label>
          <Input
            id="franchiseId"
            type="text"
            value={franchiseId}
            onChange={e => setFranchiseId(e.target.value)}
            placeholder="SHF001"
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading && <Spinner />} Send Reset Link
          </SubmitButton>
        </form>
        {status && <SubText style={{ marginTop: 10 }}>{status}</SubText>}
        <FooterLink>
          <a href="#close" onClick={e => { e.preventDefault(); onClose(); }}>Back to Sign In</a>
        </FooterLink>
      </ModalCard>
    </ModalBg>
  );
}

// ---- MAIN LOGIN COMPONENT ----
const Login = () => {
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        toast.success("Welcome back! Redirecting...", {
          position: "top-center", autoClose: 1400, hideProgressBar: true,
          style: { background: '#4B9EB0', color: 'white' }
        });
        localStorage.setItem("franchise_id", data.franchise_id);
        localStorage.setItem("franchise_name", data.name);
        setTimeout(() => { navigate("/PatientRegisterForm"); }, 1400);
      } else {
        toast.error(data.message || "Invalid credentials", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Connection failed. Please try again.", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Card>
          <LogoWrapper>
            {logo ? (
              <img src={logo} alt="Logo" onError={e => e.target.style.display = 'none'} />
            ) : (
              <span style={{ fontSize: '2rem' }}>🔐</span>
            )}
          </LogoWrapper>
          <HeaderGroup>
            <WelcomeText>Welcome Back</WelcomeText>
            <SubText>Please enter your details to sign in.</SubText>
          </HeaderGroup>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="id">User ID</Label>
              <Input
                id="id"
                name="id"
                type="text"
                placeholder="Enter your franchise ID"
                value={formData.id}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </PasswordToggle>
            </InputGroup>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (<><Spinner /> Signing In...</>) : 'Sign In'}
            </SubmitButton>
          </Form>
          <FooterLink>
            <a
              href="#forgot-password"
              onClick={e => { e.preventDefault(); setShowResetModal(true); }}>
              Forgot your password?
            </a>
          </FooterLink>
        </Card>
        {showResetModal && (
          <FranchisePasswordReset onClose={() => setShowResetModal(false)} />
        )}
      </PageContainer>
      <ToastContainer />
    </>
  );
};

export default Login;
