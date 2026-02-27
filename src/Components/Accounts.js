import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Download } from 'lucide-react';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const DateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const DateInput = styled.input`
  border: none;
  font-size: 1rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  cursor: pointer;
`;

const ExportButton = styled.button`
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const SearchButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const StatsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
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

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => props.status === 'Billed' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'Billed' ? '#166534' : '#991b1b'};
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

const Accounts = () => {
  // Initialize dates: From = 1st of current month, To = Today
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDay.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);

  const [detailsData, setDetailsData] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Calculated Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    franchiseShare: 0,
    patientCount: 0
  });

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const franchiseId = localStorage.getItem('franchise_id');

  // Fetch details when date changes or on mount
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`${franchiseurl}monthly-billing-details/?franchise_id=${franchiseId}&from_date=${fromDate}&to_date=${toDate}`);
      const data = response.data;
      setDetailsData(data);

      // Calculate stats from data
      const totalRev = data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const count = data.length;
      const share = totalRev / 2; // Assuming 50% share

      setStats({
        totalRevenue: totalRev,
        franchiseShare: share,
        patientCount: count
      });

    } catch (error) {
      console.error("Error fetching billing details:", error);
      setDetailsData([]);
      setStats({ totalRevenue: 0, franchiseShare: 0, patientCount: 0 });
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const url = `${franchiseurl}accounts/export-csv/?franchise_id=${franchiseId}&from_date=${fromDate}&to_date=${toDate}`;
    window.open(url, '_blank');
  };

  return (
    <Container>
      <Header>
        <TitleGroup>
          <Title>
            <Activity size={32} />
            Accounts Overview
          </Title>
          <SubTitle>Track your performance and revenue</SubTitle>
        </TitleGroup>

        <ButtonGroup>
          <ExportButton onClick={handleExportCSV}>
            <Download size={18} />
            Export CSV
          </ExportButton>

          <DateControl>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>From:</span>
            <DateInput
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </DateControl>

          <DateControl>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>To:</span>
            <DateInput
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </DateControl>

          <SearchButton onClick={fetchDetails}>
            Search
          </SearchButton>
        </ButtonGroup>
      </Header>

      <StatsGrid>
        <StatsCard>
          <StatLabel>
            <DollarSign size={18} color="#3b82f6" />
            Total Revenue
          </StatLabel>
          <StatValue>
            ₹{stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </StatValue>
        </StatsCard>

        <StatsCard>
          <StatLabel>
            <TrendingUp size={18} color="#10b981" />
            Franchise Share
          </StatLabel>
          <StatValue style={{ color: '#059669' }}>
            ₹{stats.franchiseShare.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </StatValue>
        </StatsCard>

        <StatsCard>
          <StatLabel>
            <Users size={18} color="#f59e0b" />
            Patients Registered
          </StatLabel>
          <StatValue style={{ color: '#d97706' }}>
            {stats.patientCount}
          </StatValue>
        </StatsCard>
      </StatsGrid>

      <TableContainer>
        <TableTitle>
          <Calendar size={24} color="#64748b" />
          Billing Details
        </TableTitle>

        {detailsLoading ? (
          <EmptyState>Loading details...</EmptyState>
        ) : detailsData.length === 0 ? (
          <EmptyState>
            <Calendar size={48} />
            <h3>No records found</h3>
            <p>No billing records found for this period.</p>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Patient Name</Th>
                <Th>Barcode</Th>
                <Th>Status</Th>
                <Th style={{ textAlign: 'right' }}>Amount</Th>
              </tr>
            </thead>
            <tbody>
              {detailsData.map((row, idx) => (
                <tr key={idx}>
                  <Td>{row.date}</Td>
                  <Td style={{ fontWeight: 500 }}>{row.patient_name}</Td>
                  <Td style={{ fontFamily: 'monospace' }}>{row.barcode}</Td>
                  <Td><StatusBadge status={row.status}>{row.status}</StatusBadge></Td>
                  <Td style={{ textAlign: 'right', fontWeight: 600 }}>
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

export default Accounts;
