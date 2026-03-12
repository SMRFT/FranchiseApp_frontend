"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styled, { keyframes, createGlobalStyle, css } from "styled-components"
import axios from "axios"
import BarcodeScanner from "./BarcodeScanner"
import RefBy from "./RefBy"

// ============================================
// 1. THEME & GLOBAL STYLES
// ============================================

const theme = {
  colors: {
    primary: "#4F46E5", // Indigo 600
    primaryHover: "#4338ca",
    secondary: "#64748B", // Slate 500
    success: "#10B981", // Emerald 500
    warning: "#F59E0B", // Amber 500
    danger: "#EF4444", // Red 500
    background: "#F8FAFC", // Slate 50
    surface: "#FFFFFF",
    text: "#1E293B", // Slate 800
    textLight: "#64748B",
    border: "#E2E8F0",
    inputBg: "#F8FAFC",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glow: "0 0 15px rgba(79, 70, 229, 0.3)",
  },
  radius: {
    sm: "0.375rem",
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
  }
}

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* body background removed to allow global theme */
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    color: ${theme.colors.text};
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`



// ============================================
// 2. ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`

// ============================================
// 3. STYLED COMPONENTS
// ============================================

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`

const Card = styled.div`
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows.xl};
  border: 1px solid white;
  overflow: hidden;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`

const Header = styled.header`
  background: linear-gradient(to right, #fff, #f8fafc);
  padding: 2rem 2.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
  }
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const MainTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${theme.colors.text};
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, ${theme.colors.text} 0%, ${theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const SubTitle = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.textLight};
  font-weight: 500;
`

const Content = styled.div`
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

// --- Layout Grid System ---
const Section = styled.section`
  margin-bottom: 3rem;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionHeader = styled.h2`
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: ${theme.colors.textLight};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme.colors.border};
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const Col = styled.div`
  grid-column: span ${props => props.span || 12};
  
  @media (max-width: 1024px) {
    grid-column: span ${props => props.tablet || props.span || 12};
  }
  
  @media (max-width: 768px) {
    grid-column: span 12; // Stack on mobile
  }
`

// --- Form Elements ---
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.text};
  display: flex;
  justify-content: space-between;
`

const baseInputStyles = css`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.inputBg};
  color: ${theme.colors.text};
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    background: white;
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #cbd5e1;
  }
`

const Input = styled.input`
  ${baseInputStyles}
`

const Select = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.radius.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
          color: white;
          box-shadow: 0 4px 6px rgba(75, 158, 176, 0.25);
          border: none;
          &:hover:not(:disabled) { 
            background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158));
            transform: translateY(-1px);
            box-shadow: 0 6px 10px rgba(75, 158, 176, 0.3);
          }
        `
      case 'success':
        return css`
          background: ${theme.colors.success};
          color: white;
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);
          &:hover:not(:disabled) { 
            background: #059669; 
            transform: translateY(-1px);
          }
        `
      case 'warning':
        return css`
          background: ${theme.colors.warning};
          color: white;
          box-shadow: 0 4px 6px rgba(245, 158, 11, 0.25);
          &:hover:not(:disabled) { background: #d97706; transform: translateY(-1px); }
        `
      case 'danger':
        return css`
          background: ${theme.colors.danger};
          color: white;
          &:hover:not(:disabled) { background: #dc2626; }
        `
      case 'outline':
        return css`
          background: transparent;
          border: 2px solid ${theme.colors.border};
          color: ${theme.colors.text};
          &:hover:not(:disabled) { 
            border-color: ${theme.colors.textLight}; 
            background: #f8fafc;
          }
        `
      default:
        return css`
          background: ${theme.colors.primary};
          color: white;
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

// --- Specialized Components ---

const BarcodeCard = styled.div`
  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
  border: 1px solid #C7D2FE;
  border-radius: ${theme.radius.lg};
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;

  .input-wrapper {
    flex: 1;
    min-width: 250px;
  }
`

const ScannerInput = styled(Input)`
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  font-weight: 700;
  background: white;
  border-color: ${props => props.isValid ? theme.colors.success : theme.colors.border};
`

const ScanStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.isValid ? theme.colors.success : "#94a3b8"};
  color: white;
`

const ToggleSwitch = styled.div`
  background: ${props => props.isOn ? theme.colors.success : theme.colors.border};
  width: 48px;
  height: 26px;
  border-radius: 13px;
  padding: 2px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  div {
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transform: translateX(${props => props.isOn ? '22px' : '0'});
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }
`

