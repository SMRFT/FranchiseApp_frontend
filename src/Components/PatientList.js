import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import headerImage from "./images/Header.png";
import FooterImage from "./images/Footer.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  FileText, Users, Calendar, DollarSign, Search, 
  Download, Share2, RefreshCw, ChevronDown, ChevronRight,
  User, Phone, Barcode, CheckCircle2, XCircle, AlertCircle,
  Clock, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, Layers
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

  ${props => props.variant === 'success' && `
    background: #10b981;
    color: white;
    border-color: #10b981;
    &:hover { background: #059669; }
  `}

  ${props => props.variant === 'whatsapp' && `
    background: #25d366;
    color: white;
    border-color: #25d366;
    &:hover { background: #128c7e; }
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
  min-width: 950px;

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
    cursor: ${props => props.sortable ? 'pointer' : 'default'};
    user-select: none;

    &:hover {
      background: ${props => props.sortable ? '#f1f5f9' : '#f8fafc'};
    }
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

const SegmentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${props => props.segment === 'Home Collection' ? '#fef3c7' : '#e0f2fe'};
  color: ${props => props.segment === 'Home Collection' ? '#b45309' : '#0369a1'};
  border: 1px solid ${props => props.segment === 'Home Collection' ? '#fde68a' : '#bae6fd'};
`;

const ExpandedRow = styled.tr`
  background: #f8fafc;
  td {
    padding: 12px 16px !important;
    background: #f8fafc !important;
    border-bottom: 2px solid #e2e8f0 !important;
  }
`;

const TestListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 700px;
`;

const TestItemBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid ${props => props.cancelled ? '#fecaca' : '#e2e8f0'};
  font-size: 0.8rem;
`;

const CancelBadge = styled.span`
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
`;

const PaginationFooter = styled.div`
  padding: 8px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.78rem;
  color: #64748b;
`;

// Helper functions
const getCurrentDate = () => new Date().toISOString().split("T")[0];

const parseTestDetails = (testdetailsString) => {
  try {
    if (typeof testdetailsString === "string") {
      return JSON.parse(testdetailsString);
    } else if (Array.isArray(testdetailsString)) {
      return testdetailsString;
    }
    return [];
  } catch {
    return [];
  }
};

const formatCurrency = (val) => {
  const num = parseFloat(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function PatientList() {
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState("registrationDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
  const franchiseId = localStorage.getItem("franchise_id") || "SHF004";

  const handleFetch = async () => {
    if (!franchiseId || !startDate || !endDate) return;

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${franchiseurl}registrations/`, {
        params: {
          franchise_id: franchiseId,
          start_date: startDate,
          end_date: endDate,
        },
      });
      setData(response.data || []);
      setCurrentPage(1);
      setExpandedRows(new Set());
    } catch (error) {
      console.error("Error fetching patient registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      handleFetch();
    }
  }, []);

  const handleClearDates = () => {
    const today = getCurrentDate();
    setStartDate(today);
    setEndDate(today);
    setSearchQuery("");
    setCurrentPage(1);
    setExpandedRows(new Set());
  };

  const toggleRow = (item) => {
    const rowKey = `${item.patient_id || item.patient}-${item.registrationDate}-${item.barcode}`;
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const handleCancelTest = async (item, testId) => {
    if (item.billing_status === "Pending") {
      alert("Cannot cancel test while billing status is 'Pending'. Test cancellation is only available for Billed records.");
      return;
    }

    try {
      await axios.patch(`${franchiseurl}test-cancel-request/`, {
        patient_id: item.patient_id || item.patient,
        created_date: item.created_date || item.registrationDate,
        barcode: item.barcode,
        franchise_id: franchiseId || item.franchise_id,
        test_ids: [testId],
      });

      const createdDate = item.created_date || item.registrationDate;
      setData(prevData =>
        prevData.map(p =>
          (p.patient_id === item.patient_id || p.patient === item.patient) && (p.created_date || p.registrationDate) === createdDate && p.barcode === item.barcode
            ? {
                ...p,
                testdetails: parseTestDetails(p.testdetails).map(t =>
                  t.test_id === testId ? { ...t, status: "Cancel Requested" } : t
                ),
              }
            : p
        )
      );
      alert("Cancellation request submitted successfully.");
    } catch (error) {
      console.error("Error requesting cancellation:", error);
      const msg = error.response?.data?.error || "Failed to request test cancellation.";
      alert(msg);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      const pid = (item.patient_id || item.patient || '').toLowerCase();
      const pname = (item.patient_info?.patientname || '').toLowerCase();
      const phone = (item.patient_info?.phoneNumber || '').toLowerCase();
      const barcode = (item.barcode || '').toLowerCase();
      return pid.includes(query) || pname.includes(query) || phone.includes(query) || barcode.includes(query);
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "patientname") {
        aVal = a.patient_info?.patientname || "";
        bVal = b.patient_info?.patientname || "";
      }
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
      if (sortDirection === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });

    return filtered;
  }, [data, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const stats = useMemo(() => {
    let rev = 0;
    let tests = 0;
    data.forEach(item => {
      rev += parseFloat(item.netAmount || 0);
      tests += parseTestDetails(item.testdetails).length;
    });
    return {
      totalRegistrations: data.length,
      totalRevenue: rev,
      totalTests: tests
    };
  }, [data]);

  // PDF Generation Helper
  const generatePDFBlob = (item) => {
    const testDetails = parseTestDetails(item.testdetails || "[]");
    const patientName = (item.patient_info?.patientname || "N/A").trim();
    const patientId = item.patient || item.patient_id || "N/A";

    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;
    const contentWidth = pageWidth - margin * 2;

    try {
      doc.addImage(headerImage, "PNG", 0, 0, pageWidth, 80);
    } catch {}

    let cursorY = 92;
    doc.setFillColor(221, 231, 255);
    doc.roundedRect(margin, cursorY, contentWidth, 34, 4, 4, "F");
    doc.setTextColor(75, 158, 176);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT BILL / INVOICE", pageWidth / 2, cursorY + 22, { align: "center" });

    cursorY += 46;
    const boxHeight = 90;
    const boxWidth = (contentWidth / 2) - 8;

    // Left box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, cursorY, boxWidth, boxHeight, 4, 4, "F");
    doc.setFontSize(9);
    doc.setTextColor(45, 55, 72);
    doc.text(`Patient Name: ${patientName}`, margin + 10, cursorY + 22);
    doc.text(`Patient ID: ${patientId}`, margin + 10, cursorY + 40);
    doc.text(`Contact: ${item.patient_info?.phoneNumber || 'N/A'}`, margin + 10, cursorY + 58);

    // Right box
    const rx = margin + boxWidth + 16;
    doc.roundedRect(rx, cursorY, boxWidth, boxHeight, 4, 4, "F");
    doc.text(`Barcode: ${item.barcode || 'N/A'}`, rx + 10, cursorY + 22);
    doc.text(`Date: ${new Date(item.registrationDate || new Date()).toLocaleDateString()}`, rx + 10, cursorY + 40);
    doc.text(`Segment: ${item.segment || 'Walk-in'}`, rx + 10, cursorY + 58);

    cursorY += boxHeight + 16;

    const tableBody = testDetails.map((t, idx) => [
      idx + 1,
      t.test_name || t.testname || "Diagnostic Test",
      `Rs. ${parseFloat(t.MRP || 0).toFixed(2)}`,
      t.status || 'Active'
    ]);

    autoTable(doc, {
      startY: cursorY,
      head: [["#", "Test Name", "Amount", "Status"]],
      body: tableBody,
      theme: "grid",
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [75, 158, 176], textColor: 255 },
      styles: { fontSize: 9 }
    });

    try {
      doc.addImage(FooterImage, "PNG", 0, pageHeight - 60, pageWidth, 60);
    } catch {}

    return doc.output('blob');
  };

  const handleDownloadPdf = (item) => {
    try {
      const blob = generatePDFBlob(item);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bill_${item.barcode || item.patient_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Could not generate PDF");
    }
  };

  const handleSendViaWhatsApp = async (item) => {
    const phoneNumber = item.patient_info?.phoneNumber || '';
    if (!phoneNumber) {
      alert('Phone number not available for this patient');
      return;
    }

    try {
      const blob = generatePDFBlob(item);
      const formData = new FormData();
      formData.append('file', blob, `Bill_${item.barcode}.pdf`);

      const uploadRes = await axios.post(`${franchiseurl}upload-pdf/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (uploadRes.data?.file_url) {
        const contact = phoneNumber.replace(/\D/g, '');
        await axios.post(`${franchiseurl}send-whatsapp-template/`, {
          contact: contact.startsWith('91') ? contact : `91${contact}`,
          name: item.patient_info?.patientname || 'Patient',
          amount: item.netAmount || '0.00',
          link: uploadRes.data.file_url,
          template: "franchise_bill1"
        });
        alert('Bill sent via WhatsApp successfully!');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send bill via WhatsApp');
    }
  };

  return (
    <Container>
      <TopSection>
        <Header>
          <TitleGroup>
            <h1><FileText size={22} color="#4B9EB0" /> Patient Test Directory & Billing</h1>
            <p>Track registrations, view test details, download invoices, and send receipts</p>
          </TitleGroup>

          <HeaderActions>
            <Button variant="secondary" onClick={handleFetch} title="Refresh records">
              <RefreshCw size={13} /> Refresh
            </Button>
          </HeaderActions>
        </Header>

        {/* 3 Responsive Stat Cards */}
        <StatsGrid>
          <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
            <div className="stat-info">
              <div className="stat-label">Total Registrations</div>
              <div className="stat-value">{stats.totalRegistrations}</div>
            </div>
            <div className="stat-icon"><Users size={17} /></div>
          </StatCard>

          <StatCard iconBg="#dbeafe" iconColor="#2563eb" valueColor="#1d4ed8">
            <div className="stat-info">
              <div className="stat-label">Total Tests Billed</div>
              <div className="stat-value">{stats.totalTests}</div>
            </div>
            <div className="stat-icon"><Layers size={17} /></div>
          </StatCard>

          <StatCard iconBg="#dcfce7" iconColor="#15803d" valueColor="#15803d">
            <div className="stat-info">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
            </div>
            <div className="stat-icon"><DollarSign size={17} /></div>
          </StatCard>
        </StatsGrid>

        {/* Search & Filter Section */}
        <FilterSection>
          <SearchWrapper>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Patient Name, ID, Phone, Barcode..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </SearchWrapper>

          <DateControls>
            <span className="date-label">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <span className="date-label">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <Button variant="primary" onClick={handleFetch} disabled={loading}>
              Fetch
            </Button>

            <Button variant="secondary" onClick={handleClearDates}>
              Reset
            </Button>
          </DateControls>
        </FilterSection>
      </TopSection>

      {/* Main Table Card */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
            <div>Loading registrations...</div>
          </div>
        ) : filteredAndSortedData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <FileText size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
              No Registrations Found
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              No patient records match the selected date range or search query.
            </div>
          </div>
        ) : (
          <>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Tests</th>
                    <th onClick={() => handleSort("patient")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Patient ID
                        {sortField === 'patient' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>
                    <th onClick={() => handleSort("patientname")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Patient Name
                        {sortField === 'patientname' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>
                    <th>Contact Phone</th>
                    <th>Barcode</th>
                    <th>Segment</th>
                    <th onClick={() => handleSort("registrationDate")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Date
                        {sortField === 'registrationDate' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>
                    <th style={{ textAlign: 'right' }}>Net Amount</th>
                    <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((item) => {
                    const testDetails = parseTestDetails(item.testdetails);
                    const rowKey = `${item.patient_id || item.patient}-${item.registrationDate}-${item.barcode}`;
                    const isExpanded = expandedRows.has(rowKey);

                    return (
                      <React.Fragment key={rowKey}>
                        <tr>
                          <td>
                            <Button 
                              variant={isExpanded ? "secondary" : "outline"} 
                              onClick={() => toggleRow(item)}
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              {testDetails.length} Tests
                            </Button>
                          </td>

                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>
                              #{item.patient || item.patient_id}
                            </span>
                          </td>

                          <td>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                              {item.patient_info?.patientname || 'Unnamed Patient'}
                            </div>
                          </td>

                          <td>
                            {item.patient_info?.phoneNumber ? (
                              <a href={`tel:${item.patient_info?.phoneNumber}`} style={{ color: '#0369a1', textDecoration: 'none', fontWeight: 600 }}>
                                {item.patient_info?.phoneNumber}
                              </a>
                            ) : 'N/A'}
                          </td>

                          <td>
                            <BarcodeChip>{item.barcode}</BarcodeChip>
                          </td>

                          <td>
                            <SegmentBadge segment={item.segment}>
                              {item.segment || 'Walk-in'}
                            </SegmentBadge>
                          </td>

                          <td>
                            {item.registrationDate ? new Date(item.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>

                          <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                            {formatCurrency(item.netAmount)}
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                              <Button 
                                variant="outline" 
                                onClick={() => handleDownloadPdf(item)}
                                title="Download Invoice PDF"
                                style={{ padding: '3px 6px' }}
                              >
                                <Download size={12} /> PDF
                              </Button>
                              <Button 
                                variant="whatsapp" 
                                onClick={() => handleSendViaWhatsApp(item)}
                                title="Send via WhatsApp"
                                style={{ padding: '3px 6px' }}
                              >
                                <Share2 size={12} /> WA
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Tests Sub-Row */}
                        {isExpanded && (
                          <ExpandedRow>
                            <td colSpan="9">
                              <TestListContainer>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                  Billed Tests ({testDetails.length}):
                                </div>
                                {testDetails.map((test, idx) => {
                                  const isCancelled = ["Cancel Requested", "Cancelled", "cancelled"].includes(test.status);
                                  return (
                                    <TestItemBox key={idx} cancelled={isCancelled}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: 600, color: '#1e293b' }}>
                                          {idx + 1}. {test.test_name || test.testname}
                                        </span>
                                        {isCancelled && <CancelBadge>Cancelled</CancelBadge>}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontWeight: 700, color: '#059669' }}>
                                          ₹{parseFloat(test.MRP || 0).toFixed(2)}
                                        </span>
                                        {!isCancelled && item.billing_status !== "Pending" && (
                                          <Button 
                                            variant="secondary"
                                            onClick={() => handleCancelTest(item, test.test_id)}
                                            style={{ padding: '2px 6px', fontSize: '0.7rem', color: '#dc2626' }}
                                          >
                                            Cancel Test
                                          </Button>
                                        )}
                                      </div>
                                    </TestItemBox>
                                  );
                                })}
                              </TestListContainer>
                            </td>
                          </ExpandedRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrapper>

            {/* Pagination Footer */}
            <PaginationFooter>
              <div>
                Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, filteredAndSortedData.length)}</strong> to <strong>{Math.min(currentPage * pageSize, filteredAndSortedData.length)}</strong> of <strong>{filteredAndSortedData.length}</strong> records
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem' }}>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.75rem', background: 'white' }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <div style={{ display: 'flex', gap: '4px', marginLeft: '6px' }}>
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '3px 8px' }}
                  >
                    <ChevronLeft size={13} /> Prev
                  </Button>

                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 6px', fontWeight: 600 }}>
                    {currentPage} / {totalPages}
                  </span>

                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '3px 8px' }}
                  >
                    Next <ChevronRight size={13} />
                  </Button>
                </div>
              </div>
            </PaginationFooter>
          </>
        )}
      </TableCard>
    </Container>
  );
}