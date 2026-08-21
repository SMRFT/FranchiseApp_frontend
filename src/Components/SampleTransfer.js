import React, { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Truck, Users, Calendar, Search, RefreshCw, 
  CheckCircle2, Clock, Send, AlertCircle, Check, X,
  Barcode, Layers, ChevronRight, ChevronLeft
} from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  background-color: #f8fafc;
  box-sizing: border-box;

  @media (max-width: 900px) {
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;

const TopSection = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
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

const SearchWrapper = styled.div`
  position: relative;
  min-width: 240px;
  flex: 1;
  max-width: 380px;

  input {
    width: 100%;
    padding: 6px 10px 6px 30px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.82rem;
    color: #1e293b;
    background: white;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: #4B9EB0;
    }
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }
`;

const DateControls = styled.div`
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
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.78rem;
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
    border-color: #cbd5e1;
    color: #334155;
    &:hover { background: #f8fafc; border-color: #94a3b8; }
  `}

  ${props => props.variant === 'secondary' && `
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #334155;
    &:hover { background: #e2e8f0; }
  `}
`;

const TableCard = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
  min-width: 800px;

  th {
    position: sticky;
    top: 0;
    z-index: 5;
    background: #f8fafc;
    padding: 9px 12px;
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
    padding: 9px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
    white-space: nowrap;
  }

  tr:hover td {
    background-color: #f8fafc;
  }
`;

const BarcodeChip = styled.span`
  font-family: monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  border: 1px solid #e2e8f0;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${props => props.status === 'Transferred' ? '#ecfdf5' : '#fef3c7'};
  color: ${props => props.status === 'Transferred' ? '#047857' : '#b45309'};
  border: 1px solid ${props => props.status === 'Transferred' ? '#a7f3d0' : '#fde68a'};
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: ${fadeIn} 0.25s ease-out;
`;

const ModalHeader = styled.div`
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    color: #0f172a;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  button {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    &:hover { background: #e2e8f0; }
  }
`;

const ModalBody = styled.div`
  padding: 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PatientSummaryBox = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  .p-name { font-weight: 700; color: #0f172a; font-size: 0.95rem; }
  .p-sub { font-size: 0.78rem; color: #64748b; margin-top: 2px; }
`;

const ModalFooter = styled.div`
  padding: 12px 18px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: #f8fafc;
`;