// --- Tables & Lists ---
const TestSearchWrapper = styled.div`
  position: relative;
`

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 250px;
  overflow-y: auto;
  background: white;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.lg};
  z-index: 50;
  margin-top: 0.5rem;
`

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.1s;

  &:hover {
    background: #f8fafc;
    color: ${theme.colors.primary};
  }
  
  &:last-child { border-bottom: none; }
`

const TableWrapper = styled.div`
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
  background: white;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: ${theme.colors.textLight};
    font-weight: 700;
    border-bottom: 1px solid ${theme.colors.border};
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid ${theme.colors.border};
    color: ${theme.colors.text};
    font-size: 0.95rem;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafafa; }
`

// --- Financial / Summary ---
const SummaryCard = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.radius.lg};
  padding: 1.5rem;
  border: 1px solid ${theme.colors.border};
`

const FinancialRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &.total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px dashed ${theme.colors.border};
    font-size: 1.25rem;
    font-weight: 800;
    color: ${theme.colors.primary};
  }

  span.label { color: ${theme.colors.textLight}; font-size: 0.9rem; font-weight: 500; }
  span.value { color: ${theme.colors.text}; font-weight: 700; font-family: 'Courier New', monospace; }
`

// --- Toasts & Overlays ---
const ToastContainer = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Toast = styled.div`
  min-width: 320px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding: 1rem;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.lg};
  border-left: 4px solid ${props => theme.colors[props.type] || theme.colors.primary};
  animation: ${slideInRight} 0.3s ease forwards;
  display: flex;
  align-items: start;
  gap: 0.75rem;

  .icon { font-size: 1.25rem; }
  .content { flex: 1; }
  .title { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.25rem; }
  .message { font-size: 0.8rem; color: ${theme.colors.textLight}; }
`

const StatusBanner = styled.div`
  background: ${props => {
    if (props.status === 'registered') return '#ECFDF5'; // emerald 50
    if (props.status === 'billed') return '#EFF6FF'; // blue 50
    return '#F3F4F6';
  }};
  color: ${props => {
    if (props.status === 'registered') return '#047857';
    if (props.status === 'billed') return '#1D4ED8';
    return '#374151';
  }};
  border: 1px solid ${props => {
    if (props.status === 'registered') return '#A7F3D0';
    if (props.status === 'billed') return '#BFDBFE';
    return '#E5E7EB';
  }};
  padding: 1rem;
  border-radius: ${theme.radius.md};
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 600;
  animation: ${fadeIn} 0.5s ease;
`

