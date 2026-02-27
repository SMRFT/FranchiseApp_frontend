import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Users, Calendar, DollarSign, Activity, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: ${fadeIn} 0.6s ease-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #0f172a;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.03em;

  svg {
    color: #3b82f6;
  }
`;

const SubTitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
`;

const MonthPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 12px;
`;

const PickerButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #fff;
    color: #3b82f6;
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
`;

const CurrentMonth = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-size: 1.1rem;
  min-width: 140px;
  text-align: center;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: ${fadeIn} 1s ease-out;
  overflow-x: auto;
`;

const TableTitle = styled.h2`
  font-size: 1.5rem;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    color: #cbd5e1;
    margin-bottom: 0.5rem;
  }
`;

const ReferralReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const franchiseId = localStorage.getItem('franchise_id');

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const response = await axios.get(`${franchiseurl}referral-report/?franchise_id=${franchiseId}&month=${month}&year=${year}`);
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching referral report:", error);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [currentDate, franchiseurl, franchiseId]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calculate totals
  const totalPatients = reportData.reduce((sum, item) => sum + item.patients, 0);
  const totalAmount = reportData.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <Container>
      <Header>
        <TitleGroup>
          <Title>
            <Stethoscope size={32} />
            Referral Doctor Report
          </Title>
          <SubTitle>Track performance by referring doctors</SubTitle>
        </TitleGroup>

        <MonthPicker>
          <PickerButton onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </PickerButton>
          <CurrentMonth>{monthName}</CurrentMonth>
          <PickerButton onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </PickerButton>
        </MonthPicker>
      </Header>

      <TableContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <TableTitle>
            <Users size={24} color="#64748b" />
            Doctor Performance
          </TableTitle>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Patients</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{totalPatients}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Revenue</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <EmptyState>Loading report...</EmptyState>
        ) : reportData.length === 0 ? (
          <EmptyState>
            <Stethoscope size={48} />
            <h3>No records found</h3>
            <p>No referral data available for this month.</p>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Doctor Name</Th>
                <Th style={{ textAlign: 'center' }}>Patients Referred</Th>
                <Th style={{ textAlign: 'right' }}>Total Revenue Generated</Th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx}>
                  <Td style={{ fontWeight: 500 }}>{row.doctor}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {row.patients}
                    </span>
                  </Td>
                  <Td style={{ textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                    ₹{parseFloat(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
};

export default ReferralReport;
