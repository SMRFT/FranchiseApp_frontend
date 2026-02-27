import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Calendar, DollarSign, TrendingUp, CreditCard, Activity, Download } from 'lucide-react';

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
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  min-height: 10vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
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
  font-size: 1.75rem;
  color: #0f172a;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.025em;

  &::before {
    content: '📊';
    font-size: 1.5rem;
  }
`;

const SubTitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
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

const TableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;

  th {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-size: 0.95rem;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background: #f8fafc;
  }
  
  tfoot {
    background: #f1f5f9;
    font-weight: 700;
    
    td {
        border-top: 2px solid #e2e8f0;
        color: #0f172a;
    }
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: ${props => props.gradient || 'linear-gradient(135deg, #e0f2fe, #f0f9ff)'};
    border-radius: 0 0 0 100%;
    opacity: 0.2;
    pointer-events: none;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bg || '#f1f5f9'};
  color: ${props => props.color || '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`;

const SubValue = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const CashTally = () => {
  const [data, setData] = useState({ daily_stats: [], total_stats: {} });
  const [loading, setLoading] = useState(true);

  // Initialize dates: From = 1st of current month, To = Today
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDay.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const franchiseId = localStorage.getItem('franchise_id');

  useEffect(() => {
    fetchCashTally();
  }, []); // Initial load

  const fetchCashTally = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${franchiseurl}cash-tally/?franchise_id=${franchiseId}&from_date=${fromDate}&to_date=${toDate}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching cash tally:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportDaily = () => {
    // Export logic might need adjustment for range, but keeping simple for now
    const url = `${franchiseurl}cash-tally/export-daily/?franchise_id=${franchiseId}&date=${toDate}`;
    window.open(url, '_blank');
  };

  const handleExportMonthly = () => {
    // Export logic might need adjustment for range
    const url = `${franchiseurl}cash-tally/export-monthly/?franchise_id=${franchiseId}&date=${toDate}`;
    window.open(url, '_blank');
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Container>
      <Header>
        <TitleGroup>
          <Title>Cash Tally Report</Title>
          <SubTitle>Detailed breakdown of collections by date range</SubTitle>
        </TitleGroup>

        <ButtonGroup>
          <ExportButton onClick={handleExportDaily}>
            <Download size={18} />
            Export Daily (End Date)
          </ExportButton>
          <ExportButton onClick={handleExportMonthly}>
            <Download size={18} />
            Export Monthly (End Date)
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

          <SearchButton onClick={fetchCashTally}>
            Search
          </SearchButton>
        </ButtonGroup>
      </Header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading report...</div>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Billing</th>
                <th>Franchise Share (50%)</th>
                <th>Franchiser Share (50%)</th>
                <th>New Collections</th>
                <th>Due Collections</th>
                <th>Total Collection</th>
              </tr>
            </thead>
            <tbody>
              {data.daily_stats && data.daily_stats.length > 0 ? (
                data.daily_stats.map((day, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>
                        {new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td>{formatCurrency(day.total_billing_amount)}</td>
                    <td style={{ color: '#6366f1' }}>{formatCurrency(day.franchise_share)}</td>
                    <td style={{ color: '#ec4899' }}>{formatCurrency(day.franchiser_share)}</td>
                    <td style={{ color: '#10b981' }}>{formatCurrency(day.collected_from_new_registrations)}</td>
                    <td style={{ color: '#f59e0b' }}>{formatCurrency(day.collected_from_past_dues)}</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{formatCurrency(day.total_collection_today)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No data found for the selected range</td>
                </tr>
              )}
            </tbody>
            {data.daily_stats && data.daily_stats.length > 0 && (
              <tfoot>
                <tr>
                  <td>TOTAL</td>
                  <td>{formatCurrency(data.total_stats?.total_billing_amount)}</td>
                  <td>{formatCurrency(data.total_stats?.franchise_share)}</td>
                  <td>{formatCurrency(data.total_stats?.franchiser_share)}</td>
                  <td>{formatCurrency(data.total_stats?.collected_from_new_registrations)}</td>
                  <td>{formatCurrency(data.total_stats?.collected_from_past_dues)}</td>
                  <td>{formatCurrency(data.total_stats?.total_collection_today)}</td>
                </tr>
              </tfoot>
            )}
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

export default CashTally;
