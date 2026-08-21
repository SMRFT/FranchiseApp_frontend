import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  Home, Phone, MapPin, CheckCircle, Clock, Search, RefreshCw, 
  User, Calendar, AlertCircle, Eye, XCircle, ArrowRight, ShieldCheck,
  MessageSquare, FileText, Check, Edit3, Save
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleContainer = styled.div`
  h1 {
    font-size: 1.65rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.02em;
  }
  p {
    color: #64748b;
    margin: 4px 0 0 0;
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .stat-val {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
  }

  .stat-lbl {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-top: 2px;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.bg || '#f1f5f9'};
    color: ${props => props.color || '#475569'};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 24px;
`;

const FilterBar = styled.div`
  padding: 14px 18px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  input {
    width: 100%;
    padding: 7px 12px 7px 34px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.85rem;
    outline: none;
    transition: border 0.2s;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const DateFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #475569;
  font-weight: 600;

  input[type="date"] {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.82rem;
    outline: none;
    background: white;
    font-family: inherit;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const SelectFilter = styled.select`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.82rem;
  color: #334155;
  background: white;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #4B9EB0;
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 7px;
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

const AcceptButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;

  ${props => props.status === 'Accepted' && `
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  `}

  ${props => props.status === 'Assigned' && `
    background: #fffbeb;
    color: #b45309;
    border: 1px solid #fde68a;
  `}
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  th {
    background: #f8fafc;
    padding: 10px 14px;
    font-weight: 700;
    color: #475569;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
    text-align: left;
  }

  td {
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
  }

  tr:hover td {
    background-color: #f8fafc;
  }
`;

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
  max-width: ${props => props.maxWidth || '520px'};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: ${fadeIn} 0.25s ease-out;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;

  h2 {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    color: #0f172a;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  font-size: 0.88rem;

  .label {
    width: 160px;
    font-weight: 600;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .value {
    flex: 1;
    color: #1e293b;
    font-weight: 500;
  }
`;

