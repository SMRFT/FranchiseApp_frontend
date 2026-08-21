import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { 
  Calendar, TrendingUp, Download, RefreshCw, 
  Receipt, CheckCircle2, PieChart, Layers, Inbox
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const TitleGroup = styled.div`
  h1 {
    font-size: 1.3rem;
    color: #0f172a;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.02em;
  }
  p {
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 500;
    margin: 2px 0 0 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;

  .stat-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #64748b;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${props => props.valueColor || '#0f172a'};
    letter-spacing: -0.02em;
    line-height: 1.2;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat-subtext {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .stat-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.iconBg || '#f1f5f9'};
    color: ${props => props.iconColor || '#475569'};
  }
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const PresetGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const PresetButton = styled.button`
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.active ? '#4B9EB0' : '#e2e8f0'};
  background: ${props => props.active ? '#4B9EB0' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#475569'};
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.active ? '#3d8697' : '#f8fafc'};
  }
`;

const DateRangeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;

  .date-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #64748b;
  }

  input[type="date"] {
    padding: 5px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 0.8rem;
    color: #1e293b;
    outline: none;
    background: white;
    font-family: inherit;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
  border: 1px solid transparent;

  ${props => props.variant === 'primary' && `
    background: #4B9EB0;
    color: white;
    border-color: #4B9EB0;
    &:hover { background: #3c8697; }
  `}

  ${props => props.variant === 'outline' && `
    background: white;
    border-color: #4B9EB0;
    color: #4B9EB0;
    &:hover { background: #f0fdfa; }
  `}

  ${props => props.variant === 'secondary' && `
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #334155;
    &:hover { background: #e2e8f0; }
  `}
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 270px);
  min-height: 180px;

  @media (max-width: 900px) {
    max-height: none;
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  position: relative;

  /* Sleek Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
  min-width: 860px;

  th {
    position: sticky;
    top: 0;
    z-index: 5;
    background: #f8fafc;
    padding: 10px 14px;
    font-weight: 700;
    color: #475569;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  td {
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
    white-space: nowrap;
  }

  tr:hover td {
    background-color: #f8fafc;
  }

  /* Alignment utilities */
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }

  tfoot td {
    position: sticky;
    bottom: 0;
    z-index: 5;
    background: #f8fafc;
    font-weight: 800;
    border-top: 2px solid #cbd5e1;
    border-bottom: none;
    color: #0f172a;
    font-size: 0.88rem;
    padding: 11px 14px;
    box-shadow: 0 -2px 6px rgba(0,0,0,0.04);
  }
`;

const AmountCell = styled.span`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: ${props => props.isZero ? '500' : '600'};
  color: ${props => props.isZero ? '#94a3b8' : (props.color || '#1e293b')};
`;

const TotalCollectionPill = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: ${props => props.isZero ? '#f1f5f9' : '#ecfdf5'};
  color: ${props => props.isZero ? '#94a3b8' : '#047857'};
  border: 1px solid ${props => props.isZero ? '#e2e8f0' : '#a7f3d0'};
`;

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonthStartString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

const getDaysAgoString = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CashTally() {
  const [data, setData] = useState({ daily_stats: [], total_stats: {} });
  const [loading, setLoading] = useState(true);
  const [activePreset, setActivePreset] = useState('today');

  const [fromDate, setFromDate] = useState(getTodayString());
  const [toDate, setToDate] = useState(getTodayString());

  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
  const franchiseId = localStorage.getItem('franchise_id') || 'SHF004';

  const fetchCashTally = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${franchiseurl}cash-tally/?franchise_id=${franchiseId}&from_date=${fromDate}&to_date=${toDate}`);
      setData(res.data || { daily_stats: [], total_stats: {} });
    } catch (error) {
      console.error("Error fetching cash tally:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashTally();
  }, [fromDate, toDate]);

  const setPreset = (preset) => {
    setActivePreset(preset);
    const todayStr = getTodayString();
    if (preset === 'today') {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (preset === 'yesterday') {
      const yest = getYesterdayString();
      setFromDate(yest);
      setToDate(yest);
    } else if (preset === '7days') {
      setFromDate(getDaysAgoString(6));
      setToDate(todayStr);
    } else if (preset === 'month') {
      setFromDate(getMonthStartString());
      setToDate(todayStr);
    }
  };

  const handleExportDaily = () => {
    const url = `${franchiseurl}cash-tally/export-daily/?franchise_id=${franchiseId}&date=${toDate}`;
    window.open(url, '_blank');
  };

  const handleExportMonthly = () => {
    const url = `${franchiseurl}cash-tally/export-monthly/?franchise_id=${franchiseId}&date=${toDate}`;
    window.open(url, '_blank');
  };

  // Formats currency with INR symbol and always 2 decimal places.
  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isZeroAmount = (amount) => {
    return !amount || parseFloat(amount) === 0;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const [y, m, d] = dateStr.split('-');
      const dt = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return dt.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const totalStats = data.total_stats || {};

  // Option A: Filter only days with active billing or collections
  const activeDailyStats = (data.daily_stats || []).filter(day => {
    const bAmt = parseFloat(day.total_billing_amount || 0);
    const cAmt = parseFloat(day.total_collection_today || 0);
    return bAmt > 0 || cAmt > 0;
  });

  return (
    <Container>
      <Header>
        <TitleGroup>
          <h1><Receipt size={20} color="#4B9EB0" /> Daily Cash Tally</h1>
          <p>Breakdown of daily billing, franchise revenue shares, and cash collections</p>
        </TitleGroup>

        <HeaderActions>
          <Button variant="outline" onClick={handleExportDaily} title="Export single day report as CSV">
            <Download size={13} /> Export Daily
          </Button>
          <Button variant="outline" onClick={handleExportMonthly} title="Export full month report as CSV">
            <Download size={13} /> Export Monthly
          </Button>
        </HeaderActions>
      </Header>

      {/* Summary KPI Cards */}
      <StatsGrid>
        <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
          <div className="stat-info">
            <div className="stat-label">Gross Billed Amount</div>
            <div className="stat-value">{formatCurrency(totalStats.total_billing_amount)}</div>
            <div className="stat-subtext">Total value of billed tests</div>
          </div>
          <div className="stat-icon"><Receipt size={17} /></div>
        </StatCard>

        <StatCard iconBg="#e0e7ff" iconColor="#4338ca" valueColor="#4338ca">
          <div className="stat-info">
            <div className="stat-label">Franchise Share (50%)</div>
            <div className="stat-value">{formatCurrency(totalStats.franchise_share)}</div>
            <div className="stat-subtext">Your 50% revenue share</div>
          </div>
          <div className="stat-icon"><PieChart size={17} /></div>
        </StatCard>

        <StatCard iconBg="#fce7f3" iconColor="#be185d" valueColor="#be185d">
          <div className="stat-info">
            <div className="stat-label">Hospital Share (50%)</div>
            <div className="stat-value">{formatCurrency(totalStats.franchiser_share)}</div>
            <div className="stat-subtext">Central lab 50% share</div>
          </div>
          <div className="stat-icon"><Layers size={17} /></div>
        </StatCard>

        <StatCard iconBg="#dcfce7" iconColor="#15803d" valueColor="#15803d">
          <div className="stat-info">
            <div className="stat-label">Total Cash Collected</div>
            <div className="stat-value">{formatCurrency(totalStats.total_collection_today)}</div>
            <div className="stat-subtext">
              Receipts: {formatCurrency(totalStats.collected_from_new_registrations)} | Due: {formatCurrency(totalStats.collected_from_past_dues)}
            </div>
          </div>
          <div className="stat-icon"><CheckCircle2 size={17} /></div>
        </StatCard>
      </StatsGrid>

      {/* Filter & Date Selection Bar */}
      <FilterSection>
        <PresetGroup>
          <PresetButton active={activePreset === 'today'} onClick={() => setPreset('today')}>
            Today
          </PresetButton>
          <PresetButton active={activePreset === 'yesterday'} onClick={() => setPreset('yesterday')}>
            Yesterday
          </PresetButton>
          <PresetButton active={activePreset === '7days'} onClick={() => setPreset('7days')}>
            Last 7 Days
          </PresetButton>
          <PresetButton active={activePreset === 'month'} onClick={() => setPreset('month')}>
            This Month
          </PresetButton>
        </PresetGroup>

        <DateRangeGroup>
          <span className="date-label">From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setActivePreset('custom');
            }}
          />

          <span className="date-label">To:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setActivePreset('custom');
            }}
          />

          <Button variant="secondary" onClick={fetchCashTally} title="Refresh cash tally report">
            <RefreshCw size={13} /> Refresh
          </Button>
        </DateRangeGroup>
      </FilterSection>

      {/* Detailed Data Table with Clean Fit & Internal Scroll */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '6px' }} />
            <div style={{ fontSize: '0.85rem' }}>Loading Cash Tally report...</div>
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th className="text-left" style={{ width: '150px' }}>Billing Date</th>
                  <th className="text-right">Gross Billed Amount</th>
                  <th className="text-right">Franchise Share (50%)</th>
                  <th className="text-right">Hospital Share (50%)</th>
                  <th className="text-right">Today's Registration Receipts</th>
                  <th className="text-right">Past Due Recoveries</th>
                  <th className="text-right" style={{ width: '150px' }}>Total Cash Collected</th>
                </tr>
              </thead>
              <tbody>
                {activeDailyStats.length > 0 ? (
                  activeDailyStats.map((day, idx) => {
                    const isZeroBill = isZeroAmount(day.total_billing_amount);
                    const isZeroCol = isZeroAmount(day.total_collection_today);

                    return (
                      <tr key={idx}>
                        <td className="text-left">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} color="#64748b" />
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>
                              {formatDateDisplay(day.date)}
                            </span>
                          </div>
                        </td>

                        <td className="text-right">
                          <AmountCell isZero={isZeroBill} color="#0f172a">
                            {formatCurrency(day.total_billing_amount)}
                          </AmountCell>
                        </td>

                        <td className="text-right">
                          <AmountCell isZero={isZeroAmount(day.franchise_share)} color="#4f46e5">
                            {formatCurrency(day.franchise_share)}
                          </AmountCell>
                        </td>

                        <td className="text-right">
                          <AmountCell isZero={isZeroAmount(day.franchiser_share)} color="#db2777">
                            {formatCurrency(day.franchiser_share)}
                          </AmountCell>
                        </td>

                        <td className="text-right">
                          <AmountCell isZero={isZeroAmount(day.collected_from_new_registrations)} color="#059669">
                            {formatCurrency(day.collected_from_new_registrations)}
                          </AmountCell>
                        </td>

                        <td className="text-right">
                          <AmountCell isZero={isZeroAmount(day.collected_from_past_dues)} color="#d97706">
                            {formatCurrency(day.collected_from_past_dues)}
                          </AmountCell>
                        </td>

                        <td className="text-right">
                          <TotalCollectionPill isZero={isZeroCol}>
                            {formatCurrency(day.total_collection_today)}
                          </TotalCollectionPill>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center" style={{ padding: '2.5rem 1rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <Inbox size={28} color="#94a3b8" />
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                          There are no billing items for selected date
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          Select another date range or choose a preset like "This Month" or "Last 7 Days" to view records.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {activeDailyStats.length > 0 && (
                <tfoot>
                  <tr>
                    <td className="text-left">GRAND TOTAL</td>
                    <td className="text-right">{formatCurrency(totalStats.total_billing_amount)}</td>
                    <td className="text-right" style={{ color: '#4f46e5' }}>{formatCurrency(totalStats.franchise_share)}</td>
                    <td className="text-right" style={{ color: '#db2777' }}>{formatCurrency(totalStats.franchiser_share)}</td>
                    <td className="text-right" style={{ color: '#059669' }}>{formatCurrency(totalStats.collected_from_new_registrations)}</td>
                    <td className="text-right" style={{ color: '#d97706' }}>{formatCurrency(totalStats.collected_from_past_dues)}</td>
                    <td className="text-right">
                      <TotalCollectionPill isZero={isZeroAmount(totalStats.total_collection_today)}>
                        {formatCurrency(totalStats.total_collection_today)}
                      </TotalCollectionPill>
                    </td>
                  </tr>
                </tfoot>
              )}
            </Table>
          </TableWrapper>
        )}
      </TableCard>
    </Container>
  );
}