// --- Icons (Simple SVG Components) ---
const Icons = {
  Scan: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2m2-8h14" /></svg>,
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  User: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Trash: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
}

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);
`
const ModalContent = styled.div`
  background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 800px;
  max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`

// ==================================================
// HELPER FUNCTIONS
// ==================================================
function getCurrentDateTime() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 16)
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return ""
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  if (birthDate > today) return ""
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age.toString()
}

function calculateDOBFromAge(age) {
  if (!age || isNaN(age)) return ""
  const today = new Date()
  const birthYear = today.getFullYear() - parseInt(age)
  const approximateDOB = new Date(birthYear, today.getMonth(), today.getDate())
  return approximateDOB.toISOString().split("T")[0]
}


const PatientRegistrationAndBilling = () => {
  const navigate = useNavigate()
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL
  // Refs & State
  const processedBarcodes = useRef(new Set())
  const storedFranchiseId = localStorage.getItem("franchise_id") || ""

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: "",
    city: "",
    area: "",
    pincode: "",
    address: "",
    registrationDate: getCurrentDateTime(),
    referredDoctor: "",
    franchise_id: storedFranchiseId,
  })

  const [trfFile, setTrfFile] = useState(null)
  const [testList, setTestList] = useState([])
  const [patientSearchQuery, setPatientSearchQuery] = useState("")
  const [testSearchQuery, setTestSearchQuery] = useState("")
  const [selectedTests, setSelectedTests] = useState([])
  const [total, setTotal] = useState(0)
  const [discountPercentage, setDiscountPercentage] = useState("")
  const [discountAmount, setDiscountAmount] = useState("")
  const [netAmount, setNetAmount] = useState(0)
  const [payments, setPayments] = useState([{ mode: "Cash", amount: "", referenceNumber: "" }])
  const [paymentMode, setPaymentMode] = useState("Cash") // Keep for backward compatibility or primary mode logic
  const [isHomeCollection, setIsHomeCollection] = useState(false)
  const [toasts, setToasts] = useState([])
  const [registrationStatus, setRegistrationStatus] = useState("pending")
  const [currentPatientId, setCurrentPatientId] = useState("")
  const [currentRegistrationId, setCurrentRegistrationId] = useState("")
  const [revenueInfo, setRevenueInfo] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const [barcodeId, setbarcodeId] = useState("")
  const [barcodeValidated, setBarcodeValidated] = useState(false)
  const [showRefByModal, setShowRefByModal] = useState(false)
  const [refByList, setRefByList] = useState([])
  const [walletBalance, setWalletBalance] = useState(null)

  const [showPendingModal, setShowPendingModal] = useState(false)
  const [pendingRegistrations, setPendingRegistrations] = useState([])
  const [loadingPending, setLoadingPending] = useState(false)
  // Toast Logic
  const showToast = (type, title, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }

  // Effects
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${franchiseurl}test-details/`)
        setTestList(response.data || [])
      } catch (error) {
        console.error("Failed to fetch test details", error)
      }
    }
    fetchTests()
  }, [franchiseurl])

  const fetchRefBy = async () => {
    try {
      if (!storedFranchiseId) return;
      const response = await axios.get(`${franchiseurl}refby/?franchise_id=${storedFranchiseId}`)
      setRefByList(response.data || [])
    } catch (error) {
      console.error("Failed to fetch refby details", error)
    }
  }

  const fetchWalletBalance = async () => {
    try {
      if (!storedFranchiseId) return;
      const response = await axios.get(`${franchiseurl}get-wallet-balance/?franchise_id=${storedFranchiseId}`)
      setWalletBalance(response.data.available_balance)
    } catch (error) {
      console.error("Failed to fetch wallet balance", error)
    }
  }

  useEffect(() => {
    fetchRefBy()
    fetchWalletBalance()
  }, [franchiseurl, storedFranchiseId])

  useEffect(() => {
    const totalAmt = selectedTests.reduce((acc, test) => acc + parseFloat(test.MRP || 0), 0)
    setTotal(totalAmt)

    let finalDiscountAmt = 0
    if (discountPercentage && !isNaN(discountPercentage)) {
      const percentage = parseFloat(discountPercentage)
      if (percentage >= 0 && percentage <= 100) {
        finalDiscountAmt = (totalAmt * percentage) / 100
        setDiscountAmount(finalDiscountAmt.toFixed(2))
      }
    } else if (!discountPercentage) {
      setDiscountAmount("")
      finalDiscountAmt = 0
    } else {
      finalDiscountAmt = discountAmount ? parseFloat(discountAmount) : 0
    }

    setNetAmount(Math.max(0, totalAmt - finalDiscountAmt))
  }, [selectedTests, discountPercentage, discountAmount])

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "dateOfBirth") {
      setFormData({ ...formData, [name]: value, age: calculateAge(value) })
    } else if (name === "age") {
      setFormData({ ...formData, [name]: value, dateOfBirth: calculateDOBFromAge(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileChange = (e) => setTrfFile(e.target.files[0])

  const clearBarcode = () => {
    setbarcodeId("")
    setBarcodeValidated(false)
    processedBarcodes.current.clear()
    showToast("warning", "Cleared", "Barcode input cleared")
  }

  const handleScanSuccess = async (scannedCode) => {
    if (processedBarcodes.current.has(scannedCode)) return
    processedBarcodes.current.add(scannedCode)

    try {
      const check = await axios.get(`${franchiseurl}check-barcode-exists/?barcodeId=${scannedCode}`)

      if (check.data.exists) {
        showToast("danger", "Error", check.data.message || "Barcode already used")
        processedBarcodes.current.delete(scannedCode) // Allow retry
        return
      }

      if (!check.data.valid) {
        showToast("danger", "Error", check.data.message || "Invalid Barcode")
        processedBarcodes.current.delete(scannedCode) // Allow retry
        return
      }

      setbarcodeId(scannedCode)
      setBarcodeValidated(true)
      showToast("success", "Success", "Barcode validated")
      setShowScanner(false)
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        showToast("danger", "Error", data.error || data.message || (typeof data === "string" ? data : "Verification failed"));
      } else {
        showToast("danger", "Error", error.message || "Verification failed");
      }
      processedBarcodes.current.delete(scannedCode)
    }
  }

  // Payment Helpers
  const handleAddPayment = () => {
    setPayments([...payments, { mode: "Cash", amount: "", referenceNumber: "" }])
  }

  const handleRemovePayment = (index) => {
    const newPayments = [...payments]
    newPayments.splice(index, 1)
    setPayments(newPayments)
  }

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...payments]
    newPayments[index][field] = value
    setPayments(newPayments)
  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    if (!barcodeId || !barcodeValidated) return showToast("danger", "Required", "Scan valid barcode first")
    if (selectedTests.length === 0) return showToast("danger", "Required", "Select at least one test")

    // Validate payments
    const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    if (Math.abs(totalPaid - netAmount) > 0.01) {
      return showToast("danger", "Payment Error", `Total paid (${totalPaid}) must match Net Amount (${netAmount})`)
    }

    try {
      const form = new FormData()
      form.append("patientname", `${formData.title} ${formData.firstName} ${formData.lastName}`.trim())
      Object.keys(formData).forEach(key => {
        if (key !== 'title' && key !== 'firstName' && key !== 'lastName') form.append(key, formData[key])
      })
      form.append("testdetails", JSON.stringify(selectedTests.map(t => ({ test_id: t.test_id, test_name: t.test_name, MRP: t.MRP }))))
      form.append("total", total)
      form.append("discountPercentage", discountPercentage || "0")
      form.append("discountAmount", discountAmount || "0")
      form.append("netAmount", netAmount)
      form.append("paymentMode", payments[0].mode)
      form.append("payments", JSON.stringify(payments))
      form.append("segment", isHomeCollection ? "Home Collection" : "Walkin")
      form.append("barcodeId", barcodeId)
      if (trfFile) form.append("trf", trfFile)

      const response = await axios.post(`${franchiseurl}registerpatientdetails/`, form, { headers: { "Content-Type": "multipart/form-data" } })

      setCurrentPatientId(response.data.patient_id)
      setRegistrationStatus("registered")
      showToast("success", "Registered", `Patient ID: ${response.data.patient_id}`)
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (data.error) {
          showToast("danger", "Registration Failed", data.error);
          if (data.details && typeof data.details === "object") {
            Object.entries(data.details).forEach(([field, msgs]) => {
              showToast("danger", `Error in ${field}`, Array.isArray(msgs) ? msgs.join(', ') : String(msgs));
            });
          }
        } else if (data.message) {
          showToast("danger", "Failed", data.message);
        } else if (typeof data === "object") {
          Object.entries(data).forEach(([field, msgs]) => {
            showToast("danger", `Error in ${field}`, Array.isArray(msgs) ? msgs.join(', ') : String(msgs));
          });
        } else {
          showToast("danger", "Failed", String(data));
        }
      } else {
        showToast("danger", "Failed", err.message || "Registration failed");
      }
    }
  }

  const handleBillingConfirmation = async () => {
    try {
      const res = await axios.patch(`${franchiseurl}confirm-billing/`, {
        barcode: barcodeId,
        billed_amount: netAmount,
        franchise_id: formData.franchise_id
      })
      setRegistrationStatus("billed")
      setRevenueInfo(res.data)
      showToast("success", "Confirmed", "Billing confirmed successfully")
      setTimeout(resetForm, 3000)
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        showToast("danger", "Failed", data.error || data.message || (typeof data === "string" ? data : "Billing confirmation failed"));
      } else {
        showToast("danger", "Failed", err.message || "Billing confirmation failed");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "", firstName: "", lastName: "", dateOfBirth: "", age: "", gender: "", phoneNumber: "", email: "", city: "", area: "", pincode: "",
      registrationDate: getCurrentDateTime(), referredDoctor: "", franchise_id: storedFranchiseId,
    })
    setTrfFile(null); setSelectedTests([]); setDiscountPercentage(""); setDiscountAmount(""); setbarcodeId("");
    setRegistrationStatus("pending"); setRevenueInfo(null); processedBarcodes.current.clear()
  }

  const handleSearch = async () => {
    if (!patientSearchQuery.trim()) return showToast("warning", "Input", "Enter ID or Phone")
    try {
      const res = await axios.get(`${franchiseurl}search-patient/?query=${patientSearchQuery.trim()}`)
      if (res.data?.patient) {
        const d = res.data.patient
        const [t, f, ...l] = (d.patientname || "").split(" ")
        setFormData(prev => ({
          ...prev,
          title: t || "", firstName: f || "", lastName: l.join(" ") || "",
          dateOfBirth: d.dateOfBirth || "", age: d.age?.toString() || "", gender: d.gender || "",
          phoneNumber: d.phoneNumber || "", email: d.email || "", city: d.city || "", area: d.area || "", pincode: d.pincode || "",
          patient_id: d.patient_id
        }))
        showToast("success", "Found", "Patient details loaded")
      } else showToast("warning", "Not Found", "No record found")
    } catch (e) {
      const data = e.response?.data;
      if (data) {
        showToast("danger", "Error", data.error || data.message || (typeof data === "string" ? data : "Search failed"));
      } else {
        showToast("danger", "Error", e.message || "Search failed");
      }
    }
  }

  const fetchPendingRegistrations = async () => {
    try {
      setLoadingPending(true)
      const dateStr = new Date().toISOString().split('T')[0]
      const res = await axios.get(`${franchiseurl}registrations/?franchise_id=${storedFranchiseId}&date=${dateStr}`)
      const pending = (res.data || []).filter(r => r.billing_status === 'Pending')
      setPendingRegistrations(pending)
      setShowPendingModal(true)
    } catch (e) {
      showToast("danger", "Error", "Failed to fetch pending registrations")
    } finally {
      setLoadingPending(false)
    }
  }

  const handleSelectPending = async (reg) => {
    try {
      setbarcodeId(reg.barcode)
      setBarcodeValidated(true)
      setDiscountPercentage(reg.discountPercentage || "")
      setDiscountAmount(reg.discountAmount || "")

      let tests = []
      try {
        tests = typeof reg.testdetails === 'string' ? JSON.parse(reg.testdetails) : (reg.testdetails || [])
        tests = tests.map((t, idx) => ({ ...t, _id: t._id || t.test_id || String(idx), test_name: t.test_name || t.testname }))
      } catch (e) { }
      setSelectedTests(tests)

      let pmts = []
      try { pmts = typeof reg.payments === 'string' ? JSON.parse(reg.payments) : (reg.payments || []) } catch (e) { }
      if (!pmts.length && reg.paymentMode) pmts = [{ mode: reg.paymentMode, amount: reg.netAmount, referenceNumber: "" }]
      if (!pmts.length) pmts = [{ mode: "Cash", amount: "", referenceNumber: "" }]
      setPayments(pmts)

      setRegistrationStatus("registered")
      setShowPendingModal(false)

      const patientId = reg.patient || reg.patient_id
      if (patientId) {
        const res = await axios.get(`${franchiseurl}search-patient/?query=${patientId}`)
        if (res.data?.patient) {
          const d = res.data.patient
          const [t, f, ...l] = (d.patientname || "").split(" ")

          let title = "", firstName = "", lastName = ""
          if (["Mr", "Mrs", "Ms", "Dr"].includes(t)) {
            title = t
            firstName = f || ""
            lastName = l.join(" ")
          } else {
            firstName = t || ""
            lastName = [f, ...l].filter(Boolean).join(" ")
          }

          setFormData(prev => ({
            ...prev,
            title: title, firstName: firstName, lastName: lastName,
            dateOfBirth: d.dateOfBirth || "", age: d.age?.toString() || "", gender: d.gender || "",
            phoneNumber: d.phoneNumber || "", email: d.email || "", city: d.city || "", area: d.area || "", pincode: d.pincode || "",
            patient_id: d.patient_id,
            registrationDate: reg.registrationDate ? reg.registrationDate.slice(0, 16) : getCurrentDateTime(),
            referredDoctor: reg.referredDoctor || "",
          }))
        }
      }
      showToast("success", "Loaded", `Loaded pending registration for ${reg.barcode}`)
    } catch (e) {
      showToast("danger", "Error", "Failed to load full patient details")
    }
  }

  const isReadOnly = registrationStatus === "billed"

  return (
    <>
      <GlobalStyle />
      <ToastContainer>
        {toasts.map(t => (
          <Toast key={t.id} type={t.type}>
            <div className="icon">{t.type === 'success' ? '✅' : t.type === 'danger' ? '❌' : 'ℹ️'}</div>
            <div className="content">
              <div className="title">{t.title}</div>
              <div className="message">{t.message}</div>
            </div>
          </Toast>
        ))}
      </ToastContainer>

      {showScanner && <BarcodeScanner onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />}
      <RefBy show={showRefByModal} setShow={setShowRefByModal} onRefByAdded={() => {
        showToast("success", "Added", "New doctor added")
        fetchRefBy()
      }} />

      {showPendingModal && (
        <ModalOverlay onClick={() => setShowPendingModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Today's Pending Registrations</h3>
              <Button type="button" variant="outline" onClick={() => setShowPendingModal(false)}>Close</Button>
            </div>
            {pendingRegistrations.length === 0 ? (
              <p>No pending registrations for today.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Barcode</th>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Patient Name</th>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Phone</th>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Net Amount</th>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRegistrations.map(reg => (
                    <tr key={reg.barcode} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>{reg.barcode}</td>
                      <td style={{ padding: '0.75rem' }}>{reg.patient_info?.patientname || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{reg.patient_info?.phoneNumber || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>₹{reg.netAmount}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <Button type="button" variant="primary" style={{ padding: '4px 12px' }} onClick={() => handleSelectPending(reg)}>Select</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      <LayoutWrapper>
        <Card>
          <Header>
            <TitleGroup>
              <MainTitle>Patient Registration</MainTitle>
              <SubTitle>Lab Operations / New Entry</SubTitle>
            </TitleGroup>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {walletBalance !== null && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{
                    background: walletBalance < 1000 ? '#FEF2F2' : '#F0FDF4',
                    color: walletBalance < 1000 ? '#DC2626' : '#16A34A',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    border: `1px solid ${walletBalance < 1000 ? '#FCA5A5' : '#86EFAC'}`
                  }}>
                    Wallet Balance: ₹{walletBalance.toFixed(2)}
                  </div>
                  {walletBalance < 1000 && (
                    <Button type="button" variant="danger" onClick={() => navigate('/PaymentGateway')}>
                      Recharge Wallet
                    </Button>
                  )}
                </div>
              )}
              <Button type="button" variant="outline" onClick={fetchPendingRegistrations}>
                {loadingPending ? 'Loading...' : 'Pending Registrations'}
              </Button>
            </div>

            {registrationStatus !== 'pending' && (
              <StatusBanner status={registrationStatus}>
                {registrationStatus === 'registered' ? '✅ Patient Registered - Confirm Billing' : '💰 Transaction Complete'}
              </StatusBanner>
            )}
          </Header>

          <Content>
            <form onSubmit={handleRegistration}>

              {/* 1. Search & Barcode */}
              <Section>
                <Grid>
                  <Col span={5}>
                    <SectionHeader>Patient Search</SectionHeader>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <FormGroup style={{ flex: 1 }}>
                        <Label>Search ID / Phone</Label>
                        <Input
                          value={patientSearchQuery}
                          onChange={e => setPatientSearchQuery(e.target.value)}
                          placeholder="Enter details..."
                          disabled={isReadOnly}
                        />
                      </FormGroup>
                      <Button type="button" variant="primary" onClick={handleSearch} disabled={isReadOnly}>
                        <Icons.Search />
                      </Button>
                    </div>
                  </Col>

                  <Col span={7}>
                    <SectionHeader>Sample Identification</SectionHeader>
                    <BarcodeCard>
                      <div className="input-wrapper">
                        <FormGroup>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Barcode</Label>
                            {barcodeValidated && <ScanStatus isValid>Verified</ScanStatus>}
                          </div>
                          <ScannerInput
                            value={barcodeId}
                            readOnly
                            placeholder="Waiting for scan..."
                            isValid={barcodeValidated}
                          />
                        </FormGroup>
                      </div>
                      <Button type="button" variant="success" onClick={() => setShowScanner(true)} disabled={isReadOnly}>
                        <Icons.Scan /> Scan
                      </Button>
                      {barcodeId && (
                        <Button type="button" variant="outline" onClick={clearBarcode} disabled={isReadOnly}>
                          Reset
                        </Button>
                      )}
                    </BarcodeCard>
                  </Col>
                </Grid>
              </Section>

              {/* 2. Demographics */}
              <Section>
                <SectionHeader>Patient Details</SectionHeader>
                <Grid>
                  <Col span={2} tablet={3}>
                    <FormGroup>
                      <Label>Title</Label>
                      <Select name="title" value={formData.title} onChange={handleChange} required disabled={isReadOnly}>
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </Select>
                    </FormGroup>
                  </Col>
                  <Col span={5} tablet={9}>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isReadOnly} />
                    </FormGroup>
                  </Col>
                  <Col span={5}>
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isReadOnly} />
                    </FormGroup>
                  </Col>

                  <Col span={3}>
                    <FormGroup>
                      <Label>DOB</Label>
                      <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} disabled={isReadOnly} />
                    </FormGroup>
                  </Col>
                  <Col span={2}>
                    <FormGroup>
                      <Label>Age</Label>
                      <Input type="number" name="age" value={formData.age} onChange={handleChange} required disabled={isReadOnly} />
                    </FormGroup>
                  </Col>
                  <Col span={3}>
                    <FormGroup>
                      <Label>Gender</Label>
                      <Select name="gender" value={formData.gender} onChange={handleChange} required disabled={isReadOnly}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormGroup>
                  </Col>
                  <Col span={4}>
                    <FormGroup>
                      <Label>Phone</Label>
                      <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required disabled={isReadOnly} />
                    </FormGroup>
                  </Col>

                  <Col span={4}>
                    <FormGroup>
                      <Label>City</Label>
                      <Input name="city" value={formData.city} onChange={handleChange} required disabled={isReadOnly} />
                    </FormGroup>
                  </Col>
                  <Col span={4}>
                    <FormGroup>
                      <Label>District</Label>
                      <Input name="area" value={formData.area} onChange={handleChange} disabled={isReadOnly} />
                    </FormGroup>
                  </Col>
                  <Col span={4}>
                    <FormGroup>
                      <Label>Pincode</Label>
                      <Input name="pincode" value={formData.pincode} onChange={handleChange} disabled={isReadOnly} />
                    </FormGroup>
                  </Col>
                  {isHomeCollection && (
                    <Col span={12}>
                      <FormGroup>
                        <Label>Address</Label>
                        <Input name="address" value={formData.address} onChange={handleChange} required disabled={isReadOnly} />
                      </FormGroup>
                    </Col>
                  )}
                </Grid>
              </Section>

              {/* 3. Visit Info */}
              <Section>
                <SectionHeader>Visit Information</SectionHeader>
                <Grid>
                  <Col span={4}>
                    <FormGroup>
                      <Label>Referred By</Label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Input
                          list="refByOptions"
                          name="referredDoctor"
                          value={formData.referredDoctor}
                          onChange={handleChange}
                          placeholder="Doctor Name"
                          disabled={isReadOnly}
                          required
                        />
                        <datalist id="refByOptions">
                          {refByList.map((doc, idx) => (
                            <option key={idx} value={doc.name} />
                          ))}
                        </datalist>
                        <Button type="button" variant="primary" onClick={() => setShowRefByModal(true)} disabled={isReadOnly} style={{ padding: '0.5rem 1rem' }}>
                          +
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col span={4}>
                    <FormGroup>
                      <Label>Upload TRF</Label>
                      <Input type="file" onChange={handleFileChange} disabled={isReadOnly} style={{ padding: '0.5rem' }} />
                    </FormGroup>
                  </Col>

                  <Col span={4}>
                    <FormGroup>
                      <Label>Collection Type</Label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '42px' }}>
                        <span style={{ fontSize: '0.9rem', color: !isHomeCollection ? theme.colors.text : theme.colors.textLight }}>Walk-in</span>
                        <ToggleSwitch isOn={isHomeCollection} onClick={() => !isReadOnly && setIsHomeCollection(!isHomeCollection)}>
                          <div />
                        </ToggleSwitch>
                        <span style={{ fontSize: '0.9rem', color: isHomeCollection ? theme.colors.text : theme.colors.textLight }}>Home Visit</span>
                      </div>
                    </FormGroup>
                  </Col>
                </Grid>
              </Section>

              {/* 4. Tests & Billing */}
              <Section>
                <Grid>
                  {/* Left: Test Selection */}
                  <Col span={7}>
                    <SectionHeader>Test Selection</SectionHeader>
                    <FormGroup style={{ marginBottom: '1rem' }}>
                      <TestSearchWrapper>
                        <Input
                          placeholder="Search test name..."
                          value={testSearchQuery}
                          onChange={e => setTestSearchQuery(e.target.value)}
                          disabled={isReadOnly}
                        />
                        {testSearchQuery && !isReadOnly && (
                          <DropdownList>
                            {testList
                              .filter(t => t.test_name?.toLowerCase().includes(testSearchQuery.toLowerCase()))
                              .map((test) => (
                                <DropdownItem key={test._id} onClick={() => {
                                  if (!selectedTests.find(t => t._id === test._id)) setSelectedTests([...selectedTests, test])
                                  setTestSearchQuery("")
                                }}>
                                  <div style={{ fontWeight: 600 }}>{test.test_name}</div>
                                  <div style={{ fontSize: '0.8rem', color: theme.colors.success }}>₹{test.MRP}</div>
                                </DropdownItem>
                              ))}
                          </DropdownList>
                        )}
                      </TestSearchWrapper>
                    </FormGroup>

                    {selectedTests.length > 0 && (
                      <TableWrapper>
                        <Table>
                          <thead>
                            <tr>
                              <th>Test Name</th>
                              <th>Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTests.map((test) => (
                              <tr key={test._id}>
                                <td>{test.test_name}</td>
                                <td>₹{test.MRP}</td>
                                <td>
                                  <Button type="button" variant="danger" disabled={isReadOnly} style={{ padding: '4px 8px' }} onClick={() => setSelectedTests(s => s.filter(t => t._id !== test._id))}>
                                    <Icons.Trash />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </TableWrapper>
                    )}
                  </Col>

                  {/* Right: Billing Summary */}
                  <Col span={5}>
                    <SectionHeader>Billing Summary</SectionHeader>
                    <SummaryCard>
                      <FinancialRow>
                        <span className="label">Subtotal</span>
                        <span className="value">₹{total.toFixed(2)}</span>
                      </FinancialRow>

                      <FinancialRow>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="label">Discount %</span>
                          <Input
                            type="number"
                            style={{ width: '60px', padding: '4px 8px', height: 'auto' }}
                            value={discountPercentage}
                            onChange={e => setDiscountPercentage(e.target.value)}
                            disabled={isReadOnly}
                          />
                        </div>
                        <span className="value" style={{ color: theme.colors.danger }}>- ₹{discountAmount || "0.00"}</span>
                      </FinancialRow>

                      {/* Multiple Payments UI */}
                      <div style={{ marginTop: '1rem', borderTop: `1px dashed ${theme.colors.border}`, paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: theme.colors.textLight }}>Payments</span>
                          {!isReadOnly && (
                            <Button type="button" variant="outline" style={{ padding: '2px 8px', fontSize: '0.8rem' }} onClick={handleAddPayment}>
                              + Add
                            </Button>
                          )}
                        </div>

                        {payments.map((payment, index) => (
                          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <Select
                              style={{ width: '80px', padding: '4px', height: '32px', fontSize: '0.85rem' }}
                              value={payment.mode}
                              onChange={e => handlePaymentChange(index, 'mode', e.target.value)}
                              disabled={isReadOnly}
                            >
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="Due">Due</option>
                            </Select>
                            <Input
                              type="number"
                              placeholder="Amt"
                              style={{ width: '70px', padding: '4px', height: '32px', fontSize: '0.85rem' }}
                              value={payment.amount}
                              onChange={e => handlePaymentChange(index, 'amount', e.target.value)}
                              disabled={isReadOnly}
                            />
                            {payment.mode === 'UPI' && (
                              <Input
                                placeholder="Ref #"
                                style={{ flex: 1, padding: '4px', height: '32px', fontSize: '0.85rem' }}
                                value={payment.referenceNumber}
                                onChange={e => handlePaymentChange(index, 'referenceNumber', e.target.value)}
                                disabled={isReadOnly}
                                required
                              />
                            )}
                            {!isReadOnly && payments.length > 1 && (
                              <Button type="button" variant="danger" style={{ padding: '4px', height: '32px', width: '32px' }} onClick={() => handleRemovePayment(index)}>
                                <Icons.Trash />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <FinancialRow className="total">
                        <span>Net Payable</span>
                        <span>₹{netAmount.toFixed(2)}</span>
                      </FinancialRow>

                      <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
                        {registrationStatus === 'pending' && (
                          <Button type="submit" variant="primary" style={{ width: '100%' }}>
                            Register Patient
                          </Button>
                        )}

                        {registrationStatus === 'registered' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Button type="submit" variant="primary" style={{ width: '100%' }}>
                              Update Registration
                            </Button>
                            <Button type="button" variant="success" style={{ width: '100%' }} onClick={handleBillingConfirmation}>
                              Confirm Payment
                            </Button>
                          </div>
                        )}

                        {registrationStatus === 'billed' && (
                          <Button type="button" variant="primary" style={{ width: '100%' }} onClick={resetForm}>
                            Start New Registration
                          </Button>
                        )}
                      </div>
                    </SummaryCard>

                    {revenueInfo && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#EFF6FF', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <strong>Transaction Details:</strong><br />
                        Franchise Share: ₹{revenueInfo.franchise_share?.toFixed(2)}<br />
                        Monthly Total: ₹{revenueInfo.monthly_total?.toFixed(2)}
                      </div>
                    )}
                  </Col>
                </Grid>
              </Section>

            </form >
          </Content >
        </Card >
      </LayoutWrapper >
    </>
  )
}

export default PatientRegistrationAndBilling