const parseTestDetails = (testStr) => {
  try {
    if (!testStr) return [];
    if (Array.isArray(testStr)) return testStr;
    if (typeof testStr === "object") return [testStr];
    let s = String(testStr).trim();
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    s = s.replace(/\\(?!["\\])/g, "\\\\").replace(/\\"/g, '"');
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
};

export default function SampleTransfer() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSample, setSelectedSample] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchQuery: "",
  });
  const [testSelections, setTestSelections] = useState({});
  const [testStatuses, setTestStatuses] = useState({});
  const [saving, setSaving] = useState(false);

  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
  const franchiseId = localStorage.getItem("franchise_id") || "SHF004";

  const fetchCollectedSamples = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        franchise_id: franchiseId,
        start_date: filters.startDate,
        end_date: filters.endDate,
      });
      const res = await fetch(`${franchiseurl}sample/?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setSamples(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(`Failed to fetch samples: ${e.message}`);
      setSamples([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectedSamples();
  }, [filters.startDate, filters.endDate]);

  const filteredSamples = useMemo(() => {
    if (!filters.searchQuery) return samples;
    const query = filters.searchQuery.toLowerCase().trim();
    return samples.filter(
      s => (s.patient_id || '').toLowerCase().includes(query) || (s.barcode || '').toLowerCase().includes(query)
    );
  }, [samples, filters.searchQuery]);

  const openModal = async (sample) => {
    setSelectedSample(sample);
    setShowModal(true);

    const originalTests = parseTestDetails(sample.testdetails);
    const initialSelections = {};
    const initialStatuses = {};

    originalTests.forEach((test, index) => {
      const testKey = `${sample.patient_id}_${index}`;
      const existingStatus = test.samplestatus || "Collected";
      initialSelections[testKey] = existingStatus !== "Transferred";
      initialStatuses[testKey] = existingStatus === "Transferred" ? "Transferred" : "Transferred";
    });

    setTestSelections(initialSelections);
    setTestStatuses(initialStatuses);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSample(null);
    setTestSelections({});
    setTestStatuses({});
  };

  const handleTestSelection = (testKey, checked) => {
    setTestSelections(prev => ({ ...prev, [testKey]: checked }));
  };

  const handleSelectAll = (selectAll) => {
    if (!selectedSample) return;
    const tests = parseTestDetails(selectedSample.testdetails);
    const updated = {};
    tests.forEach((test, i) => {
      const k = `${selectedSample.patient_id}_${i}`;
      if (test.samplestatus !== "Transferred") {
        updated[k] = selectAll;
      }
    });
    setTestSelections(prev => ({ ...prev, ...updated }));
  };

  const saveTestData = async () => {
    setSaving(true);
    try {
      const originalTests = parseTestDetails(selectedSample.testdetails);
      const currentTime = new Date().toISOString();

      const updatedTests = originalTests.map((test, index) => {
        const testKey = `${selectedSample.patient_id}_${index}`;
        if (test.samplestatus === "Transferred") return test;

        if (testSelections[testKey]) {
          return {
            ...test,
            samplestatus: "Transferred",
            sampletransferred_time: currentTime,
            transferred_by: franchiseId,
          };
        }
        return test;
      });

      const res = await fetch(`${franchiseurl}sample/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          franchise_id: franchiseId,
          barcode: selectedSample.barcode,
          testdetails: updatedTests,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error ${res.status}`);
      }

      alert("Samples transferred successfully!");
      closeModal();
      fetchCollectedSamples();
    } catch (e) {
      alert(`Failed to transfer: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <TopSection>
        <Header>
          <TitleGroup>
            <h1><Truck size={22} color="#4B9EB0" /> Sample Transfer</h1>
            <p>Dispatch and transfer collected samples to central processing lab</p>
          </TitleGroup>

          <HeaderActions>
            <Button variant="secondary" onClick={fetchCollectedSamples} title="Refresh records">
              <RefreshCw size={13} /> Refresh
            </Button>
          </HeaderActions>
        </Header>

        {/* Stat Cards */}
        <StatsGrid>
          <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
            <div className="stat-info">
              <div className="stat-label">Total Sample Batches</div>
              <div className="stat-value">{filteredSamples.length}</div>
            </div>
            <div className="stat-icon"><Layers size={17} /></div>
          </StatCard>

          <StatCard iconBg="#fef3c7" iconColor="#b45309" valueColor="#b45309">
            <div className="stat-info">
              <div className="stat-label">Date Filter</div>
              <div className="stat-value" style={{ fontSize: '0.95rem' }}>{filters.startDate}</div>
            </div>
            <div className="stat-icon"><Calendar size={17} /></div>
          </StatCard>

          <StatCard iconBg="#dcfce7" iconColor="#15803d" valueColor="#15803d">
            <div className="stat-info">
              <div className="stat-label">Source Franchise</div>
              <div className="stat-value">{franchiseId}</div>
            </div>
            <div className="stat-icon"><CheckCircle2 size={17} /></div>
          </StatCard>
        </StatsGrid>

        {/* Filter Section */}
        <FilterSection>
          <SearchWrapper>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Patient ID or Barcode..."
              value={filters.searchQuery}
              onChange={e => setFilters(p => ({ ...p, searchQuery: e.target.value }))}
            />
          </SearchWrapper>

          <DateControls>
            <span className="date-label">From:</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilters(p => ({ ...p, startDate: e.target.value }))}
            />

            <span className="date-label">To:</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={e => setFilters(p => ({ ...p, endDate: e.target.value }))}
            />

            <Button variant="primary" onClick={fetchCollectedSamples} disabled={loading}>
              Search
            </Button>
          </DateControls>
        </FilterSection>
      </TopSection>

      {/* Table Card */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
            <div>Loading collected samples...</div>
          </div>
        ) : filteredSamples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <Truck size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
              No Collected Samples Found
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              No collected samples found for the selected date range.
            </div>
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Barcode</th>
                  <th>Total Tests</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center', width: '140px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSamples.map(sample => {
                  const tests = parseTestDetails(sample.testdetails);
                  const transferredCount = tests.filter(t => t.samplestatus === 'Transferred').length;
                  const isAllTransferred = tests.length > 0 && transferredCount === tests.length;

                  return (
                    <tr key={sample._id || sample.patient_id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>
                          #{sample.patient_id}
                        </span>
                      </td>

                      <td>
                        <BarcodeChip>{sample.barcode || "N/A"}</BarcodeChip>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: '#334155' }}>
                          {tests.length} test(s) ({transferredCount} transferred)
                        </span>
                      </td>

                      <td>
                        <StatusPill status={isAllTransferred ? 'Transferred' : 'Collected'}>
                          {isAllTransferred ? '✓ Transferred' : 'Pending Transfer'}
                        </StatusPill>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <Button 
                          variant={isAllTransferred ? "secondary" : "primary"} 
                          onClick={() => openModal(sample)}
                          style={{ padding: '4px 10px' }}
                        >
                          <Send size={12} /> {isAllTransferred ? "View Details" : "Transfer Samples"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </TableCard>

      {/* Transfer Modal */}
      {showModal && selectedSample && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3><Truck size={18} color="#4B9EB0" /> Dispatch & Transfer Samples</h3>
              <button onClick={closeModal}><X size={18} /></button>
            </ModalHeader>

            <ModalBody>
              <PatientSummaryBox>
                <div>
                  <div className="p-name">Patient #{selectedSample.patient_id}</div>
                  <div className="p-sub">Barcode: {selectedSample.barcode}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Franchise: {franchiseId}
                </div>
              </PatientSummaryBox>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                  Test Samples for Transfer
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#4B9EB0', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    onChange={e => handleSelectAll(e.target.checked)} 
                  />
                  Select All
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parseTestDetails(selectedSample.testdetails).map((test, index) => {
                  const testKey = `${selectedSample.patient_id}_${index}`;
                  const isTransferred = test.samplestatus === "Transferred";

                  return (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '10px 12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0' 
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: isTransferred ? 'default' : 'pointer', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          disabled={isTransferred}
                          checked={isTransferred || testSelections[testKey] || false} 
                          onChange={e => handleTestSelection(testKey, e.target.checked)} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                            {test.testname || test.test_name || "Test"}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Container: {test.collection_container || test.container || "Plain/Gel"}
                          </div>
                        </div>
                      </label>

                      <div>
                        {isTransferred ? (
                          <StatusPill status="Transferred">✓ Transferred</StatusPill>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369a1' }}>
                            Ready to Transfer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveTestData} disabled={saving}>
                <Send size={14} /> {saving ? "Transferring..." : "Confirm & Transfer Selected"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}