import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { 
  Users, UserCheck, Search, Filter, RefreshCw, Download, 
  Edit3, Phone, Mail, MapPin, Calendar, CheckCircle2, 
  XCircle, ChevronLeft, ChevronRight, User, AlertCircle, 
  Building2, Hash, ArrowUpDown, ArrowUp, ArrowDown, X, Save
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
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
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
  min-width: 260px;
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

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  select {
    padding: 5px 10px;
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

const EditPatientButton = styled.button`
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  color: #0f766e;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;

  &:hover {
    background: #4B9EB0;
    color: white;
    border-color: #4B9EB0;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(75, 158, 176, 0.2);
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
  min-width: 900px;

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

const PatientAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.bg || '#e0f2fe'};
  color: ${props => props.color || '#0369a1'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const GenderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;

  ${props => props.gender === 'Male' && `
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
  `}

  ${props => props.gender === 'Female' && `
    background: #fce7f3;
    color: #be185d;
    border: 1px solid #fbcfe8;
  `}

  ${props => props.gender !== 'Male' && props.gender !== 'Female' && `
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  `}
`;

const IdBadge = styled.span`
  font-family: monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
  border: 1px solid #e2e8f0;
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

// --- Edit Patient Modal Styles ---
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
  max-width: 600px;
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

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 1.05rem;
      color: #0f172a;
      font-weight: 700;
    }
    p {
      margin: 2px 0 0 0;
      font-size: 0.75rem;
      color: #64748b;
    }
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

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .section-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #475569;
  }

  input, select {
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #1e293b;
    outline: none;
    font-family: inherit;
    transition: border 0.15s;

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

const AlertToast = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.type === 'success' ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#047857' : '#dc2626'};
  border: 1px solid ${props => props.type === 'success' ? '#a7f3d0' : '#fecaca'};
`;

export default function PatientEditForm() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortField, setSortField] = useState("patientname");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    patientname: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: "",
    city: "",
    area: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
  const franchiseId = localStorage.getItem('franchise_id') || 'SHF004';

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${franchiseurl}allpatients/?franchise_id=${franchiseId}`);
      setPatients(res.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Unique cities list for city filter dropdown
  const uniqueCities = useMemo(() => {
    const set = new Set();
    patients.forEach(p => {
      if (p.city && p.city.trim()) set.add(p.city.trim());
    });
    return Array.from(set).sort();
  }, [patients]);

  // Filtered and Sorted Patients
  const filteredPatients = useMemo(() => {
    let list = patients.filter((patient) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (patient.patientname || '').toLowerCase().includes(q) ||
        (patient.phoneNumber || '').includes(q) ||
        (patient.patient_id || '').toLowerCase().includes(q) ||
        (patient.city || '').toLowerCase().includes(q) ||
        (patient.area || '').toLowerCase().includes(q);

      const matchesGender = !genderFilter || patient.gender === genderFilter;
      const matchesCity = !cityFilter || (patient.city || '').trim().toLowerCase() === cityFilter.toLowerCase();

      return matchesSearch && matchesGender && matchesCity;
    });

    list.sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      if (sortDirection === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    return list;
  }, [patients, searchTerm, genderFilter, cityFilter, sortField, sortDirection]);

  // Pagination slice
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPatients.slice(startIndex, startIndex + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Summary statistics
  const stats = useMemo(() => {
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;

    patients.forEach(p => {
      if (p.gender === 'Male') maleCount++;
      else if (p.gender === 'Female') femaleCount++;
      else otherCount++;
    });

    return {
      total: patients.length,
      male: maleCount,
      female: femaleCount,
      other: otherCount
    };
  }, [patients]);

  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      patientname: patient.patientname || "",
      age: patient.age !== undefined && patient.age !== null ? patient.age : "",
      gender: patient.gender || "",
      phoneNumber: patient.phoneNumber || "",
      email: patient.email || "",
      city: patient.city || "",
      area: patient.area || "",
      pincode: patient.pincode || "",
    });
    setToastMessage(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPatient(null);
    setToastMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);
    setToastMessage(null);

    try {
      await axios.put(`${franchiseurl}updatepatient/${selectedPatient.patient_id}/`, formData);
      
      // Update locally
      setPatients(prev => prev.map(p => p.patient_id === selectedPatient.patient_id ? { ...p, ...formData } : p));
      
      setToastMessage({ type: 'success', text: 'Patient details updated successfully!' });
      setTimeout(() => {
        handleCloseEditModal();
      }, 1000);
    } catch (error) {
      console.error("Error updating patient:", error);
      setToastMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update patient. Please check your inputs.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredPatients.length === 0) {
      alert("No patient records to export");
      return;
    }

    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'City', 'Area', 'Pincode'];
    const rows = filteredPatients.map(p => [
      p.patient_id || '',
      `"${(p.patientname || '').replace(/"/g, '""')}"`,
      p.age || '',
      p.gender || '',
      p.phoneNumber || '',
      p.email || '',
      `"${(p.city || '').replace(/"/g, '""')}"`,
      `"${(p.area || '').replace(/"/g, '""')}"`,
      p.pincode || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Patients_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.replace(/^(Mr|Mrs|Ms|Dr|Master)\.?\s+/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <Container>
      <TopSection>
        <Header>
          <TitleGroup>
            <h1><Users size={22} color="#4B9EB0" /> Patient Management & Directory</h1>
            <p>Search, review, and edit patient demographics, contacts, and addresses</p>
          </TitleGroup>

          <HeaderActions>
            <Button variant="outline" onClick={handleExportCSV} title="Export directory to CSV">
              <Download size={13} /> Export CSV
            </Button>
            <Button variant="secondary" onClick={fetchPatients} title="Refresh patient records">
              <RefreshCw size={13} /> Refresh
            </Button>
          </HeaderActions>
        </Header>

        {/* 4 Responsive Stat Cards */}
        <StatsGrid>
          <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
            <div className="stat-info">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-icon"><Users size={17} /></div>
          </StatCard>

          <StatCard iconBg="#dbeafe" iconColor="#2563eb" valueColor="#1d4ed8">
            <div className="stat-info">
              <div className="stat-label">Male Patients</div>
              <div className="stat-value">{stats.male}</div>
            </div>
            <div className="stat-icon"><User size={17} /></div>
          </StatCard>

          <StatCard iconBg="#fce7f3" iconColor="#db2777" valueColor="#be185d">
            <div className="stat-info">
              <div className="stat-label">Female Patients</div>
              <div className="stat-value">{stats.female}</div>
            </div>
            <div className="stat-icon"><User size={17} /></div>
          </StatCard>

          <StatCard iconBg="#f1f5f9" iconColor="#475569" valueColor="#334155">
            <div className="stat-info">
              <div className="stat-label">Other / Unspecified</div>
              <div className="stat-value">{stats.other}</div>
            </div>
            <div className="stat-icon"><UserCheck size={17} /></div>
          </StatCard>
        </StatsGrid>

        {/* Search & Filter Controls */}
        <FilterSection>
          <SearchWrapper>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Name, Phone, Patient ID, Area, City..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </SearchWrapper>

          <FilterControls>
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {uniqueCities.length > 0 && (
              <select
                value={cityFilter}
                onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Cities ({uniqueCities.length})</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}

            {(searchTerm || genderFilter || cityFilter) && (
              <Button 
                variant="secondary" 
                onClick={() => { setSearchTerm(""); setGenderFilter(""); setCityFilter(""); setCurrentPage(1); }}
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                Clear Filters
              </Button>
            )}
          </FilterControls>
        </FilterSection>
      </TopSection>

      {/* Main Table Card */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
            <div>Loading patient records...</div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <Users size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
              No Patients Found
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              No patient records match the specified search or filter criteria.
            </div>
          </div>
        ) : (
          <>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: '120px' }} onClick={() => handleSort("patient_id")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Patient ID 
                        {sortField === 'patient_id' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>

                    <th onClick={() => handleSort("patientname")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Patient Name
                        {sortField === 'patientname' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>

                    <th style={{ width: '90px' }} onClick={() => handleSort("age")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Age
                        {sortField === 'age' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>

                    <th style={{ width: '100px' }} onClick={() => handleSort("gender")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Gender
                        {sortField === 'gender' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>

                    <th>Contact Phone</th>
                    <th>Email</th>

                    <th onClick={() => handleSort("city")}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Location / Address
                        {sortField === 'city' ? (sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} color="#94a3b8" />}
                      </div>
                    </th>

                    <th style={{ textAlign: 'center', width: '110px' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPatients.map((patient) => {
                    const initials = getInitials(patient.patientname);
                    const isMale = patient.gender === 'Male';
                    const isFemale = patient.gender === 'Female';

                    return (
                      <tr key={patient.patient_id}>
                        <td>
                          <IdBadge>#{patient.patient_id}</IdBadge>
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PatientAvatar 
                              bg={isMale ? '#e0f2fe' : (isFemale ? '#fce7f3' : '#f1f5f9')}
                              color={isMale ? '#0284c7' : (isFemale ? '#be185d' : '#475569')}
                            >
                              {initials}
                            </PatientAvatar>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              {patient.patientname || 'Unnamed Patient'}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: '#334155' }}>
                            {patient.age ? `${patient.age} yrs` : 'N/A'}
                          </span>
                        </td>

                        <td>
                          <GenderBadge gender={patient.gender}>
                            {patient.gender || 'Unknown'}
                          </GenderBadge>
                        </td>

                        <td>
                          {patient.phoneNumber ? (
                            <a 
                              href={`tel:${patient.phoneNumber}`} 
                              style={{ 
                                color: '#0369a1', 
                                textDecoration: 'none', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                fontWeight: 600
                              }}
                            >
                              <Phone size={12} /> {patient.phoneNumber}
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>—</span>
                          )}
                        </td>

                        <td>
                          {patient.email ? (
                            <span style={{ color: '#475569', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} color="#94a3b8" /> {patient.email}
                            </span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '0.82rem' }}>
                            <MapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
                            <span>
                              {[patient.area, patient.city, patient.pincode].filter(Boolean).join(', ') || 'No address specified'}
                            </span>
                          </div>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <EditPatientButton 
                            onClick={() => handleOpenEditModal(patient)}
                            title="Edit patient demographics and address"
                          >
                            <Edit3 size={12} /> Edit
                          </EditPatientButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrapper>

            {/* Pagination Bar */}
            <PaginationFooter>
              <div>
                Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, filteredPatients.length)}</strong> to <strong>{Math.min(currentPage * pageSize, filteredPatients.length)}</strong> of <strong>{filteredPatients.length}</strong> patients
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

      {/* Edit Patient Modal */}
      {isEditModalOpen && selectedPatient && (
        <ModalOverlay onClick={handleCloseEditModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div className="header-left">
                <PatientAvatar 
                  bg={formData.gender === 'Female' ? '#fce7f3' : '#e0f2fe'}
                  color={formData.gender === 'Female' ? '#be185d' : '#0284c7'}
                  style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                >
                  {getInitials(formData.patientname)}
                </PatientAvatar>
                <div>
                  <h3>Edit Patient Information</h3>
                  <p>Patient ID: <IdBadge>#{selectedPatient.patient_id}</IdBadge></p>
                </div>
              </div>
              <button onClick={handleCloseEditModal}><X size={18} /></button>
            </ModalHeader>

            <form onSubmit={handleUpdatePatient}>
              <ModalBody>
                {toastMessage && (
                  <AlertToast type={toastMessage.type}>
                    {toastMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{toastMessage.text}</span>
                  </AlertToast>
                )}

                {/* Section 1: Demographics */}
                <FormSection>
                  <div className="section-title"><User size={13} color="#4B9EB0" /> Demographics</div>
                  <FormGrid>
                    <FormGroup fullWidth>
                      <label>Patient Full Name *</label>
                      <input
                        type="text"
                        name="patientname"
                        required
                        value={formData.patientname}
                        onChange={handleInputChange}
                        placeholder="e.g. Mr. John Doe"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Age (Years) *</label>
                      <input
                        type="number"
                        name="age"
                        required
                        min="0"
                        max="130"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="e.g. 28"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Gender *</label>
                      <select
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                {/* Section 2: Contact Details */}
                <FormSection>
                  <div className="section-title"><Phone size={13} color="#4B9EB0" /> Contact Details</div>
                  <FormGrid>
                    <FormGroup>
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. patient@example.com"
                      />
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                {/* Section 3: Address & Location */}
                <FormSection>
                  <div className="section-title"><MapPin size={13} color="#4B9EB0" /> Address & Location</div>
                  <FormGrid>
                    <FormGroup>
                      <label>City / Town</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Salem"
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Area / Street</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g. Mecheri"
                      />
                    </FormGroup>

                    <FormGroup fullWidth>
                      <label>Pincode / Postal Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="e.g. 636453"
                      />
                    </FormGroup>
                  </FormGrid>
                </FormSection>
              </ModalBody>

              <ModalFooter>
                <Button type="button" variant="secondary" onClick={handleCloseEditModal}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSubmitting}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Save size={13} /> {isSubmitting ? 'Saving Changes...' : 'Save Patient Details'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}