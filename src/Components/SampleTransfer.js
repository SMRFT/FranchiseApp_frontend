"use client"
import { useState, useEffect, useMemo } from "react"
import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

// ==========================================
// GLOBAL STYLES
// ==========================================

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: white;
    color: white;
  }

  button {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
    color: white;
    font-family: 'Pacifico', cursive;
    border: none;
    border-radius: 15px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
    margin-top: 20px;
  }

  button:hover {
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158));
  }

  label {
    display: block;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
    font-size: 0.95rem;
    text-transform: capitalize;
  }

  h3 {
    font-family: 'Pacifico', cursive;
    color: white;
    font-size: 30px;
    margin: 0;
    text-align: center;
  }

  h4 {
    display: block;
    color: #4B9EB0;
    margin-bottom: 8px;
    font-size: 0.95rem;
    font-family: 'Pacifico', cursive;
  }

  h5 {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
    font-family: 'Pacifico', cursive;
    margin: 30px 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #ecf0f1;
    display: flex;
    align-items: center;
    position: relative;
  }

  table {
    background-color: white;
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  th {
    color: #4B9EB0;
    font-weight: bold;
    padding: 12px 16px;
    text-align: left;
    background-color: #f0f8fa;
  }

  td {
    color: black;
    padding: 12px 16px;
    border-top: 1px solid #ddd;
  }

  strong {
    color: black;
  }
`

// ==========================================
// STYLED COMPONENTS
// ==========================================

const LAB_OPTIONS = [
  "Shanmuga Reference Lab - Main Branch",
  "Shanmuga Reference Lab - North Branch",
  "Shanmuga Reference Lab - South Branch",
  "Shanmuga Reference Lab - East Branch",
  "Shanmuga Reference Lab - West Branch",
]

const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 10px;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  min-height: 100vh;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 20px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  color: #2d3748;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #2d3748;
  font-family: 'Pacifico', cursive;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '🔄';
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`

const SampleCount = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(75, 158, 176, 0.3);
  align-self: flex-start;
  font-family: 'Roboto', sans-serif;

  @media (min-width: 768px) {
    align-self: center;
  }
`

const FranchiseInfo = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  line-height: 1.5;

  strong {
    color: #4a5568;
  }

  @media (min-width: 768px) {
    padding: 16px;
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
`

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr) 2fr auto;
    align-items: end;
    padding: 20px;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-weight: 700 !important;
  color: #4a5568 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px;
  font-family: 'Roboto', sans-serif !important;
  margin-bottom: 4px !important;
