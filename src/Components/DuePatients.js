import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Search, AlertCircle, Calendar, Phone, Edit2, X, CheckCircle, History } from 'lucide-react';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// --- Styled Components ---
const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  min-height: 100vh;

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

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1rem;
  }
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
    content: '💰';
    font-size: 1.5rem;
  }
`;

const SubTitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  
  @media (min-width: 1024px) {
    margin-top: 0;
  }
`;

const StatsCard = styled.div`
  background: ${props => props.bg || 'linear-gradient(135deg, #ef4444, #dc2626)'};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px ${props => props.shadow || 'rgba(239, 68, 68, 0.3)'};
  display: flex;
  flex-direction: column;
  min-width: 180px;
  flex: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.025em;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  color: #1e293b;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;

  th {
    background: #f8fafc;
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 1.25rem 1.5rem;
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
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PatientName = styled.span`
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
  word-break: break-word;
  line-height: 1.4;
`;

const PatientId = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  font-family: 'Courier New', monospace;
  margin-top: 2px;
`;

const Amount = styled.span`
  font-weight: ${props => props.bold ? '700' : '500'};
  color: ${props => props.color || '#334155'};
  font-family: 'Inter', sans-serif;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #dbeafe;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
`;

const HistoryButton = styled.button`
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #16a34a;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
  }
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

// --- Modal Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
`;

// --- Mobile Responsive Components ---
const DesktopView = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileView = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const MobileCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const MobileLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const MobileValue = styled.span`
  color: #0f172a;
  font-weight: 600;
  text-align: right;
`;

const MobileActionGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #0f172a;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #0f172a;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryDate = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoryAmount = styled.div`
  font-weight: 600;
  color: #059669;
