import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { 
  Search, AlertCircle, Calendar, Phone, Edit2, X, CheckCircle, 
  History, DollarSign, Download, RefreshCw, Layers, ArrowUpRight,
  Clock, CreditCard, ChevronDown, ChevronRight, User, Check,
  IndianRupee, Filter, List, CalendarRange, CheckCircle2, CircleDot
} from 'lucide-react';

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

  .stat-subtext {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 500;
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
  flex-direction: column;
  gap: 10px;
`;

const FilterTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const StatusRadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const StatusRadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.checked ? props.activeBorder || '#4B9EB0' : '#e2e8f0'};
  background: ${props => props.checked ? props.activeBg || '#f0fdfa' : '#ffffff'};
  color: ${props => props.checked ? props.activeColor || '#0f766e' : '#64748b'};
  transition: all 0.15s ease;
  user-select: none;

  input[type="radio"] {
    display: none;
  }

  .count-badge {
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    background: ${props => props.checked ? 'rgba(0,0,0,0.08)' : '#f1f5f9'};
    color: inherit;
  }

  &:hover {
    border-color: #cbd5e1;
    background: ${props => props.checked ? props.activeBg || '#f0fdfa' : '#f8fafc'};
  }
`;

const FilterBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  padding-top: 8px;
`;

const SearchWrapper = styled.div`
  position: relative;
  min-width: 240px;
  flex: 1;
  max-width: 340px;

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

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
`;

const ViewToggleButton = styled.button`
  padding: 4px 8px;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.active ? '#4B9EB0' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  transition: all 0.15s;

  &:hover {
    background: ${props => props.active ? '#3c8697' : '#f8fafc'};
  }
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
  min-width: 960px;

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

  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
`;

const DateGroupHeaderRow = styled.tr`
  td {
    background: #f1f5f9 !important;
    padding: 8px 14px !important;
    border-bottom: 2px solid #e2e8f0 !important;
    border-top: 1px solid #e2e8f0 !important;
    font-weight: 700;
    color: #1e293b;
  }
`;

const DateGroupBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .date-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.84rem;
    color: #0f172a;
  }

  .date-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 0.78rem;
    color: #64748b;
  }

  .meta-highlight {
    font-weight: 700;
    color: #ef4444;
  }
`;

const DuePill = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: ${props => props.isZero ? '#f1f5f9' : '#fef2f2'};
  color: ${props => props.isZero ? '#94a3b8' : '#dc2626'};
  border: 1px solid ${props => props.isZero ? '#e2e8f0' : '#fecaca'};
`;

const PaidPill = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'Paid') return '#ecfdf5';
    if (props.status === 'Partially Paid') return '#fffbeb';
    return '#fef2f2';
  }};
  color: ${props => {
    if (props.status === 'Paid') return '#047857';
    if (props.status === 'Partially Paid') return '#d97706';
    return '#dc2626';
  }};
  border: 1px solid ${props => {
    if (props.status === 'Paid') return '#a7f3d0';
    if (props.status === 'Partially Paid') return '#fde68a';
    return '#fecaca';
  }};
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

// --- Modal Styled Components ---
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
  max-width: 480px;
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
`;

const ModalBody = styled.div`
  padding: 18px;
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

  .p-name {
    font-weight: 700;
    color: #0f172a;
    font-size: 0.92rem;
  }
  .p-sub {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 2px;
  }
  .p-due {
    text-align: right;
    .due-lbl { font-size: 0.7rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .due-val { font-size: 1.15rem; font-weight: 800; color: #ef4444; }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
  }

  input, select, textarea {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.88rem;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 12px 18px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: #f8fafc;
`;

export default function DuePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to pending dues
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'flat'

  // Modal State for Collecting Due
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [remarks, setRemarks] = useState("Due Clearance");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);

  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
  const franchiseId = localStorage.getItem('franchise_id') || 'SHF004';

  const fetchDuePatients = async () => {
    setLoading(true);
    try {
      let url = `${franchiseurl}due-patients/?franchise_id=${franchiseId}`;
      if (fromDate && toDate) {
        url += `&from_date=${fromDate}&to_date=${toDate}`;
      }
      const response = await axios.get(url);
      setPatients(response.data || []);
    } catch (error) {
      console.error("Error fetching due patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuePatients();
  }, [fromDate, toDate]);

  const handleOpenCollectModal = (patient) => {
    setSelectedPatient(patient);
    setPaymentAmount(patient.due_amount || "");
    setPaymentMode("Cash");
    setRemarks("Due Clearance");
    setIsModalOpen(true);
  };

  const handleCloseCollectModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    setPaymentAmount("");
    setPaymentMode("Cash");
    setRemarks("Due Clearance");
  };

  const handleOpenHistoryModal = (patient) => {
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

    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid payment amount greater than 0");
      return;
    }

    const currentDue = parseFloat(selectedPatient.due_amount || 0);
    if (amt > currentDue) {
      alert(`Paid amount cannot exceed current outstanding due (₹${currentDue.toFixed(2)})`);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`${franchiseurl}update-due-amount/`, {
        barcode: selectedPatient.barcode,
        paid_amount: amt,
        payment_mode: paymentMode,
        remarks: remarks
      });

      await fetchDuePatients();
      handleCloseCollectModal();
    } catch (error) {
      console.error("Error updating payment:", error);
      alert(error.response?.data?.error || "Failed to update payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatDateTimeDisplay = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  // Status breakdown counts (computed on all fetched patients)
  const statusCounts = useMemo(() => {
    let pendingCount = 0;
    let unpaidCount = 0;
    let partialCount = 0;
    let paidCount = 0;

    patients.forEach(p => {
      const due = parseFloat(p.due_amount || 0);
      const paid = parseFloat(p.paid_amount || 0);
      if (due > 0.01) {
        pendingCount++;
        if (paid > 0.01) {
          partialCount++;
        } else {
          unpaidCount++;
        }
      } else {
        paidCount++;
      }
    });

    return {
      pending: pendingCount,
      unpaid: unpaidCount,
      partial: partialCount,
      paid: paidCount,
      all: patients.length
    };
  }, [patients]);

  // Filter patients by Status and Search query
  const filteredPatients = useMemo(() => {
    let list = patients;

    // Apply Status Radio filter
    if (statusFilter === 'pending') {
      list = list.filter(p => parseFloat(p.due_amount || 0) > 0.01);
    } else if (statusFilter === 'unpaid') {
      list = list.filter(p => parseFloat(p.due_amount || 0) > 0.01 && parseFloat(p.paid_amount || 0) <= 0.01);
    } else if (statusFilter === 'partial') {
      list = list.filter(p => parseFloat(p.due_amount || 0) > 0.01 && parseFloat(p.paid_amount || 0) > 0.01);
    } else if (statusFilter === 'paid') {
      list = list.filter(p => parseFloat(p.due_amount || 0) <= 0.01);
    }

    // Apply Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const name = (p.patient_info?.patientname || '').toLowerCase();
        const pid = (p.patient_info?.patient_id || '').toLowerCase();
        const phone = (p.patient_info?.phoneNumber || '').toLowerCase();
        const barcode = (p.barcode || '').toLowerCase();
        return name.includes(q) || pid.includes(q) || phone.includes(q) || barcode.includes(q);
      });
    }

    return list;
  }, [patients, statusFilter, searchQuery]);

  // Overall Financial Stats for current filtered view
  const { totalBilled, totalPaid, totalOutstanding } = useMemo(() => {
    let billed = 0;
    let paid = 0;
    let outstanding = 0;

    filteredPatients.forEach(p => {
      billed += parseFloat(p.netAmount || 0);
      paid += parseFloat(p.paid_amount || 0);
      outstanding += parseFloat(p.due_amount || 0);
    });

    return { totalBilled: billed, totalPaid: paid, totalOutstanding: outstanding };
  }, [filteredPatients]);

  // Group patients by Date
  const dateWiseGroups = useMemo(() => {
    const groups = {};
    filteredPatients.forEach(p => {
      let dKey = p.registrationDateOnly;
      if (!dKey && p.registrationDate) {
        dKey = p.registrationDate.substring(0, 10);
      }
      if (!dKey) dKey = 'Unknown Date';

      if (!groups[dKey]) {
        groups[dKey] = {
          dateKey: dKey,
          items: [],
          totalDue: 0,
          totalBilled: 0
        };
      }
      groups[dKey].items.push(p);
      groups[dKey].totalDue += parseFloat(p.due_amount || 0);
      groups[dKey].totalBilled += parseFloat(p.netAmount || 0);
    });

    // Sort dates descending
    return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [filteredPatients]);

  const handleExportCSV = () => {
    if (filteredPatients.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = ['Registration Date', 'Barcode', 'Patient ID', 'Patient Name', 'Phone', 'Total Billed (₹)', 'Paid Amount (₹)', 'Due Outstanding (₹)', 'Status', 'Last Updated'];
    const rows = filteredPatients.map(p => [
      p.registrationDate ? formatDateTimeDisplay(p.registrationDate) : 'N/A',
      p.barcode || '',
      p.patient_info?.patient_id || '',
      p.patient_info?.patientname || '',
      p.patient_info?.phoneNumber || '',
      p.netAmount || '0.00',
      p.paid_amount || '0.00',
      p.due_amount || '0.00',
      p.payment_status || '',
      p.due_update_date ? formatDateTimeDisplay(p.due_update_date) : 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Patients_Report_${statusFilter}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <TopSection>
        <Header>
          <TitleGroup>
            <h1><DollarSign size={22} color="#4B9EB0" /> Due Patients & Collection Report</h1>
            <p>Date-wise tracking of patient dues, partial payments, and clearances</p>
          </TitleGroup>

          <HeaderActions>
            <Button variant="outline" onClick={handleExportCSV} title="Export Report as CSV">
              <Download size={13} /> Export CSV
            </Button>
            <Button variant="secondary" onClick={fetchDuePatients} title="Refresh List">
              <RefreshCw size={13} /> Refresh
            </Button>
          </HeaderActions>
        </Header>

        {/* Executive Stat Cards */}
        <StatsGrid>
          <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
            <div className="stat-info">
              <div className="stat-label">Total Billed ({filteredPatients.length})</div>
              <div className="stat-value">{formatCurrency(totalBilled)}</div>
              <div className="stat-subtext">Original bill value in current view</div>
            </div>
            <div className="stat-icon"><Layers size={17} /></div>
          </StatCard>

          <StatCard iconBg="#dcfce7" iconColor="#15803d" valueColor="#15803d">
            <div className="stat-info">
              <div className="stat-label">Total Collected</div>
              <div className="stat-value">{formatCurrency(totalPaid)}</div>
              <div className="stat-subtext">Payments received so far</div>
            </div>
            <div className="stat-icon"><CheckCircle size={17} /></div>
          </StatCard>

          <StatCard iconBg="#fee2e2" iconColor="#dc2626" valueColor="#dc2626">
            <div className="stat-info">
              <div className="stat-label">Total Outstanding Due</div>
              <div className="stat-value">{formatCurrency(totalOutstanding)}</div>
              <div className="stat-subtext">{statusCounts.pending} patient(s) with pending dues</div>
            </div>
            <div className="stat-icon"><AlertCircle size={17} /></div>
          </StatCard>
        </StatsGrid>

        {/* Filter Section with Status Radio Buttons and Date Controls */}
        <FilterSection>
          <FilterTopRow>
            {/* Status Radio Filter Buttons */}
            <StatusRadioGroup>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginRight: '4px' }}>
                Status:
              </span>

              <StatusRadioLabel 
                checked={statusFilter === 'pending'}
                activeBorder="#ef4444"
                activeBg="#fef2f2"
                activeColor="#dc2626"
              >
                <input 
                  type="radio" 
                  name="statusFilter" 
                  value="pending"
                  checked={statusFilter === 'pending'} 
                  onChange={() => setStatusFilter('pending')} 
                />
                Pending Dues
                <span className="count-badge">{statusCounts.pending}</span>
              </StatusRadioLabel>

              <StatusRadioLabel 
                checked={statusFilter === 'unpaid'}
                activeBorder="#ef4444"
                activeBg="#fff1f2"
                activeColor="#e11d48"
              >
                <input 
                  type="radio" 
                  name="statusFilter" 
                  value="unpaid"
                  checked={statusFilter === 'unpaid'} 
                  onChange={() => setStatusFilter('unpaid')} 
                />
                Unpaid
                <span className="count-badge">{statusCounts.unpaid}</span>
              </StatusRadioLabel>

              <StatusRadioLabel 
                checked={statusFilter === 'partial'}
                activeBorder="#f59e0b"
                activeBg="#fffbeb"
                activeColor="#d97706"
              >
                <input 
                  type="radio" 
                  name="statusFilter" 
                  value="partial"
                  checked={statusFilter === 'partial'} 
                  onChange={() => setStatusFilter('partial')} 
                />
                Partially Paid
                <span className="count-badge">{statusCounts.partial}</span>
              </StatusRadioLabel>

              <StatusRadioLabel 
                checked={statusFilter === 'paid'}
                activeBorder="#10b981"
                activeBg="#ecfdf5"
                activeColor="#047857"
              >
                <input 
                  type="radio" 
                  name="statusFilter" 
                  value="paid"
                  checked={statusFilter === 'paid'} 
                  onChange={() => setStatusFilter('paid')} 
                />
                Fully Paid
                <span className="count-badge">{statusCounts.paid}</span>
              </StatusRadioLabel>

              <StatusRadioLabel 
                checked={statusFilter === 'all'}
                activeBorder="#4B9EB0"
                activeBg="#f0fdfa"
                activeColor="#0f766e"
              >
                <input 
                  type="radio" 
                  name="statusFilter" 
                  value="all"
                  checked={statusFilter === 'all'} 
                  onChange={() => setStatusFilter('all')} 
                />
                All
                <span className="count-badge">{statusCounts.all}</span>
              </StatusRadioLabel>
            </StatusRadioGroup>
          </FilterTopRow>

          <FilterBottomRow>
            <SearchWrapper>
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search by Name, Phone, Patient ID, Barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>

            <DateControls>
              <span className="date-label">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <span className="date-label">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />

              {(fromDate || toDate) && (
                <Button 
                  variant="secondary" 
                  onClick={() => { setFromDate(''); setToDate(''); }}
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  Clear Date
                </Button>
              )}

              <ViewToggle style={{ marginLeft: '6px' }}>
                <ViewToggleButton 
                  active={viewMode === 'grouped'} 
                  onClick={() => setViewMode('grouped')}
                  title="View grouped by Date"
                >
                  <CalendarRange size={12} /> Date-wise
                </ViewToggleButton>
                <ViewToggleButton 
                  active={viewMode === 'flat'} 
                  onClick={() => setViewMode('flat')}
                  title="View as Flat List"
                >
                  <List size={12} /> List
                </ViewToggleButton>
              </ViewToggle>
            </DateControls>
          </FilterBottomRow>
        </FilterSection>
      </TopSection>

      {/* Main Table View */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
            <div>Loading records...</div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
              No Patients Found for the Selected Filter
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              {statusFilter === 'pending'
                ? "There are currently no pending due patients."
                : `No patients matching status "${statusFilter}" for the selected date range.`}
            </div>
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th className="text-left" style={{ width: '130px' }}>Barcode / ID</th>
                  <th className="text-left">Patient Details</th>
                  <th className="text-left">Contact</th>
                  <th className="text-left">Registration Date</th>
                  <th className="text-right">Total Bill</th>
                  <th className="text-right">Paid Amount</th>
                  <th className="text-right" style={{ width: '130px' }}>Current Due</th>
                  <th className="text-center">Status</th>
                  <th className="text-center" style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {viewMode === 'grouped' ? (
                  dateWiseGroups.map((group) => (
                    <React.Fragment key={group.dateKey}>
                      <DateGroupHeaderRow>
                        <td colSpan="9">
                          <DateGroupBadge>
                            <div className="date-title">
                              <Calendar size={14} color="#4B9EB0" />
                              <span>{formatDateDisplay(group.dateKey)}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
                                ({group.items.length} {group.items.length === 1 ? 'patient' : 'patients'})
                              </span>
                            </div>
                            <div className="date-meta">
                              <span>Total Billed: <strong>{formatCurrency(group.totalBilled)}</strong></span>
                              <span>Date Due: <strong className="meta-highlight">{formatCurrency(group.totalDue)}</strong></span>
                            </div>
                          </DateGroupBadge>
                        </td>
                      </DateGroupHeaderRow>

                      {group.items.map((patient) => {
                        const paidNum = parseFloat(patient.paid_amount || 0);
                        const dueNum = parseFloat(patient.due_amount || 0);
                        const hasPayments = patient.payments && patient.payments.some(p => p && p.mode !== 'Due' && parseFloat(p.amount || 0) > 0);

                        return (
                          <tr key={patient.barcode}>
                            <td className="text-left">
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <BarcodeChip>{patient.barcode}</BarcodeChip>
                                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                  {patient.patient_info?.patient_id || 'N/A'}
                                </span>
                              </div>
                            </td>

                            <td className="text-left">
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                                {patient.patient_info?.patientname || 'Unknown Patient'}
                              </div>
                            </td>

                            <td className="text-left">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.82rem' }}>
                                <Phone size={12} color="#64748b" />
                                {patient.patient_info?.phoneNumber || 'N/A'}
                              </div>
                            </td>

                            <td className="text-left">
                              <span style={{ color: '#475569', fontSize: '0.82rem' }}>
                                {formatDateTimeDisplay(patient.registrationDate)}
                              </span>
                            </td>

                            <td className="text-right">
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>
                                {formatCurrency(patient.netAmount)}
                              </span>
                            </td>

                            <td className="text-right">
                              {paidNum > 0 ? (
                                <PaidPill>{formatCurrency(patient.paid_amount)}</PaidPill>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>₹0.00</span>
                              )}
                            </td>

                            <td className="text-right">
                              <DuePill isZero={dueNum <= 0.01}>{formatCurrency(patient.due_amount)}</DuePill>
                            </td>

                            <td className="text-center">
                              <StatusBadge status={patient.payment_status}>
                                {patient.payment_status}
                              </StatusBadge>
                            </td>

                            <td className="text-center">
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                {dueNum > 0.01 ? (
                                  <Button 
                                    variant="primary" 
                                    onClick={() => handleOpenCollectModal(patient)}
                                    title="Collect Pending Due"
                                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                  >
                                    <DollarSign size={12} /> Pay Due
                                  </Button>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', padding: '3px 6px' }}>
                                    ✓ Settled
                                  </span>
                                )}

                                {hasPayments && (
                                  <Button 
                                    variant="secondary" 
                                    onClick={() => handleOpenHistoryModal(patient)}
                                    title="View Payment History"
                                    style={{ padding: '3px 7px', fontSize: '0.75rem' }}
                                  >
                                    <History size={12} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))
                ) : (
                  filteredPatients.map((patient) => {
                    const paidNum = parseFloat(patient.paid_amount || 0);
                    const dueNum = parseFloat(patient.due_amount || 0);
                    const hasPayments = patient.payments && patient.payments.some(p => p && p.mode !== 'Due' && parseFloat(p.amount || 0) > 0);

                    return (
                      <tr key={patient.barcode}>
                        <td className="text-left">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <BarcodeChip>{patient.barcode}</BarcodeChip>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {patient.patient_info?.patient_id || 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td className="text-left">
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {patient.patient_info?.patientname || 'Unknown Patient'}
                          </div>
                        </td>

                        <td className="text-left">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.82rem' }}>
                            <Phone size={12} color="#64748b" />
                            {patient.patient_info?.phoneNumber || 'N/A'}
                          </div>
                        </td>

                        <td className="text-left">
                          <span style={{ color: '#475569', fontSize: '0.82rem' }}>
                            {formatDateTimeDisplay(patient.registrationDate)}
                          </span>
                        </td>

                        <td className="text-right">
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>
                            {formatCurrency(patient.netAmount)}
                          </span>
                        </td>

                        <td className="text-right">
                          {paidNum > 0 ? (
                            <PaidPill>{formatCurrency(patient.paid_amount)}</PaidPill>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>₹0.00</span>
                          )}
                        </td>

                        <td className="text-right">
                          <DuePill isZero={dueNum <= 0.01}>{formatCurrency(patient.due_amount)}</DuePill>
                        </td>

                        <td className="text-center">
                          <StatusBadge status={patient.payment_status}>
                            {patient.payment_status}
                          </StatusBadge>
                        </td>

                        <td className="text-center">
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {dueNum > 0.01 ? (
                              <Button 
                                variant="primary" 
                                onClick={() => handleOpenCollectModal(patient)}
                                title="Collect Pending Due"
                                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                              >
                                <DollarSign size={12} /> Pay Due
                              </Button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', padding: '3px 6px' }}>
                                ✓ Settled
                              </span>
                            )}

                            {hasPayments && (
                              <Button 
                                variant="secondary" 
                                onClick={() => handleOpenHistoryModal(patient)}
                                title="View Payment History"
                                style={{ padding: '3px 7px', fontSize: '0.75rem' }}
                              >
                                <History size={12} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </TableCard>

      {/* Collect Due Payment Modal */}
      {isModalOpen && selectedPatient && (
        <ModalOverlay onClick={handleCloseCollectModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3><DollarSign size={18} color="#4B9EB0" /> Record Due Clearance</h3>
              <button 
                onClick={handleCloseCollectModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </ModalHeader>

            <form onSubmit={handlePaymentSubmit}>
              <ModalBody>
                <PatientSummaryBox>
                  <div>
                    <div className="p-name">{selectedPatient.patient_info?.patientname || 'Patient'}</div>
                    <div className="p-sub">Barcode: {selectedPatient.barcode} | ID: {selectedPatient.patient_info?.patient_id || 'N/A'}</div>
                  </div>
                  <div className="p-due">
                    <div className="due-lbl">Outstanding Due</div>
                    <div className="due-val">{formatCurrency(selectedPatient.due_amount)}</div>
                  </div>
                </PatientSummaryBox>

                <FormGroup>
                  <label>Amount Being Paid (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={parseFloat(selectedPatient.due_amount || 0)}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 500)"
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(selectedPatient.due_amount)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#475569'
                      }}
                    >
                      Pay Full Due ({formatCurrency(selectedPatient.due_amount)})
                    </button>
                  </div>
                </FormGroup>

                <FormGroup>
                  <label>Payment Mode *</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Remarks / Notes</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Due Clearance, Counter Payment"
                  />
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button type="button" variant="secondary" onClick={handleCloseCollectModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Confirm Payment'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Payment History Modal */}
      {historyModalOpen && historyPatient && (() => {
        const clearancePayments = (historyPatient.payments || []).filter(
          p => p && p.mode !== 'Due' && parseFloat(p.amount || 0) > 0
        );

        return (
          <ModalOverlay onClick={handleCloseHistoryModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3><History size={18} color="#4B9EB0" /> Payment & Clearance History</h3>
                <button 
                  onClick={handleCloseHistoryModal}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </ModalHeader>

              <ModalBody>
                <PatientSummaryBox>
                  <div>
                    <div className="p-name">{historyPatient.patient_info?.patientname}</div>
                    <div className="p-sub">Barcode: {historyPatient.barcode}</div>
                  </div>
                  <div className="p-due">
                    <div className="due-lbl">Remaining Due</div>
                    <div className="due-val">{formatCurrency(historyPatient.due_amount)}</div>
                  </div>
                </PatientSummaryBox>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginTop: '6px' }}>
                  Cleared Payments History
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {clearancePayments.length > 0 ? (
                    clearancePayments.map((p, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            Mode: {p.mode || 'Cash'} {p.remarks ? `• ${p.remarks}` : ''}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {p.date ? formatDateTimeDisplay(p.date) : 'Payment Date'}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#059669' }}>
                          + {formatCurrency(p.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '16px', fontSize: '0.82rem' }}>
                      No clearance payments recorded yet.
                    </div>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button type="button" variant="secondary" onClick={handleCloseHistoryModal}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        );
      })()}
    </Container>
  );
}