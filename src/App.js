import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ResponsiveSidebar from './Components/sidebar';
import PatientRegisterForm from './Components/PatientRegisterForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientEditForm from './Components/PatientEditForm';
import PatientList from './Components/PatientList';
import Login from './Components/Login';
import PaymentGateway from './Components/PaymentGateway';
import SampleCollection from './Components/SampleCollection';
import SampleTransfer from './Components/SampleTransfer';
import BatchGeneration from './Components/BatchGeneration';
import ReportGeneration from './Components/ReportGeneration';
import ResetPassword from './Components/ResetPassword';
import DuePatients from './Components/DuePatients';
import Accounts from './Components/Accounts';
import ReferralReport from './Components/ReferralReport';
import CashTally from './Components/CashTally';



function AppLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <ResponsiveSidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/PatientRegisterForm" element={<PatientRegisterForm />} />
          <Route path="/PatientList" element={<PatientList />} />
          <Route path="/PatientEditForm" element={<PatientEditForm />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/SampleCollection" element={<SampleCollection />} />
          <Route path="/SampleTransfer" element={<SampleTransfer />} />
          <Route path="/BatchGeneration" element={<BatchGeneration />} />
          <Route path="/ReportGeneration" element={<ReportGeneration />} />
          <Route path="/DuePatients" element={<DuePatients />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/Accounts" element={<Accounts />} />
          <Route path="/ReferralReport" element={<ReferralReport />} />
          <Route path="/CashTally" element={<CashTally />} />

        </Routes>
      </div>
    </div>
  );
}

// Wrapper to switch layout based on route
function MainApp() {
  const location = useLocation();

  const isLoginRoute = location.pathname === '/' || location.pathname === '/franchise';

  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* ✅ Default route shows Login */}
      {!isLoginRoute && <Route path="*" element={<AppLayout />} />}
    </Routes>
  );
}

function App() {
  return (
    <Router >
      <MainApp />
    </Router>
  );
}

export default App;