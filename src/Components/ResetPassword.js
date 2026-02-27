// Frontend (React) - using axios
import axios from "axios";
import { useState } from "react";

function FranchisePasswordReset() {
  const [franchiseId, setFranchiseId] = useState("");
  const [status, setStatus] = useState("");

  const handleRequestReset = async () => {
    if (!franchiseId.trim()) {
      setStatus("Please enter Franchise ID");
      return;
    }

    try {
      setStatus("Sending reset link...");
      const resp = await axios.post("http://127.0.0.1:8190/_b_a_c_k_e_n_d/franchiseapp/request-password-reset/", {
        franchise_id: franchiseId.trim(),
      });

      if (resp.data.status === "ok") {
        setStatus(`Reset link sent to ${resp.data.email}`);
      } else {
        setStatus("Unexpected response from server.");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to send reset link";
      setStatus(msg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      <h3>Franchise Password Reset</h3>
      <label style={{ display: "block", marginBottom: 4 }}>Franchise ID</label>
      <input
        value={franchiseId}
        onChange={(e) => setFranchiseId(e.target.value)}
        placeholder="SHF001"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <button onClick={handleRequestReset}>Send Reset Link</button>
      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
}

export default FranchisePasswordReset;