`

const Input = styled.input`
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;

  &:focus {
    outline: none;
    border-color: #4B9EB0;
    box-shadow: 0 0 0 3px rgba(75, 158, 176, 0.1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`

const Button = styled.button`
  flex: 1;
  padding: 12px 20px !important;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important;
  border: none;
  border-radius: 15px !important;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(75, 158, 176, 0.3);
  white-space: nowrap;
  margin-top: 0 !important;

  &:hover {
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158)) !important;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const ClearButton = styled(Button)`
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);

  &:hover {
    background: linear-gradient(135deg, #f59e0b, #b45309) !important;
  }
`

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 10px;

  @media (min-width: 768px) {
    padding: 0;
    overflow: hidden;
  }
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white !important;

  @media (max-width: 768px) {
    display: block;
  }
`

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);

  @media (max-width: 768px) {
    display: none;
  }
`

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    &:hover {
      background: rgba(75, 158, 176, 0.05);
    }
    &:last-child {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    display: block;
    background: white;
    border-radius: 12px;
    margin-bottom: 15px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    padding: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const TableHead = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 700;
  color: white !important;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: transparent !important;
`

const TableCell = styled.td`
  padding: 16px 12px;
  color: #334155 !important;
  font-size: 0.9rem;
  vertical-align: middle;
  border-top: 1px solid #e2e8f0 !important;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9 !important;
    border-top: none !important;
    text-align: right;

    &:last-child {
      border-bottom: none !important;
      padding-bottom: 0;
      padding-top: 15px;
      justify-content: center;
    }

    &:first-child {
      padding-top: 0;
    }

    &::before {
      content: attr(data-label);
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      font-size: 0.75rem;
      text-align: left;
      margin-right: 10px;
    }
  }
`

const PatientIdText = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
`

const BarcodeText = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-weight: 600;
`

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.status === 'Transferred'
    ? 'linear-gradient(135deg, #10b981, #059669)'
    : 'linear-gradient(135deg, #6FB1C4, #4B9EB0)'};
  color: white;
  white-space: nowrap;
`

const TransferButton = styled.button`
  padding: 10px 20px !important;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important;
  border: none;
  border-radius: 10px !important;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 0 !important;
  font-family: 'Roboto', sans-serif !important;

  @media (min-width: 768px) {
    width: auto;
    padding: 8px 16px !important;
  }

  &:hover {
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158)) !important;
    transform: translateY(-2px);
  }

  &:disabled {
    background: linear-gradient(135deg, #cbd5e1, #94a3b8) !important;
    color: white !important;
    cursor: not-allowed;
    transform: none;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  color: #4B9EB0;
  font-weight: 600;
`

const NoData = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

  &::before {
    content: '📦';
    font-size: 3rem;
    display: block;
    margin-bottom: 16px;
  }
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.9rem;
`

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  color: #15803d;
  font-weight: 600;
  font-size: 0.9rem;
`

// ==========================================
// MODAL STYLES
// ==========================================

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 0;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  flex-shrink: 0;

  @media (min-width: 768px) {
    padding: 24px 28px;
  }
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Pacifico', cursive;
  color: white;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`

const CloseButton = styled.button`
  background: none !important;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white !important;
  padding: 5px;
  opacity: 0.9;
  transition: all 0.3s ease;
  margin-top: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
    background: none !important;
  }
`

const ModalBody = styled.div`
  padding: 0;
  overflow-y: auto;
  flex-grow: 1;
`

const PatientInfoSection = styled.div`
  padding: 15px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    padding: 24px 28px;
  }
`

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    gap: 20px;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoLabel = styled.span`
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.span`
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
  word-break: break-word;
`

const TestsSection = styled.div`
  padding: 15px 20px;

  @media (min-width: 768px) {
    padding: 24px 28px;
  }
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
`

const SectionTitle = styled.h3`
  margin: 0 !important;
  color: #1e293b !important;
  font-size: 1rem !important;
  font-weight: 700;
  text-align: left !important;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    font-size: 1.15rem !important;
  }
`

const TestCount = styled.span`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 8px;
  width: fit-content;
`

const TestTableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
`

const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
  background-color: white !important;
`

const TestTableHeader = styled.thead`
  background: #f0f8fa !important;
`

const TestTableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  background: white;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`

const TestTableHead = styled.th`
  padding: 12px !important;
  text-align: left !important;
  font-weight: 700;
  color: #4B9EB0 !important;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background-color: #f0f8fa !important;
`

const TestTableCell = styled.td`
  padding: 12px !important;
  color: #334155 !important;
  font-size: 0.85rem;
  vertical-align: middle;
  border-top: 1px solid #e2e8f0 !important;
`

const TestName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  line-height: 1.4;
`

const TestContainerBadge = styled.div`
  font-size: 0.7rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 600;
`

const Select = styled.select`
  padding: 8px 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.82rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-family: 'Roboto', sans-serif;
  color: #334155;

  &:focus {
    outline: none;
    border-color: #4B9EB0;
    box-shadow: 0 0 0 3px rgba(75, 158, 176, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`

const Checkbox = styled.input`
  margin: 0;
  cursor: pointer;
  width: 20px;
  height: 20px;
  accent-color: #4B9EB0;
`