`;

const DuePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [remarks, setRemarks] = useState("Due Clearance");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
  const franchiseId = localStorage.getItem('franchise_id');

  useEffect(() => {
    fetchDuePatients();
  }, []);

  const fetchDuePatients = async () => {
    try {
      const response = await axios.get(`${franchiseurl}due-patients/?franchise_id=${franchiseId}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching due patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setPaymentAmount(""); // Reset amount or set to full due amount by default?
    // setPaymentAmount(patient.due_amount); // Optional: Pre-fill with full due
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    setPaymentAmount("");
    setPaymentMode("Cash");
    setRemarks("Due Clearance");
  };

  const handleViewHistory = (patient) => {
    setHistoryPatient(patient);
    setHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryPatient(null);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !paymentAmount) return;

    setIsSubmitting(true);
    try {
      await axios.put(`${franchiseurl}update-due-amount/`, {
        barcode: selectedPatient.barcode,
        paid_amount: parseFloat(paymentAmount),
        payment_mode: paymentMode,
        remarks: remarks
      });

      // Refresh list
      await fetchDuePatients();
      handleCloseModal();
      alert("Payment updated successfully!");
    } catch (error) {
      console.error("Error updating payment:", error);
      alert(error.response?.data?.error || "Failed to update payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;
    const lowerQuery = searchQuery.toLowerCase();
    return patients.filter(p =>
      p.patient_info?.patientname?.toLowerCase().includes(lowerQuery) ||
      p.patient_info?.patient_id?.toLowerCase().includes(lowerQuery) ||
      p.patient_info?.phoneNumber?.includes(lowerQuery) ||
      p.barcode?.toLowerCase().includes(lowerQuery)
    );
  }, [patients, searchQuery]);

  const calculateFinancials = (patient) => {
    let totalPaid = parseFloat(patient.paid_amount || 0);
    // Use payments array for more accurate calculation if available
    if (patient.payments) {
      try {
        const paymentsList = typeof patient.payments === 'string' ? JSON.parse(patient.payments) : patient.payments;
        if (Array.isArray(paymentsList) && paymentsList.length > 0) {
          totalPaid = paymentsList.reduce((s, pay) => s + (parseFloat(pay.amount) || 0), 0);
        }
      } catch (e) { }
    }
    const netAmount = parseFloat(patient.netAmount || 0);
    const currentOutstanding = netAmount - totalPaid;
    return { totalPaid, currentOutstanding, netAmount };
  };

  const totalBilledAmount = useMemo(() => {
    return patients.reduce((sum, p) => sum + parseFloat(p.netAmount || 0), 0);
  }, [patients]);

  const totalPaidAmount = useMemo(() => {
    return patients.reduce((sum, p) => sum + calculateFinancials(p).totalPaid, 0);
  }, [patients]);

  const totalOutstandingAmount = useMemo(() => {
    return patients.reduce((sum, p) => sum + calculateFinancials(p).currentOutstanding, 0);
  }, [patients]);

  return (
    <Container>
      <Header>
        <TitleGroup>
          <Title>Due Payments</Title>
          <SubTitle>Manage outstanding balances and pending collections</SubTitle>
        </TitleGroup>

        <StatsContainer>
          <StatsCard bg="linear-gradient(135deg, #3b82f6, #2563eb)" shadow="rgba(37, 99, 235, 0.3)">
            <StatLabel>Total Billed</StatLabel>
            <StatValue>₹{totalBilledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatValue>
          </StatsCard>

          <StatsCard bg="linear-gradient(135deg, #10b981, #059669)" shadow="rgba(5, 150, 105, 0.3)">
            <StatLabel>Total Paid</StatLabel>
            <StatValue>₹{totalPaidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatValue>
          </StatsCard>

          <StatsCard bg="linear-gradient(135deg, #ef4444, #dc2626)" shadow="rgba(239, 68, 68, 0.3)">
            <StatLabel>Current Outstanding</StatLabel>
            <StatValue>₹{totalOutstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StatValue>
          </StatsCard>
        </StatsContainer>
      </Header>

      <SearchWrapper>
        <SearchIcon size={18} />
        <SearchInput
          placeholder="Search by Name, ID, Phone or Barcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchWrapper>

      <Card>
        {loading ? (
          <EmptyState>
            <div style={{ padding: '2rem' }}>Loading data...</div>
          </EmptyState>
        ) : filteredPatients.length === 0 ? (
          <EmptyState>
            <AlertCircle size={48} />
            <h3>No due payments found</h3>
            <p>Great job! All payments are settled.</p>
          </EmptyState>
        ) : (
          <>
            <DesktopView>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Patient Details</th>
                      <th>Contact</th>
                      <th>Registration Date</th>
                      <th>Total Bill</th>
                      <th>Paid Amount</th>
                      <th>Current Outstanding</th>
                      <th>Last Updated</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => {
                      const { totalPaid, currentOutstanding, netAmount } = calculateFinancials(patient);
                      return (
                        <tr key={patient.barcode}>
                          <td>
                            <PatientInfo>
                              <PatientName>{patient.patient_info?.patientname || 'Unknown'}</PatientName>
                              <PatientId>{patient.patient_info?.patient_id || 'N/A'}</PatientId>
                            </PatientInfo>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                              <Phone size={14} />
                              {patient.patient_info?.phoneNumber || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                              <Calendar size={14} />
                              {new Date(patient.registrationDate).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td>
                            <Amount>₹{netAmount.toFixed(2)}</Amount>
                          </td>
                          <td>
                            <Amount color="#059669">
                              ₹{totalPaid.toFixed(2)}
                            </Amount>
                          </td>
                          <td>
                            <Amount color="#dc2626" bold>₹{currentOutstanding.toFixed(2)}</Amount>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                              {patient.due_update_date ? (
                                new Date(patient.due_update_date).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })
                              ) : (
                                <span style={{ fontStyle: 'italic', opacity: 0.7 }}>-</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <Badge>
                              <AlertCircle size={12} />
                              Pending
                            </Badge>
                          </td>
                          <td>
                            <ActionGroup>
                              <HistoryButton onClick={() => handleViewHistory(patient)} title="View Payment History">
                                <History size={14} />
                              </HistoryButton>
                              <EditButton onClick={() => handleEditClick(patient)}>
                                <Edit2 size={14} />
                                Pay
                              </EditButton>
                            </ActionGroup>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </TableWrapper>
            </DesktopView>

            <MobileView>
              {filteredPatients.map((patient) => {
                const { totalPaid, currentOutstanding, netAmount } = calculateFinancials(patient);
                return (
                  <MobileCard key={patient.barcode}>
                    <MobileCardHeader>
                      <PatientInfo>
                        <PatientName>{patient.patient_info?.patientname || 'Unknown'}</PatientName>
                        <PatientId>{patient.patient_info?.patient_id || 'N/A'}</PatientId>
                      </PatientInfo>
                      <Badge>
                        <AlertCircle size={12} />
                        Pending
                      </Badge>
                    </MobileCardHeader>

                    <MobileCardRow>
                      <MobileLabel>Contact</MobileLabel>
                      <MobileValue>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} />
                          {patient.patient_info?.phoneNumber || 'N/A'}
                        </div>
                      </MobileValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileLabel>Date</MobileLabel>
                      <MobileValue>
                        {new Date(patient.registrationDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </MobileValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileLabel>Total Bill</MobileLabel>
                      <MobileValue>₹{netAmount.toFixed(2)}</MobileValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileLabel>Paid Amount</MobileLabel>
                      <MobileValue style={{ color: '#059669' }}>₹{totalPaid.toFixed(2)}</MobileValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileLabel>Outstanding</MobileLabel>
                      <MobileValue style={{ color: '#dc2626', fontWeight: '700' }}>₹{currentOutstanding.toFixed(2)}</MobileValue>
                    </MobileCardRow>

                    <MobileActionGroup>
                      <HistoryButton onClick={() => handleViewHistory(patient)} style={{ justifyContent: 'center', width: '100%' }}>
                        <History size={14} /> History
                      </HistoryButton>
                      <EditButton onClick={() => handleEditClick(patient)} style={{ justifyContent: 'center', width: '100%' }}>
                        <Edit2 size={14} /> Pay Now
                      </EditButton>
                    </MobileActionGroup>
                  </MobileCard>
                );
              })}
            </MobileView>
          </>
        )}
      </Card>

      {/* Payment Modal */}
      {isModalOpen && selectedPatient && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Update Payment</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            {/* Payment History Section */}
            {selectedPatient.payments && selectedPatient.payments.length > 0 && (
              <div style={{ marginBottom: '1.5rem', background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>Payment History</h4>
                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                  {(() => {
                    let paymentsList = [];
                    try {
                      paymentsList = typeof selectedPatient.payments === 'string'
                        ? JSON.parse(selectedPatient.payments)
                        : selectedPatient.payments;
                    } catch (e) {
                      paymentsList = [];
                    }
                    return paymentsList.map((p, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: '#334155' }}>
                        <span>{new Date(p.date).toLocaleDateString('en-IN')} ({p.mode})</span>
                        <span style={{ fontWeight: '600' }}>₹{parseFloat(p.amount).toFixed(2)}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Patient:</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedPatient.patient_info?.patientname}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Bill:</span>
                  <span style={{ fontWeight: '600' }}>₹{parseFloat(selectedPatient.netAmount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Current Due:</span>
                  <span style={{ fontWeight: '700', color: '#dc2626' }}>₹{parseFloat(selectedPatient.due_amount).toFixed(2)}</span>
                </div>
              </div>

              <FormGroup>
                <Label>Amount to Pay (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedPatient.due_amount}
                  min="1"
                  step="0.01"
                  required
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>Payment Mode</Label>
                <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Remarks (Optional)</Label>
                <Input
                  type="text"
                  placeholder="e.g. Cleared remaining balance"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : (
                  <>
                    <CheckCircle size={18} />
                    Confirm Payment
                  </>
                )}
              </SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* History Modal */}
      {historyModalOpen && historyPatient && (
        <ModalOverlay onClick={handleCloseHistoryModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Payment History</ModalTitle>
              <CloseButton onClick={handleCloseHistoryModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                <span>Patient: <strong style={{ color: '#0f172a' }}>{historyPatient.patient_info?.patientname}</strong></span>
                <span>Total Bill: <strong>₹{parseFloat(historyPatient.netAmount).toFixed(2)}</strong></span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
              {(() => {
                let paymentsList = [];
                try {
                  paymentsList = typeof historyPatient.payments === 'string'
                    ? JSON.parse(historyPatient.payments)
                    : historyPatient.payments;
                } catch (e) {
                  paymentsList = [];
                }

                if (!paymentsList || paymentsList.length === 0) {
                  return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No payment history found</div>;
                }

                return paymentsList.map((p, idx) => (
                  <HistoryItem key={idx}>
                    <HistoryDate>
                      <span style={{ fontWeight: '500', color: '#334155', fontSize: '0.9rem' }}>
                        {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(p.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {p.mode}
                      </span>
                      {p.remarks && <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>"{p.remarks}"</span>}
                    </HistoryDate>
                    <HistoryAmount>
                      ₹{parseFloat(p.amount).toFixed(2)}
                    </HistoryAmount>
                  </HistoryItem>
                ));
              })()}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <span style={{ color: '#64748b', marginRight: '8px' }}>Total Paid:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#059669' }}>
                ₹{(() => {
                  let paymentsList = [];
                  try {
                    paymentsList = typeof historyPatient.payments === 'string'
                      ? JSON.parse(historyPatient.payments)
                      : historyPatient.payments;
                  } catch (e) { paymentsList = []; }

                  const total = Array.isArray(paymentsList) ? paymentsList.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) : 0;
                  return total.toFixed(2);
                })()}
              </span>
            </div>

          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
};

export default DuePatients;