const ModalFooter = styled.div`
  padding: 14px 20px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.88rem;
    outline: none;
    font-family: inherit;
    min-height: 80px;
    resize: vertical;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const PatientSummaryBox = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .p-name {
    font-weight: 700;
    color: #0f172a;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .p-sub {
    font-size: 0.8rem;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HomeCollection() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(getTodayDateString());
  const [toDate, setToDate] = useState(getTodayDateString());
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [acceptModalTask, setAcceptModalTask] = useState(null);
  const [modalRemarksText, setModalRemarksText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const franchiseId = localStorage.getItem('franchise_id') || 'SHF004';
  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let queryUrl = `${franchiseurl}home-collections/?franchise_id=${franchiseId}`;
      if (fromDate) queryUrl += `&from_date=${fromDate}`;
      if (toDate) queryUrl += `&to_date=${toDate}`;
      if (statusFilter) queryUrl += `&status=${statusFilter}`;
      if (searchQuery) queryUrl += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(queryUrl);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Error fetching home collections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fromDate, toDate, statusFilter]);

  // Open Accept Modal
  const handleOpenAcceptModal = (task) => {
    setAcceptModalTask(task);
    setModalRemarksText(task.Remarks || '');
  };

  const handleCloseAcceptModal = () => {
    setAcceptModalTask(null);
    setModalRemarksText('');
    setIsSubmitting(false);
  };

  // Open View Details Modal
  const handleOpenViewModal = (task) => {
    setSelectedTask(task);
    setModalRemarksText(task.Remarks || '');
  };

  const handleCloseViewModal = () => {
    setSelectedTask(null);
    setModalRemarksText('');
    setIsSubmitting(false);
  };

  // Action: Confirm Acceptance (with optional remarks)
  const handleConfirmAccept = async (taskToAccept) => {
    const targetTask = taskToAccept || acceptModalTask || selectedTask;
    if (!targetTask) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${franchiseurl}home-collections/${targetTask.id}/accept/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Accepted',
          accepted_by: franchiseId,
          user_id: franchiseId,
          franchise_id: franchiseId,
          Remarks: modalRemarksText.trim()
        })
      });

      if (res.ok) {
        const updatedDoc = await res.json();
        setTasks(prev => prev.map(t => t.id === targetTask.id ? { 
          ...t, 
          status: 'Accepted',
          accepted_by: franchiseId,
          sample_accepted_time: updatedDoc.sample_accepted_time || new Date().toISOString(),
          Remarks: modalRemarksText.trim()
        } : t));

        if (selectedTask && selectedTask.id === targetTask.id) {
          setSelectedTask(prev => ({ 
            ...prev, 
            status: 'Accepted',
            accepted_by: franchiseId,
            sample_accepted_time: updatedDoc.sample_accepted_time || new Date().toISOString(),
            Remarks: modalRemarksText.trim()
          }));
        }

        handleCloseAcceptModal();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to accept task");
      }
    } catch (err) {
      console.error("Error accepting task:", err);
      alert("An error occurred while accepting the task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action: Save Remarks Only (from inside View Modal or Accept Modal)
  const handleSaveRemarksOnly = async () => {
    const task = selectedTask || acceptModalTask;
    if (!task) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${franchiseurl}home-collections/${task.id}/accept/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: franchiseId,
          franchise_id: franchiseId,
          Remarks: modalRemarksText.trim()
        })
      });

      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === task.id ? { 
          ...t, 
          Remarks: modalRemarksText.trim()
        } : t));

        if (selectedTask && selectedTask.id === task.id) {
          setSelectedTask(prev => ({ 
            ...prev, 
            Remarks: modalRemarksText.trim()
          }));
        }

        alert("Remarks updated successfully!");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update remarks");
      }
    } catch (err) {
      console.error("Error updating remarks:", err);
      alert("An error occurred while saving remarks");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCount = tasks.length;
  const assignedCount = tasks.filter(t => t.status === 'Assigned').length;
  const acceptedCount = tasks.filter(t => t.status === 'Accepted').length;

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <h1><Home size={26} color="#4B9EB0" /> Home Collection Tasks</h1>
          <p>View, track, accept, and manage home sample collection requests</p>
        </TitleContainer>
      </Header>

      <StatsGrid>
        <StatCard bg="#e0f2fe" color="#0369a1">
          <div>
            <div className="stat-val">{totalCount}</div>
            <div className="stat-lbl">Total Tasks</div>
          </div>
          <div className="icon-wrapper"><Home size={22} /></div>
        </StatCard>
        <StatCard bg="#fef3c7" color="#b45309">
          <div>
            <div className="stat-val">{assignedCount}</div>
            <div className="stat-lbl">Pending (Assigned)</div>
          </div>
          <div className="icon-wrapper"><Clock size={22} /></div>
        </StatCard>
        <StatCard bg="#dcfce7" color="#15803d">
          <div>
            <div className="stat-val">{acceptedCount}</div>
            <div className="stat-lbl">Accepted Tasks</div>
          </div>
          <div className="icon-wrapper"><CheckCircle size={22} /></div>
        </StatCard>
      </StatsGrid>

      <Card>
        <FilterBar>
          <DateFilterWrapper>
            <span>From:</span>
            <input 
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              title="Filter from date"
            />
          </DateFilterWrapper>

          <DateFilterWrapper>
            <span>To:</span>
            <input 
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              title="Filter to date"
            />
          </DateFilterWrapper>

          <SelectFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Assigned">Assigned (Pending)</option>
            <option value="Accepted">Accepted</option>
          </SelectFilter>

          <SearchInputWrapper>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search patient, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTasks()}
            />
          </SearchInputWrapper>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {(fromDate !== getTodayDateString() || toDate !== getTodayDateString() || searchQuery || statusFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  const today = getTodayDateString();
                  setFromDate(today);
                  setToDate(today);
                  setStatusFilter('');
                  setSearchQuery('');
                }}
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                title="Reset filters"
              >
                Clear
              </Button>
            )}

            <Button variant="outline" onClick={fetchTasks}>
              <RefreshCw size={14} /> Refresh
            </Button>
          </div>
        </FilterBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient Details</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: '160px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Loading home collection tasks...</td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '35px', color: '#94a3b8' }}>
                    No home collection tasks found for the selected date/criteria.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isAssigned = task.status === 'Assigned';
                  const isAccepted = task.status === 'Accepted';

                  return (
                    <tr key={task.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.82rem' }}>
                          {formatDateDisplay(task.date || task.created_date)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color="#4B9EB0" />
                          {task.patient_name || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0369a1', fontWeight: 600, fontSize: '0.82rem' }}>
                          <Phone size={13} />
                          {task.phone ? (
                            <a href={`tel:${task.phone}`} style={{ color: '#0369a1', textDecoration: 'none' }}>
                              {task.phone}
                            </a>
                          ) : 'N/A'}
                        </div>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', color: '#475569', fontSize: '0.82rem' }}>
                          <MapPin size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span title={task.address}>{task.address || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={task.status}>
                          {isAccepted && <CheckCircle size={12} />}
                          {isAssigned && <Clock size={12} />}
                          {task.status}
                        </StatusBadge>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                          {/* 1. Accept Button (for Assigned tasks) */}
                          {isAssigned ? (
                            <AcceptButton 
                              onClick={() => handleOpenAcceptModal(task)}
                              title="Accept this home collection task"
                            >
                              <CheckCircle size={13} /> Accept
                            </AcceptButton>
                          ) : (
                            <span style={{ 
                              color: '#15803d', 
                              fontSize: '0.78rem', 
                              fontWeight: 700, 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '3px',
                              marginRight: '2px'
                            }}>
                              <ShieldCheck size={14} /> Accepted
                            </span>
                          )}

                          {/* 2. View Details Button */}
                          <Button 
                            variant="outline" 
                            onClick={() => handleOpenViewModal(task)}
                            style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                            title="View full task details and remarks"
                          >
                            <Eye size={13} /> View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>

      {/* Accept Confirmation Modal (Triggered by 'Accept' Button) */}
      {acceptModalTask && (
        <ModalOverlay onClick={handleCloseAcceptModal}>
          <ModalContent maxWidth="480px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2><CheckCircle size={18} color="#10b981" /> Accept Home Collection</h2>
              <button onClick={handleCloseAcceptModal}><XCircle size={18} /></button>
            </ModalHeader>

            <form onSubmit={(e) => { e.preventDefault(); handleConfirmAccept(acceptModalTask); }}>
              <ModalBody>
                <PatientSummaryBox>
                  <div className="p-name"><User size={15} color="#4B9EB0" /> {acceptModalTask.patient_name}</div>
                  <div className="p-sub"><Phone size={13} /> {acceptModalTask.phone || 'N/A'}</div>
                  <div className="p-sub"><MapPin size={13} /> {acceptModalTask.address || 'N/A'}</div>
                </PatientSummaryBox>

                <FormGroup>
                  <label><MessageSquare size={14} color="#4B9EB0" /> Remarks / Notes (Optional)</label>
                  <textarea
                    placeholder="Enter remarks or notes if any..."
                    value={modalRemarksText}
                    onChange={(e) => setModalRemarksText(e.target.value)}
                  />
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button type="button" variant="secondary" onClick={handleCloseAcceptModal}>
                  Cancel
                </Button>
                <AcceptButton type="submit" disabled={isSubmitting}>
                  <Check size={14} /> {isSubmitting ? 'Accepting...' : 'Confirm & Accept'}
                </AcceptButton>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Task Details Modal (Triggered by 'View' Button - Contains full details & Remarks) */}
      {selectedTask && (
        <ModalOverlay onClick={handleCloseViewModal}>
          <ModalContent maxWidth="540px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2><Home size={18} color="#4B9EB0" /> Home Collection Details</h2>
              <button onClick={handleCloseViewModal}><XCircle size={18} /></button>
            </ModalHeader>
            <ModalBody>
              <DetailRow>
                <div className="label"><User size={14} /> Patient:</div>
                <div className="value" style={{ fontWeight: 700, fontSize: '1rem' }}>
                  {selectedTask.patient_name}
                </div>
              </DetailRow>

              <DetailRow>
                <div className="label"><Phone size={14} /> Phone:</div>
                <div className="value">
                  <a href={`tel:${selectedTask.phone}`} style={{ color: '#0369a1', fontWeight: 600 }}>
                    {selectedTask.phone || 'N/A'}
                  </a>
                </div>
              </DetailRow>

              <DetailRow>
                <div className="label"><MapPin size={14} /> Address:</div>
                <div className="value">{selectedTask.address || 'N/A'}</div>
              </DetailRow>

              <DetailRow>
                <div className="label"><Calendar size={14} /> Scheduled Date:</div>
                <div className="value">{formatDateDisplay(selectedTask.date || selectedTask.created_date)}</div>
              </DetailRow>

              <DetailRow>
                <div className="label"><ShieldCheck size={14} /> Franchise:</div>
                <div className="value">{selectedTask.franchise_name || selectedTask.franchise_id}</div>
              </DetailRow>

              <DetailRow>
                <div className="label"><Clock size={14} /> Status:</div>
                <div className="value">
                  <StatusBadge status={selectedTask.status}>{selectedTask.status}</StatusBadge>
                </div>
              </DetailRow>

              {selectedTask.accepted_by && (
                <DetailRow>
                  <div className="label"><User size={14} /> Accepted By:</div>
                  <div className="value" style={{ fontWeight: 600 }}>
                    {selectedTask.accepted_by}
                  </div>
                </DetailRow>
              )}

              {selectedTask.sample_accepted_time && (
                <DetailRow>
                  <div className="label"><Clock size={14} /> Sample Accepted Time:</div>
                  <div className="value" style={{ color: '#047857', fontWeight: 600 }}>
                    {formatDateDisplay(selectedTask.sample_accepted_time)}
                  </div>
                </DetailRow>
              )}

              {selectedTask.lastmodified_date && (
                <DetailRow>
                  <div className="label">Last Updated:</div>
                  <div className="value" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {formatDateDisplay(selectedTask.lastmodified_date)}
                  </div>
                </DetailRow>
              )}

              {/* Remarks Section inside View Modal */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '6px' }}>
                <FormGroup>
                  <label><MessageSquare size={14} color="#4B9EB0" /> Remarks / Notes</label>
                  <textarea
                    placeholder="Type remarks or reasons (e.g. 'I cannot accept, sorry', 'Patient requested callback', 'Sample taken')..."
                    value={modalRemarksText}
                    onChange={(e) => setModalRemarksText(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSaveRemarksOnly}
                      disabled={isSubmitting}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      <Save size={12} /> {isSubmitting ? 'Saving...' : 'Save Remarks'}
                    </Button>
                  </div>
                </FormGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              {selectedTask.status === 'Assigned' && (
                <AcceptButton 
                  onClick={() => handleConfirmAccept(selectedTask)}
                  disabled={isSubmitting}
                >
                  <CheckCircle size={14} /> Accept Task
                </AcceptButton>
              )}
              <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