const SaveButton = styled.button`
  width: 100%;
  padding: 14px 20px !important;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important;
  border: none;
  border-radius: 12px !important;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(75, 158, 176, 0.3);
  margin-bottom: 10px;
  margin-top: 0 !important;

  &:hover {
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158)) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(75, 158, 176, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const TransferredBadge = styled.span`
  display: inline-block;
  padding: 5px 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
`

// ==========================================
// COMPONENT LOGIC
// ==========================================

const SampleTransfer = () => {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedSample, setSelectedSample] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [franchiseId, setFranchiseId] = useState("")
  const [transferredBy, setTransferredBy] = useState("")
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchQuery: "",
  })
  // testSelections: { [testKey]: boolean }
  const [testSelections, setTestSelections] = useState({})
  // testStatuses: { [testKey]: "Collected" | "Transferred" }
  const [testStatuses, setTestStatuses] = useState({})
  // transferTo: { [testKey]: string } - selected lab for each test
  const [transferTo, setTransferTo] = useState({})
  const [saving, setSaving] = useState(false)
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  useEffect(() => {
    const storedFranchiseId = localStorage.getItem("franchise_id")
    const storedTransferredBy =
      localStorage.getItem("username") ||
      localStorage.getItem("user_name") ||
      localStorage.getItem("logged_user")
    if (storedFranchiseId) {
      setFranchiseId(storedFranchiseId)
    } else {
      setError("Franchise ID not found in localStorage. Please login again.")
    }
    if (storedTransferredBy) setTransferredBy(storedTransferredBy)
  }, [])

  const parseTestDetails = (testStr) => {
    try {
      if (!testStr) return []
      let parsed
      if (typeof testStr === "string") {
        let cleanedStr = testStr.trim()
        if (cleanedStr.startsWith('"') && cleanedStr.endsWith('"')) {
          cleanedStr = cleanedStr.slice(1, -1)
        }
        cleanedStr = cleanedStr.replace(/\\(?!["\\])/g, "\\\\")
        cleanedStr = cleanedStr.replace(/\\"/g, '"')
        parsed = JSON.parse(cleanedStr)
      } else if (Array.isArray(testStr)) {
        parsed = testStr
      } else if (typeof testStr === "object") {
        parsed = [testStr]
      } else {
        return []
      }
      if (!Array.isArray(parsed)) parsed = [parsed]
      return parsed
    } catch (error) {
      console.error("Error parsing test details:", error)
      return []
    }
  }

  const fetchCollectedSamples = async () => {
    if (!franchiseId) {
      setError("Franchise ID is required")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const queryParams = new URLSearchParams({
        franchise_id: franchiseId,
        start_date: filters.startDate,
        end_date: filters.endDate,
      })
      const response = await fetch(`${franchiseurl}sample/?${queryParams.toString()}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setSamples(data)
    } catch (error) {
      console.error("Error fetching collected samples:", error)
      setError(`Failed to fetch collected samples: ${error.message}`)
      setSamples([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    const today = new Date().toISOString().split("T")[0]
    setFilters({ startDate: today, endDate: today, searchQuery: "" })
  }

  const filteredSamples = useMemo(() => {
    if (!filters.searchQuery) return samples
    const query = filters.searchQuery.toLowerCase()
    return samples.filter(
      (sample) =>
        sample.patient_id?.toLowerCase().includes(query) ||
        sample.barcode?.toLowerCase().includes(query)
    )
  }, [samples, filters.searchQuery])

  const openModal = async (sample) => {
    setSelectedSample(sample)
    setShowModal(true)

    let currentSampleData = sample
    if (!currentSampleData?.testdetails) {
      try {
        const sampleQueryParams = new URLSearchParams({
          franchise_id: franchiseId,
          barcode: sample.barcode,
        })
        const response = await fetch(`${franchiseurl}sample/?${sampleQueryParams}`)
        if (response.ok) currentSampleData = await response.json()
      } catch (err) {
        console.error("Error fetching sample data:", err)
        setError(`Failed to load sample data: ${err.message}`)
        return
      }
    }

    const originalTests = parseTestDetails(currentSampleData.testdetails)
    const initialSelections = {}
    const initialStatuses = {}
    const initialTransferTo = {}

    originalTests.forEach((test, index) => {
      const testKey = `${currentSampleData.patient_id}_${index}`
      const existingStatus = test.samplestatus || "Collected"

      if (existingStatus === "Transferred") {
        // Already transferred — hide (null)
        initialSelections[testKey] = null
        initialStatuses[testKey] = "Transferred"
        initialTransferTo[testKey] = test.transfer_to || LAB_OPTIONS[0]
      } else {
        // Collected but not transferred — show, pre-selected, default to Transferred
        initialSelections[testKey] = true
        initialStatuses[testKey] = "Transferred"
        initialTransferTo[testKey] = test.transfer_to || LAB_OPTIONS[0]
      }
    })

    setTestSelections(initialSelections)
    setTestStatuses(initialStatuses)
    setTransferTo(initialTransferTo)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSample(null)
    setTestSelections({})
    setTestStatuses({})
    setTransferTo({})
    setError("")
    setSuccess("")
  }

  const handleTestSelection = (testKey, selected) => {
    setTestSelections((prev) => ({ ...prev, [testKey]: selected }))
    setTestStatuses((prev) => ({
      ...prev,
      [testKey]: selected ? "Transferred" : "Collected",
    }))
  }

  const handleSelectAll = (selectAll) => {
    if (!selectedSample) return
    const tests = parseTestDetails(selectedSample.testdetails)
    const updatedSelections = {}
    const updatedStatuses = {}
    tests.forEach((_, index) => {
      const testKey = `${selectedSample.patient_id}_${index}`
      if (testSelections[testKey] !== null) {
        updatedSelections[testKey] = selectAll
        updatedStatuses[testKey] = selectAll ? "Transferred" : "Collected"
      }
    })
    setTestSelections((prev) => ({ ...prev, ...updatedSelections }))
    setTestStatuses((prev) => ({ ...prev, ...updatedStatuses }))
  }

  const handleStatusChange = (testKey, status) => {
    setTestStatuses((prev) => ({ ...prev, [testKey]: status }))
    setTestSelections((prev) => ({
      ...prev,
      [testKey]: status === "Transferred",
    }))
  }

  const handleTransferToChange = (testKey, lab) => {
    setTransferTo((prev) => ({ ...prev, [testKey]: lab }))
    // Auto-select and set to Transferred when a lab is chosen
    setTestSelections((prev) => ({ ...prev, [testKey]: true }))
    setTestStatuses((prev) => ({ ...prev, [testKey]: "Transferred" }))
  }

  const saveTestData = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const originalTests = parseTestDetails(selectedSample.testdetails)
      const currentTime = new Date().toISOString()

      const formattedTestDetails = originalTests
        .map((test, index) => {
          const testKey = `${selectedSample.patient_id}_${index}`
          const isVisible = testSelections[testKey] !== null
          const isSelected = testSelections[testKey] === true
          const currentStatus = testStatuses[testKey] || "Collected"
          const selectedLab = transferTo[testKey] || LAB_OPTIONS[0]

          if (!isVisible) return null
          if (!isSelected) return null

          return {
            ...test,
            samplestatus: currentStatus,
            sampletransferred_time: currentStatus === "Transferred" ? currentTime : null,
            transferred_by: currentStatus === "Transferred" ? transferredBy : null,
            transfer_to: currentStatus === "Transferred" ? selectedLab : null,
          }
        })
        .filter((test) => test !== null)

      if (formattedTestDetails.length === 0) {
        alert("Please select at least one test to transfer.")
        setSaving(false)
        return
      }

      const sampleData = {
        franchise_id: franchiseId,
        barcode: selectedSample.barcode,
        testdetails: formattedTestDetails,
      }

      const response = await fetch(`${franchiseurl}sample/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setSuccess("Test data transferred successfully!")
      closeModal()
      fetchCollectedSamples()
    } catch (error) {
      console.error("Error saving test data:", error)
      setError(`Failed to transfer test data: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (franchiseId) fetchCollectedSamples()
  }, [franchiseId])

  const hasSelectedTests = Object.entries(testSelections).some(([, val]) => val === true)

  // Visible tests for modal (excludes already-transferred ones)
  const getVisibleTests = () => {
    if (!selectedSample) return []
    return parseTestDetails(selectedSample.testdetails).filter((_, index) => {
      const testKey = `${selectedSample.patient_id}_${index}`
      return testSelections[testKey] !== null
    })
  }

  const visibleTests = getVisibleTests()

  const allVisibleSelected =
    visibleTests.length > 0 &&
    selectedSample &&
    parseTestDetails(selectedSample.testdetails).every((_, index) => {
      const testKey = `${selectedSample.patient_id}_${index}`
      return testSelections[testKey] === null || testSelections[testKey] === true
    })

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Sample Transfer</Title>
          <SampleCount>Total Samples: {filteredSamples.length}</SampleCount>
        </Header>

        {franchiseId && (
          <FranchiseInfo>
            <strong>Franchise ID:</strong> {franchiseId}
            <span style={{ margin: "0 8px" }}>|</span>
            <strong>Transferred By:</strong> {transferredBy || "N/A"}
          </FranchiseInfo>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <FilterSection>
          <FilterGroup>
            <Label>From Date</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>To Date</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by Patient ID or Barcode..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            />
          </FilterGroup>

          <ButtonGroup>
            <Button onClick={fetchCollectedSamples} disabled={loading || !franchiseId}>
              {loading ? "Loading..." : "Search"}
            </Button>
            <ClearButton onClick={handleClearFilters}>Clear</ClearButton>
          </ButtonGroup>
        </FilterSection>

        {loading && <LoadingSpinner>Loading collected samples...</LoadingSpinner>}

        {!loading && !error && filteredSamples.length === 0 && (
          <NoData>
            <h3 style={{ color: "#64748b", fontFamily: "Pacifico, cursive", fontSize: "1.2rem" }}>
              No samples found
            </h3>
            <p style={{ color: "#94a3b8" }}>Try adjusting your search criteria</p>
          </NoData>
        )}

        {!loading && !error && filteredSamples.length > 0 && (
          <TableContainer>
            <StyledTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {filteredSamples.map((sample) => {
                  const tests = parseTestDetails(sample.testdetails)
                  const allTransferred = tests.every((t) => t.samplestatus === "Transferred")
                  const displayStatus = allTransferred ? "Transferred" : "Collected"

                  return (
                    <TableRow key={sample._id || sample.patient_id}>
                      <TableCell data-label="Patient ID">
                        <PatientIdText>{sample.patient_id}</PatientIdText>
                      </TableCell>
                      <TableCell data-label="Barcode">
                        <BarcodeText>{sample.barcode || "N/A"}</BarcodeText>
                      </TableCell>
                      <TableCell data-label="Status">
                        <StatusBadge status={displayStatus}>{displayStatus}</StatusBadge>
                      </TableCell>
                      <TableCell data-label="Action">
                        <TransferButton
                          onClick={() => openModal(sample)}
                          disabled={allTransferred}
                        >
                          {allTransferred ? "✓ Transferred" : "Transfer"}
                        </TransferButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>
            </StyledTable>
          </TableContainer>
        )}

        {/* Modal */}
        {showModal && selectedSample && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Sample Transfer</ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <PatientInfoSection>
                  <PatientInfoGrid>
                    <InfoItem>
                      <InfoLabel>Patient ID</InfoLabel>
                      <InfoValue>{selectedSample.patient_id}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Barcode</InfoLabel>
                      <InfoValue>{selectedSample.barcode}</InfoValue>
                    </InfoItem>
                  </PatientInfoGrid>
                </PatientInfoSection>

                <TestsSection>
                  <SectionHeader>
                    <SectionTitle>
                      Tests to Transfer
                      <TestCount>{visibleTests.length}</TestCount>
                    </SectionTitle>
                    {visibleTests.length > 0 && (
                      <SelectAllContainer>
                        <Checkbox
                          type="checkbox"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          checked={allVisibleSelected}
                        />
                        <span style={{ color: "#475569" }}>Select All</span>
                      </SelectAllContainer>
                    )}
                  </SectionHeader>

                  {visibleTests.length === 0 ? (
                    <div style={{
                      textAlign: "center",
                      padding: "30px 20px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      color: "#64748b"
                    }}>
                      ✅ All tests have been transferred for this sample.
                    </div>
                  ) : (
                    <>
                      <TestTableWrapper>
                        <TestTable>
                          <TestTableHeader>
                            <TestTableRow>
                              <TestTableHead>Select</TestTableHead>
                              <TestTableHead>Test Name</TestTableHead>
                              <TestTableHead>Container</TestTableHead>
                              <TestTableHead>Status</TestTableHead>
                              <TestTableHead>Transfer To</TestTableHead>
                            </TestTableRow>
                          </TestTableHeader>
                          <tbody>
                            {parseTestDetails(selectedSample.testdetails).map((test, index) => {
                              const testKey = `${selectedSample.patient_id}_${index}`

                              // Skip already-transferred tests
                              if (testSelections[testKey] === null) return null

                              const currentStatus = testStatuses[testKey] || "Transferred"
                              const isTransferred = currentStatus === "Transferred"

                              return (
                                <TestTableRow key={index}>
                                  <TestTableCell>
                                    <Checkbox
                                      type="checkbox"
                                      checked={testSelections[testKey] || false}
                                      onChange={(e) =>
                                        handleTestSelection(testKey, e.target.checked)
                                      }
                                    />
                                  </TestTableCell>
                                  <TestTableCell>
                                    <TestName>
                                      {test.testname || test.test_name || "Unknown Test"}
                                    </TestName>
                                  </TestTableCell>
                                  <TestTableCell>
                                    <TestContainerBadge>
                                      {test.container || "Plain/Gel"}
                                    </TestContainerBadge>
                                  </TestTableCell>
                                  <TestTableCell>
                                    <Select
                                      value={currentStatus}
                                      onChange={(e) => handleStatusChange(testKey, e.target.value)}
                                    >
                                      <option value="Collected">Collected</option>
                                      <option value="Transferred">Transferred</option>
                                    </Select>
                                  </TestTableCell>
                                  <TestTableCell>
                                    <Select
                                      value={transferTo[testKey] || LAB_OPTIONS[0]}
                                      onChange={(e) =>
                                        handleTransferToChange(testKey, e.target.value)
                                      }
                                      disabled={!isTransferred}
                                      style={{
                                        borderColor: isTransferred ? "#4B9EB0" : "#e2e8f0",
                                        opacity: isTransferred ? 1 : 0.5,
                                      }}
                                    >
                                      {LAB_OPTIONS.map((lab) => (
                                        <option key={lab} value={lab}>
                                          {lab}
                                        </option>
                                      ))}
                                    </Select>
                                  </TestTableCell>
                                </TestTableRow>
                              )
                            })}
                          </tbody>
                        </TestTable>
                      </TestTableWrapper>

                      <SaveButton
                        onClick={saveTestData}
                        disabled={!hasSelectedTests || saving}
                      >
                        {saving ? "Transferring..." : "Transfer Selected Samples"}
                      </SaveButton>
                    </>
                  )}
                </TestsSection>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </>
  )
}

export default SampleTransfer