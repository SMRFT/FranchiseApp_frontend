import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Plus, Trash2, FileText, CheckCircle, Clock, XCircle, Search, Eye, 
  Printer, Save, Package, RefreshCw, Layers, Edit2, Lock, MessageSquare, 
  MoreVertical, Calendar, Download, FileSpreadsheet, Box, ChevronDown, ArrowLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';

const Container = styled.div`
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media print {
    padding: 0;
    background: white;
    min-height: auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media print {
    display: none !important;
  }
`;

const TitleContainer = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  p {
    color: #64748b;
    margin: 4px 0 0 0;
    font-size: 0.9rem;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4B9EB0 0%, #368293 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(75, 158, 176, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #368293 0%, #286776 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(75, 158, 176, 0.35);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media print {
    display: none !important;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .stat-val {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .stat-lbl {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
    margin-top: 2px;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: visible;
  margin-bottom: 24px;

  @media print {
    display: none !important;
  }
`;

const FilterBar = styled.div`
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  input {
    width: 100%;
    padding: 8px 12px 8px 38px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.9rem;
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
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;

  input[type="date"] {
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.85rem;
    outline: none;
    color: #334155;
    background-color: white;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const SelectFilter = styled.select`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.9rem;
  outline: none;
  background-color: white;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;

  th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  td {
    padding: 14px 18px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
  }

  tr:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch (props.status) {
      case 'Approved':
        return 'background: #dcfce7; color: #15803d;';
      case 'Draft':
      default:
        return 'background: #f1f5f9; color: #475569;';
    }
  }}
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ThreeDotsButton = styled.button`
  background: white;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-width: 170px;
  z-index: 1050;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const DropdownItem = styled.button`
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  padding: 9px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.disabled ? '#94a3b8' : (props.danger ? '#ef4444' : '#334155')};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: background 0.15s;

  &:hover {
    background: ${props => props.disabled ? 'transparent' : (props.danger ? '#fee2e2' : '#f8fafc')};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media print {
    display: none !important;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: ${props => props.maxWidth || '850px'};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.25rem;
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
    &:hover { background: #f1f5f9; }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;

  th {
    background: #f1f5f9;
    color: #475569;
    font-size: 0.8rem;
    padding: 10px 12px;
    text-align: left;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;

    input {
      width: 100%;
      padding: 7px 10px;
      font-size: 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      outline: none;
      box-sizing: border-box;

      &:focus {
        border-color: #4B9EB0;
      }
    }
  }
`;

// Searchable Item Selector Dropdown Styles
const SearchSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchSelectInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 8px 30px 8px 10px;
    font-size: 0.88rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    outline: none;
    background: white;
    cursor: pointer;

    &:focus {
      border-color: #4B9EB0;
      box-shadow: 0 0 0 2px rgba(75, 158, 176, 0.15);
    }
  }

  .chevron-icon {
    position: absolute;
    right: 10px;
    color: #94a3b8;
    pointer-events: none;
  }
`;

const SearchSelectList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  z-index: 2100;
`;

const SearchSelectOption = styled.div`
  padding: 9px 12px;
  font-size: 0.88rem;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f8fafc;

  &:hover {
    background: #f1f5f9;
    color: #4B9EB0;
    font-weight: 500;
  }
`;

function ItemSearchSelector({ value, masterItems, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filtered = masterItems.filter(m => 
    (m.item_name || m.itemName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SearchSelectWrapper ref={wrapperRef}>
      <SearchSelectInput onClick={() => setIsOpen(true)}>
        <input 
          type="text"
          placeholder="Click or type to search item..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <ChevronDown size={16} className="chevron-icon" />
      </SearchSelectInput>

      {isOpen && (
        <SearchSelectList>
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#94a3b8' }}>
              No matching items found
            </div>
          ) : (
            filtered.map((item, idx) => (
              <SearchSelectOption
                key={item.item_id || idx}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const name = item.item_name || item.itemName;
                  setSearchTerm(name);
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                {item.item_name || item.itemName}
              </SearchSelectOption>
            ))
          )}
        </SearchSelectList>
      )}
    </SearchSelectWrapper>
  );
}

const TotalRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #e2e8f0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};

  ${props => props.variant === 'secondary' && `
    background: #e2e8f0;
    color: #334155;
    &:hover { background: ${props.disabled ? '#e2e8f0' : '#cbd5e1'}; }
  `}

  ${props => props.variant === 'outline' && `
    background: transparent;
    border: 1px solid #cbd5e1;
    color: #475569;
    &:hover { background: ${props.disabled ? 'transparent' : '#f1f5f9'}; }
  `}

  ${props => props.variant === 'primary' && `
    background: #4B9EB0;
    color: white;
    &:hover { background: ${props.disabled ? '#4B9EB0' : '#368293'}; }
  `}

  ${props => props.variant === 'success' && `
    background: #10b981;
    color: white;
    &:hover { background: ${props.disabled ? '#10b981' : '#059669'}; }
  `}

  ${props => props.variant === 'danger' && `
    background: #ef4444;
    color: white;
    &:hover { background: ${props.disabled ? '#ef4444' : '#dc2626'}; }
  `}
`;

// Paper Preview Component for Slip inside Modal
const SlipPreviewPaper = styled.div`
  background: white;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #000;
  font-family: 'Courier New', Courier, monospace, 'Segoe UI', Tahoma, sans-serif;
  font-size: 13px;
  line-height: 1.4;

  .double-divider {
    border-top: 3px double #000;
    margin: 10px 0;
  }

  .voucher-title {
    text-align: center;
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: 1px;
    padding: 4px 0;
    text-transform: uppercase;
  }

  .meta-grid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 14px 0 16px 0;
    font-size: 13px;

    .meta-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  }

  .voucher-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 13px;

    th {
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      padding: 6px 4px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 6px 4px;
      vertical-align: top;
    }

    .th-num, .td-num {
      text-align: right;
    }

    .th-center, .td-center {
      text-align: center;
    }
  }

  .summary-row {
    display: flex;
    justify-content: flex-end;
    padding: 8px 4px;
    font-weight: 700;
    font-size: 14px;
    border-top: 3px double #000;
    border-bottom: 3px double #000;
    margin-top: 12px;
    text-align: right;
  }
`;

// Hidden Printable Container for Window.print()
const PrintableVoucherContainer = styled.div`
  display: none;

  @media print {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    padding: 24px 32px !important;
    box-sizing: border-box !important;
    background: white !important;
    color: #000 !important;
    font-family: 'Courier New', Courier, monospace, 'Segoe UI', Tahoma, sans-serif !important;
    font-size: 13px !important;
    line-height: 1.4 !important;

    .double-divider {
      border-top: 3px double #000;
      margin: 10px 0;
    }

    .voucher-title {
      text-align: center;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: 1px;
      padding: 4px 0;
      text-transform: uppercase;
    }

    .meta-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 14px 0 16px 0;
      font-size: 13px;

      .meta-col {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
    }

    .voucher-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 13px;

      th {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        padding: 6px 4px;
        text-align: left;
        font-weight: 600;
      }

      td {
        padding: 6px 4px;
        vertical-align: top;
      }

      .th-num, .td-num {
        text-align: right;
      }

      .th-center, .td-center {
        text-align: center;
      }
    }

    .summary-row {
      display: flex;
      justify-content: flex-end;
      padding: 8px 4px;
      font-weight: 700;
      font-size: 14px;
      border-top: 3px double #000;
      border-bottom: 3px double #000;
      margin-top: 12px;
      text-align: right;
    }
  }
`;

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function MaterialIndent() {
  const [requisitions, setRequisitions] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(getTodayDateString());
  const [toDate, setToDate] = useState(getTodayDateString());
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [editingMrNumber, setEditingMrNumber] = useState(null);
  const [editedReasonInput, setEditedReasonInput] = useState('');
  const [selectedReqDetails, setSelectedReqDetails] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printVoucherData, setPrintVoucherData] = useState(null);
  const [activeDropdownMrNumber, setActiveDropdownMrNumber] = useState(null);

  const franchiseId = localStorage.getItem('franchise_id') || 'FRAN-001';
  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

  const [formItems, setFormItems] = useState([]);

  // Fetch Master Items from HMS Database (department: DPT00002)
  const fetchMasterItems = async () => {
    try {
      const res = await fetch(`${franchiseurl}material-items/?department=DPT00002`);
      if (res.ok) {
        const data = await res.json();
        setMasterItems(data);
      }
    } catch (err) {
      console.error("Error fetching master items:", err);
    }
  };

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      let queryUrl = `${franchiseurl}material-requisitions/?franchise_id=${franchiseId}`;
      if (fromDate) queryUrl += `&from_date=${fromDate}`;
      if (toDate) queryUrl += `&to_date=${toDate}`;
      if (statusFilter) queryUrl += `&status=${statusFilter}`;

      const res = await fetch(queryUrl);
      if (res.ok) {
        const data = await res.json();
        setRequisitions(data);
      }
    } catch (err) {
      console.error("Error fetching material requisitions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
    fetchMasterItems();
  }, [fromDate, toDate, statusFilter]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.action-dropdown-container')) {
        setActiveDropdownMrNumber(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleOpenNewModal = () => {
    setEditingMrNumber(null);
    setEditedReasonInput('');
    setFormItems([{ item_id: '', item_name: '', available_quantity: 0, quantity: 0, amount: 0 }]);
    setIsPreviewModalOpen(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (req) => {
    if (req.status === 'Approved') {
      alert("Approved requisitions are locked from editing.");
      return;
    }
    setActiveDropdownMrNumber(null);
    setEditingMrNumber(req.mr_number);
    setEditedReasonInput(req.edited_reason || '');
    const existingItems = req.items && req.items.length > 0 ? req.items.map((i, idx) => {
      const matched = masterItems.find(m => m.item_id === i.item_id || (m.item_name && m.item_name.toLowerCase() === (i.item_name || '').toLowerCase()));
      const availQty = matched ? (matched.available_quantity !== undefined ? matched.available_quantity : ((matched.total_quantity || 0) - (matched.approved_quantity || 0))) : '-';
      return {
        item_id: i.item_id || '',
        item_name: i.item_name || i.medicine_name || '',
        available_quantity: availQty,
        quantity: i.quantity || 0,
        amount: i.amount || 0
      };
    }) : [{ item_id: '', item_name: '', available_quantity: 0, quantity: 0, amount: 0 }];

    setFormItems(existingItems);
    setIsPreviewModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteRequisition = async (req) => {
    if (req.status === 'Approved') {
      alert("Approved requisitions cannot be deleted.");
      return;
    }

    setActiveDropdownMrNumber(null);

    if (!window.confirm(`Are you sure you want to cancel (delete) requisition ${req.mr_number}?`)) {
      return;
    }

    try {
      const res = await fetch(`${franchiseurl}material-requisitions/${req.mr_number}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_cancelled_by: franchiseId })
      });
      if (res.ok) {
        fetchRequisitions();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel requisition");
      }
    } catch (err) {
      console.error("Error cancelling requisition:", err);
      alert("An error occurred while cancelling the requisition");
    }
  };

  const handleOpenPrintModal = (req) => {
    setActiveDropdownMrNumber(null);
    setPrintVoucherData(req);
    setIsPrintModalOpen(true);
  };

  const handleAddItem = () => {
    setFormItems([...formItems, { item_id: '', item_name: '', available_quantity: 0, quantity: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (formItems.length === 1) return;
    const updated = formItems.filter((_, i) => i !== index);
    setFormItems(updated);
  };

  const handleItemSelectFromDropdown = (index, selectedItem) => {
    const updated = [...formItems];
    const availQty = selectedItem.available_quantity !== undefined 
      ? selectedItem.available_quantity 
      : ((selectedItem.total_quantity || 0) - (selectedItem.approved_quantity || 0));

    updated[index] = {
      item_id: selectedItem.item_id,
      item_name: selectedItem.item_name || selectedItem.itemName,
      available_quantity: availQty,
      quantity: 0, // Quantity defaults to 0 so user types
      amount: selectedItem.amount || selectedItem.mrp || 0 // Rate from Stores GRN latest MRP
    };
    setFormItems(updated);
  };

  const handleItemFieldChange = (index, field, value) => {
    const updated = [...formItems];
    if (field === 'quantity' || field === 'amount') {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value;
    }
    setFormItems(updated);
  };

  const calculateTotal = () => {
    return formItems.reduce((acc, curr) => acc + (Number(curr.quantity || 0) * Number(curr.amount || 0)), 0);
  };

  // Trigger Preview before saving
  const handleOpenPreview = () => {
    const validItems = formItems.filter(i => (i.item_name && i.item_name.trim() !== ''));
    if (validItems.length === 0) {
      alert("Please select at least one material item.");
      return;
    }

    const hasZeroQuantity = validItems.some(i => Number(i.quantity || 0) <= 0);
    if (hasZeroQuantity) {
      alert("Please enter a valid quantity greater than 0 for all selected items.");
      return;
    }

    setIsPreviewModalOpen(true);
  };

  const handleSaveRequisition = () => {
    if (editingMrNumber) {
      setIsReasonModalOpen(true);
    } else {
      submitRequisitionApi();
    }
  };

  const submitRequisitionApi = async (reason = '') => {
    const validItems = formItems.filter(i => (i.item_name && i.item_name.trim() !== ''));
    if (validItems.length === 0) {
      alert("No valid items to save.");
      return;
    }

    const totalAmount = calculateTotal();
    const payload = {
      franchise_id: franchiseId,
      items: validItems.map((item, idx) => ({
        item_id: item.item_id || `ITM-${idx + 1}`,
        item_name: item.item_name || '',
        quantity: Number(item.quantity),
        amount: Number(item.amount)
      })),
      Total_amount: totalAmount,
      status: 'Draft',
      created_by: localStorage.getItem('user_name') || 'system',
      lastmodified_by: localStorage.getItem('user_name') || 'system'
    };

    if (editingMrNumber) {
      payload.edited_reason = reason || editedReasonInput;
      payload.edited_by = franchiseId;
    }

    try {
      let res;
      if (editingMrNumber) {
        res = await fetch(`${franchiseurl}material-requisitions/${editingMrNumber}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${franchiseurl}material-requisitions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsReasonModalOpen(false);
        setIsPreviewModalOpen(false);
        setIsModalOpen(false);
        setEditingMrNumber(null);
        setEditedReasonInput('');
        fetchRequisitions();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save material requisition");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while saving material requisition");
    }
  };

  // Client-side search and date-range filtering
  const filteredRequisitions = requisitions
    .filter(req => {
      const matchesSearch = req.mr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.franchise_name && req.franchise_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (req.items && req.items.some(i => (i.item_name || i.medicine_name || '').toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesStatus = statusFilter ? req.status === statusFilter : true;
      
      // Date filtering
      let matchesDate = true;
      if (fromDate || toDate) {
        const reqDate = new Date(req.created_date);
        if (fromDate) {
          const from = new Date(fromDate);
          from.setHours(0, 0, 0, 0);
          if (reqDate < from) matchesDate = false;
        }
        if (toDate) {
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);
          if (reqDate > to) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  // Excel Download Generator
  const handleDownloadExcel = () => {
    if (filteredRequisitions.length === 0) {
      alert("No material requisitions available to export.");
      return;
    }

    const excelRows = [];
    let grandTotalAmount = 0;

    filteredRequisitions.forEach(req => {
      const dateStr = req.created_date ? new Date(req.created_date).toLocaleDateString() : 'N/A';
      const mrNum = req.mr_number;
      const franchiseName = req.franchise_name || req.franchise_id || 'N/A';
      const statusText = req.status;

      const items = req.items && req.items.length > 0 ? req.items : [];
      let mrTotalAmount = 0;

      items.forEach((item, idx) => {
        const itemId = item.item_id || (idx + 1);
        const itemName = item.item_name || item.medicine_name || '';
        const qty = Number(item.quantity || 0);
        const rate = Number(item.amount || 0);
        const itemAmount = qty * rate;

        mrTotalAmount += itemAmount;

        excelRows.push({
          "DATE": idx === 0 ? dateStr : "",
          "MR NUMBER": idx === 0 ? mrNum : "",
          "FRANCHISE NAME": idx === 0 ? franchiseName : "",
          "STATUS": idx === 0 ? statusText : "",
          "ITEM ID": itemId,
          "MATERIAL / ITEM NAME": itemName,
          "QUANTITY": qty,
          "UNIT RATE (₹)": Number(rate.toFixed(2)),
          "TOTAL AMOUNT (₹)": Number(itemAmount.toFixed(2))
        });
      });

      // Requisition Subtotal Row - Bold label in Material Name column, amount in Total Amount column
      excelRows.push({
        "DATE": "",
        "MR NUMBER": "",
        "FRANCHISE NAME": "",
        "STATUS": "",
        "ITEM ID": "",
        "MATERIAL / ITEM NAME": `Total for ${mrNum}`,
        "QUANTITY": "",
        "UNIT RATE (₹)": "",
        "TOTAL AMOUNT (₹)": Number(mrTotalAmount.toFixed(2))
      });

      // Spacer row
      excelRows.push({
        "DATE": "",
        "MR NUMBER": "",
        "FRANCHISE NAME": "",
        "STATUS": "",
        "ITEM ID": "",
        "MATERIAL / ITEM NAME": "",
        "QUANTITY": "",
        "UNIT RATE (₹)": "",
        "TOTAL AMOUNT (₹)": ""
      });

      grandTotalAmount += mrTotalAmount;
    });

    // Grand Total Row
    excelRows.push({
      "DATE": "",
      "MR NUMBER": "",
      "FRANCHISE NAME": "",
      "STATUS": "",
      "ITEM ID": "",
      "MATERIAL / ITEM NAME": "GRAND TOTAL",
      "QUANTITY": "",
      "UNIT RATE (₹)": "",
      "TOTAL AMOUNT (₹)": Number(grandTotalAmount.toFixed(2))
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Set Column Widths
    worksheet['!cols'] = [
      { wch: 14 }, // DATE
      { wch: 20 }, // MR NUMBER
      { wch: 28 }, // FRANCHISE NAME
      { wch: 16 }, // STATUS
      { wch: 18 }, // ITEM ID
      { wch: 32 }, // MATERIAL / ITEM NAME
      { wch: 12 }, // QUANTITY
      { wch: 16 }, // UNIT RATE (₹)
      { wch: 18 }  // TOTAL AMOUNT (₹)
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Material Requisitions");

    const fileName = `Material_Requisitions_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const totalCount = requisitions.length;
  const draftCount = requisitions.filter(r => r.status === 'Draft').length;
  const approvedCount = requisitions.filter(r => r.status === 'Approved').length;

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const activeSlipData = printVoucherData || selectedReqDetails;
  const printTotalAmount = activeSlipData?.Total_amount 
    ? Number(activeSlipData.Total_amount).toFixed(2)
    : '0.00';

  return (
    <Container>
      <Header>
        <TitleContainer>
          <h1><Package size={28} color="#4B9EB0" /> Material Requisition (Indent)</h1>
          <p>Request materials, lab supplies, reagents, and consumables for franchise operations</p>
        </TitleContainer>
        <ActionButton onClick={handleOpenNewModal}>
          <Plus size={18} /> New Requisition
        </ActionButton>
      </Header>

      <StatsGrid>
        <StatCard bg="#e0f2fe" color="#0369a1">
          <div>
            <div className="stat-val">{totalCount}</div>
            <div className="stat-lbl">Total Requisitions</div>
          </div>
          <div className="icon-wrapper"><Layers size={24} /></div>
        </StatCard>
        <StatCard bg="#f1f5f9" color="#475569">
          <div>
            <div className="stat-val">{draftCount}</div>
            <div className="stat-lbl">Draft / Editable</div>
          </div>
          <div className="icon-wrapper"><FileText size={24} /></div>
        </StatCard>
        <StatCard bg="#dcfce7" color="#15803d">
          <div>
            <div className="stat-val">{approvedCount}</div>
            <div className="stat-lbl">Approved (Locked)</div>
          </div>
          <div className="icon-wrapper"><CheckCircle size={24} /></div>
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
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
          </SelectFilter>

          <SearchInputWrapper>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search MR Number, Franchise or Material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                style={{ padding: '7px 12px', fontSize: '0.8rem' }}
                title="Reset to today's data with all statuses"
              >
                Clear
              </Button>
            )}

            <Button variant="outline" onClick={fetchRequisitions}>
              <RefreshCw size={16} /> Refresh
            </Button>

            <Button 
              variant="outline" 
              onClick={handleDownloadExcel}
              style={{ 
                padding: '7px 14px', 
                fontSize: '0.85rem',
                borderColor: '#4B9EB0',
                color: '#4B9EB0',
                fontWeight: 600
              }}
              title="Export visible data to Excel"
            >
              <Download size={15} /> Export
            </Button>
          </div>
        </FilterBar>

        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>MR Number</th>
              <th>Franchise Name</th>
              <th>Total Amount</th>
              <th>Item Count</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading material requisitions...</td>
              </tr>
            ) : filteredRequisitions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No material requisitions found.
                </td>
              </tr>
            ) : (
              filteredRequisitions.map((req) => {
                const isApproved = req.status === 'Approved';
                const displayName = req.franchise_name || req.franchise_id || 'N/A';
                const isDropdownOpen = activeDropdownMrNumber === req.mr_number;

                return (
                  <tr key={req.mr_number}>
                    {/* 1. Date */}
                    <td>{req.created_date ? new Date(req.created_date).toLocaleDateString() : 'N/A'}</td>
                    {/* 2. MR Number */}
                    <td style={{ fontWeight: 600, color: '#4B9EB0' }}>{req.mr_number}</td>
                    {/* 3. Franchise Name */}
                    <td style={{ fontWeight: 600, color: '#334155' }}>{displayName}</td>
                    {/* 4. Total Amount */}
                    <td style={{ fontWeight: 600 }}>₹{req.Total_amount ? req.Total_amount.toLocaleString() : '0'}</td>
                    {/* 5. Item Count */}
                    <td>{req.items ? req.items.length : 0} Items</td>
                    {/* 6. Status */}
                    <td>
                      <StatusBadge status={req.status}>
                        {req.status === 'Approved' && <CheckCircle size={12} />}
                        {req.status === 'Draft' && <FileText size={12} />}
                        {req.status}
                      </StatusBadge>
                    </td>
                    {/* 7. Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <DropdownContainer className="action-dropdown-container">
                        <ThreeDotsButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownMrNumber(isDropdownOpen ? null : req.mr_number);
                          }}
                          title="Actions"
                        >
                          <MoreVertical size={16} />
                        </ThreeDotsButton>

                        {isDropdownOpen && (
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => {
                                setActiveDropdownMrNumber(null);
                                setSelectedReqDetails(req);
                              }}
                            >
                              <Eye size={15} color="#0284c7" /> View Details
                            </DropdownItem>

                            <DropdownItem
                              onClick={() => handleOpenPrintModal(req)}
                            >
                              <Printer size={15} color="#475569" /> Print Slip
                            </DropdownItem>

                            <DropdownItem
                              disabled={isApproved}
                              onClick={() => {
                                if (!isApproved) {
                                  handleOpenEditModal(req);
                                }
                              }}
                              title={isApproved ? "Approved - Locked from editing" : "Edit requisition"}
                            >
                              {isApproved ? <Lock size={15} color="#94a3b8" /> : <Edit2 size={15} color="#4B9EB0" />}
                              Edit Requisition
                            </DropdownItem>

                            <DropdownItem
                              danger
                              disabled={isApproved}
                              onClick={() => {
                                if (!isApproved) {
                                  handleDeleteRequisition(req);
                                }
                              }}
                              title={isApproved ? "Approved - Locked from deletion" : "Delete requisition"}
                            >
                              {isApproved ? <Lock size={15} color="#94a3b8" /> : <Trash2 size={15} />}
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        )}
                      </DropdownContainer>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card>

      {/* 1. New / Edit Requisition Entry Modal */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent maxWidth="850px">
            <ModalHeader>
              <h2>{editingMrNumber ? `Edit Requisition ${editingMrNumber}` : 'Create Material Requisition'}</h2>
              <button onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </ModalHeader>
            <ModalBody>
              <ItemsTable>
                <thead>
                  <tr>
                    <th>Material / Item Name</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Available Qty</th>
                    <th style={{ width: '120px' }}>Quantity</th>
                    <th style={{ width: '120px' }}>Rate (₹)</th>
                    <th style={{ width: '130px' }}>Total (₹)</th>
                    <th style={{ width: '45px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <ItemSearchSelector 
                          value={item.item_name || ''}
                          masterItems={masterItems}
                          onSelect={(selectedItem) => handleItemSelectFromDropdown(index, selectedItem)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          color: (Number(item.available_quantity || 0) > 0 ? '#15803d' : '#94a3b8'),
                          fontSize: '0.9rem'
                        }}>
                          {item.available_quantity !== undefined ? item.available_quantity : '-'}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td style={{ fontWeight: 500, color: '#334155' }}>
                        ₹{Number(item.amount || 0).toFixed(2)}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{(Number(item.quantity || 0) * Number(item.amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                          title="Remove row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ItemsTable>

              <div style={{ marginTop: '16px' }}>
                <Button variant="outline" onClick={handleAddItem} style={{ fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Another Item
                </Button>
              </div>

              <TotalRow>
                <span>Total Amount:</span>
                <span style={{ fontSize: '1.4rem', color: '#4B9EB0' }}>
                  ₹{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </TotalRow>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleOpenPreview}>
                <Eye size={16} /> Preview Requisition
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 2. Interactive Preview Modal (Before Saving) */}
      {isPreviewModalOpen && (
        <ModalOverlay style={{ zIndex: 1150 }}>
          <ModalContent maxWidth="850px">
            <ModalHeader>
              <h2><Eye size={20} color="#4B9EB0" /> Preview Requisition {editingMrNumber ? `(${editingMrNumber})` : ''}</h2>
              <button onClick={() => setIsPreviewModalOpen(false)}><XCircle size={20} /></button>
            </ModalHeader>
            <ModalBody>
              <div style={{ 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '10px', 
                padding: '14px 18px',
                marginBottom: '18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '0.88rem'
              }}>
                <div><strong>Franchise:</strong> {franchiseId}</div>
                <div><strong>Date:</strong> {getTodayDateString()}</div>
                <div><strong>Status:</strong> <StatusBadge status="Draft">Draft</StatusBadge></div>
                <div><strong>Total Items:</strong> {formItems.filter(i => i.item_name).length}</div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 10px 0' }}>
                Review items below. You can make adjustments to quantities or delete items directly before saving.
              </p>

              <ItemsTable>
                <thead>
                  <tr>
                    <th>Material / Item Name</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Available Qty</th>
                    <th style={{ width: '120px' }}>Quantity</th>
                    <th style={{ width: '120px' }}>Rate (₹)</th>
                    <th style={{ width: '130px' }}>Total (₹)</th>
                    <th style={{ width: '45px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {item.item_name || <span style={{ color: '#94a3b8' }}>- Not Selected -</span>}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          color: (Number(item.available_quantity || 0) > 0 ? '#15803d' : '#94a3b8'),
                          fontSize: '0.9rem'
                        }}>
                          {item.available_quantity !== undefined ? item.available_quantity : '-'}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td style={{ fontWeight: 500, color: '#334155' }}>
                        ₹{Number(item.amount || 0).toFixed(2)}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{(Number(item.quantity || 0) * Number(item.amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ItemsTable>

              <TotalRow>
                <span>Grand Total:</span>
                <span style={{ fontSize: '1.4rem', color: '#4B9EB0' }}>
                  ₹{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </TotalRow>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsPreviewModalOpen(false)}>
                <ArrowLeft size={16} /> Back to Edit
              </Button>
              <Button variant="primary" onClick={handleSaveRequisition}>
                <Save size={16} /> Save Requisition
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 3. Reason Modal for Edited Requisition */}
      {isReasonModalOpen && (
        <ModalOverlay style={{ zIndex: 1200 }}>
          <ModalContent maxWidth="500px">
            <ModalHeader>
              <h2><MessageSquare size={20} color="#4B9EB0" /> Reason for Editing</h2>
              <button onClick={() => setIsReasonModalOpen(false)}><XCircle size={20} /></button>
            </ModalHeader>
            <ModalBody>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 12px 0' }}>
                Please enter the reason for modifying requisition <strong>{editingMrNumber}</strong>:
              </p>
              <textarea
                rows="4"
                placeholder="e.g. Adjusted quantities due to urgent stock requirement..."
                value={editedReasonInput}
                onChange={(e) => setEditedReasonInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsReasonModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => submitRequisitionApi(editedReasonInput)}
                disabled={!editedReasonInput.trim()}
              >
                <Save size={16} /> Submit Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 4. Details View Modal */}
      {selectedReqDetails && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <div>
                <h2>Requisition {selectedReqDetails.mr_number}</h2>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Created on {new Date(selectedReqDetails.created_date).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedReqDetails(null)}><XCircle size={20} /></button>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <div>
                  <strong>Status: </strong>
                  <StatusBadge status={selectedReqDetails.status}>{selectedReqDetails.status}</StatusBadge>
                </div>
                <div>
                  <strong>Franchise Name: </strong>{selectedReqDetails.franchise_name || selectedReqDetails.franchise_id}
                </div>
                <div>
                  <strong>Total Amount: </strong>₹{selectedReqDetails.Total_amount ? selectedReqDetails.Total_amount.toLocaleString() : 0}
                </div>
                {selectedReqDetails.edited_reason && (
                  <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Last Edit Reason: </strong>{selectedReqDetails.edited_reason} (By: {selectedReqDetails.edited_by || 'system'} on {selectedReqDetails.edited_date ? new Date(selectedReqDetails.edited_date).toLocaleString() : 'N/A'})
                  </div>
                )}
              </FormGrid>

              <h4 style={{ fontSize: '1rem', marginTop: '20px', color: '#1e293b' }}>Items Requested</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Material Name</th>
                    <th>Quantity</th>
                    <th>Amount per unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReqDetails.items && selectedReqDetails.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: '#4B9EB0' }}>{item.item_id}</td>
                      <td style={{ fontWeight: 600 }}>{item.item_name || item.medicine_name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.amount}</td>
                      <td style={{ fontWeight: 600 }}>₹{(item.quantity * item.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => handleOpenPrintModal(selectedReqDetails)}>
                <Printer size={16} /> Print Voucher
              </Button>
              <Button variant="secondary" onClick={() => setSelectedReqDetails(null)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 5. Dedicated Print Slip View & Print Modal */}
      {isPrintModalOpen && printVoucherData && (
        <ModalOverlay style={{ zIndex: 1150 }}>
          <ModalContent maxWidth="750px">
            <ModalHeader>
              <h2><Printer size={20} color="#4B9EB0" /> Print Material Requisition Slip</h2>
              <button onClick={() => setIsPrintModalOpen(false)}><XCircle size={20} /></button>
            </ModalHeader>
            <ModalBody style={{ background: '#f1f5f9', padding: '20px' }}>
              <SlipPreviewPaper>
                <div className="double-divider" />
                <div className="voucher-title">MATERIAL REQUISITION SLIP</div>
                <div className="double-divider" />

                <div className="meta-grid">
                  <div className="meta-col">
                    <div>
                      <strong>Franchise Name&nbsp;:&nbsp;</strong>
                      {printVoucherData.franchise_name || printVoucherData.franchise_id || 'N/A'}
                    </div>
                  </div>
                  <div className="meta-col" style={{ textAlign: 'right' }}>
                    <div>
                      <strong>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</strong>{getFormattedDate(printVoucherData.created_date)}
                    </div>
                    <div>
                      <strong>MR Number :&nbsp;</strong>{printVoucherData.mr_number}
                    </div>
                  </div>
                </div>

                <table className="voucher-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Sl</th>
                      <th>Particulars</th>
                      <th style={{ width: '100px' }}>Batch</th>
                      <th style={{ width: '80px' }} className="th-center">Expiry</th>
                      <th style={{ width: '60px' }} className="th-num">Qty</th>
                      <th style={{ width: '90px' }} className="th-num">S.rate</th>
                      <th style={{ width: '100px' }} className="th-num">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printVoucherData.items && printVoucherData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ textTransform: 'uppercase' }}>{item.item_name || item.medicine_name || ''}</td>
                        <td>{item.batch || '-'}</td>
                        <td className="td-center">{item.expiry || '-'}</td>
                        <td className="td-num">{item.quantity}</td>
                        <td className="td-num">{Number(item.amount || 0).toFixed(2)}</td>
                        <td className="td-num">{(Number(item.quantity || 0) * Number(item.amount || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="summary-row">
                  <div>Total Amount: ₹{Number(printVoucherData.Total_amount || 0).toFixed(2)}</div>
                </div>
              </SlipPreviewPaper>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsPrintModalOpen(false)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={16} /> Print Slip
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Hidden Printable Voucher for window.print() */}
      {activeSlipData && (
        <PrintableVoucherContainer id="printable-voucher">
          <div className="double-divider" />
          <div className="voucher-title">MATERIAL REQUISITION SLIP</div>
          <div className="double-divider" />

          <div className="meta-grid">
            <div className="meta-col">
              <div>
                <strong>Franchise Name&nbsp;:&nbsp;</strong>
                {activeSlipData.franchise_name || activeSlipData.franchise_id || 'N/A'}
              </div>
            </div>
            <div className="meta-col" style={{ textAlign: 'right' }}>
              <div>
                <strong>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</strong>{getFormattedDate(activeSlipData.created_date)}
              </div>
              <div>
                <strong>MR Number :&nbsp;</strong>{activeSlipData.mr_number}
              </div>
            </div>
          </div>

          <table className="voucher-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Sl</th>
                <th>Particulars</th>
                <th style={{ width: '100px' }}>Batch</th>
                <th style={{ width: '80px' }} className="th-center">Expiry</th>
                <th style={{ width: '60px' }} className="th-num">Qty</th>
                <th style={{ width: '90px' }} className="th-num">S.rate</th>
                <th style={{ width: '100px' }} className="th-num">Total</th>
              </tr>
            </thead>
            <tbody>
              {activeSlipData.items && activeSlipData.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td style={{ textTransform: 'uppercase' }}>{item.item_name || item.medicine_name || ''}</td>
                  <td>{item.batch || '-'}</td>
                  <td className="td-center">{item.expiry || '-'}</td>
                  <td className="td-num">{item.quantity}</td>
                  <td className="td-num">{Number(item.amount || 0).toFixed(2)}</td>
                  <td className="td-num">{(Number(item.quantity || 0) * Number(item.amount || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary-row">
            <div>Total Amount: ₹{printTotalAmount}</div>
          </div>
        </PrintableVoucherContainer>
      )}
    </Container>
  );
}
