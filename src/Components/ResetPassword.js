import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { KeyRound, Send, CheckCircle2, AlertCircle } from "lucide-react";

const Container = styled.div`
  max-width: 440px;
  margin: 40px auto;
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
`;

const TitleGroup = styled.div`
  margin-bottom: 20px;
  text-align: center;

  h2 {
    font-size: 1.25rem;
    color: #0f172a;
    font-weight: 700;
    margin: 8px 0 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  p {
    font-size: 0.82rem;
    color: #64748b;
    margin: 0;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #334155;
  }

  input {
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    transition: border 0.15s;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #4B9EB0;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.15s;

  &:hover {
    background: #3c8697;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AlertBanner = styled.div`
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.type === 'success' ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#047857' : '#dc2626'};
  border: 1px solid ${props => props.type === 'success' ? '#a7f3d0' : '#fecaca'};
`;

export default function FranchisePasswordReset() {
  const [franchiseId, setFranchiseId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!franchiseId.trim()) {
      setStatus({ type: 'error', message: "Please enter Franchise ID" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const resp = await axios.post("http://127.0.0.1:8190/_b_a_c_k_e_n_d/franchiseapp/request-password-reset/", {
        franchise_id: franchiseId.trim(),
      });

      if (resp.data.status === "ok") {
        setStatus({ type: 'success', message: `Reset link sent to ${resp.data.email}` });
      } else {
        setStatus({ type: 'error', message: "Unexpected response from server." });
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to send reset link";
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <TitleGroup>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
          <KeyRound size={20} />
        </div>
        <h2>Franchise Password Reset</h2>
        <p>Enter your registered Franchise ID to receive a secure password reset link</p>
      </TitleGroup>

      <form onSubmit={handleRequestReset}>
        <FormGroup>
          <label>Franchise ID *</label>
          <input
            value={franchiseId}
            onChange={(e) => setFranchiseId(e.target.value)}
            placeholder="e.g. SHF004"
            required
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          <Send size={14} /> {loading ? "Sending link..." : "Send Reset Link"}
        </Button>
      </form>

      {status && (
        <AlertBanner type={status.type}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{status.message}</span>
        </AlertBanner>
      )}
    </Container>
  );
}