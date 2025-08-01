"use client"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import axios from "axios"
import GlobalStyle from "./GlobalStyle"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const toastSlideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const toastSlideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

const progressBar = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`

const scannerFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const FormWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0 1rem;
  }
`

const Form = styled.form`
  width: 100%;
`

const FormSection = styled.div`
  margin-bottom: 1.5rem;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
`

const SectionTitle = styled.h5`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '${(props) => props.icon || "📋"}';
    font-size: 1rem;
  }
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
  margin-bottom: 15px;
`

const Col = styled.div`
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 8px;
  
  @media (max-width: 992px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  @media (max-width: 576px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`

const SearchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
  margin-bottom: 20px;
  align-items: end;
`

const SearchCol = styled.div`
  flex: 1;
  padding: 0 8px;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    margin-bottom: 10px;
  }
`

const ButtonCol = styled.div`
  flex: 0 0 auto;
  padding: 0 8px;
  display: flex;
  gap: 8px;
  align-items: center;
`

const BarcodeSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const BarcodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const BarcodeInputWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`

const BarcodeActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const FormGroup = styled.div`
  margin-bottom: 15px;
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  
  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
    background: #fafafa;
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
  
  &.barcode-input {
    background: ${(props) => (props.value ? "linear-gradient(135deg, #f0f9ff, #e0f2fe)" : "white")};
    border-color: ${(props) => (props.value ? "#0ea5e9" : "#e2e8f0")};
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: ${(props) => (props.value ? "#0c4a6e" : "#2d3748")};
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
    background: #fafafa;
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
  
  option {
    padding: 0.5rem;
    font-weight: 500;
  }
`

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const ScannerButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 8px;
  padding: 0.625rem;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ClearButton = styled.button`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const BarcodeStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.isValid ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #6b7280, #4b5563)"};
  color: white;
  
  &::before {
    content: '${(props) => (props.isValid ? "✅" : "⏳")}';
    font-size: 0.875rem;
  }
`

const ScannerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${scannerFadeIn} 0.3s ease-out;
`

const ScannerModal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`

const ScannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const ScannerTitle = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
  background: #e53e3e;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c53030;
    transform: scale(1.1);
  }
`

const ScannerViewport = styled.div`
  width: 100%;
  max-width: 640px;
  height: 400px;
  border: 2px solid #667eea;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-color: #000;
  margin: 0 auto;
  
  #interactive {
    width: 100%;
    height: 100%;
  }
  
  #interactive video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  #interactive canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .drawingBuffer {
    position: absolute;
    top: 0;
    left: 0;
  }
`

const ScannerControls = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`

const ScannerControlButton = styled.button`
  background: ${(props) => (props.$scanning ? "#e74c3c" : "#3498db")};
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) => (props.$scanning ? "#c0392b" : "#2980b9")};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`

const ScanMessage = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid #ffeaa7;
  text-align: center;
`

const ScanResult = styled.div`
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
`

const ScanResultCode = styled.div`
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #0c4a6e;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

const ScanResultFormat = styled.div`
  background: #0ea5e9;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: uppercase;
  display: inline-block;
`

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 25px;
  background: ${(props) => (props.isOn ? "linear-gradient(135deg, #667eea, #764ba2)" : "#cbd5e0")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.isOn ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)")};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) => (props.isOn ? "0 6px 20px rgba(102, 126, 234, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.15)")};
  }
`

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.isOn ? "27px" : "2px")};
  width: 21px;
  height: 21px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`

const ToggleLabel = styled.span`
  font-weight: 600;
  color: ${(props) => (props.isActive ? "#667eea" : "#718096")};
  font-size: 0.875rem;
  transition: color 0.3s ease;
`

const SegmentIndicator = styled.div`
  background: ${(props) => (props.isHomeCollection ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #f59e0b, #d97706)")};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '${(props) => (props.isHomeCollection ? "🏠" : "🚶")}';
    font-size: 0.875rem;
  }
`

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Toast = styled.div`
  display: flex;
  align-items: center;
  min-width: 350px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${(props) => (props.isExiting ? toastSlideOut : toastSlideIn)} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.type === "success"
      ? "linear-gradient(135deg, #10b981, #059669)"
      : props.type === "info"
        ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
        : "linear-gradient(135deg, #ef4444, #dc2626)"};
  color: white;
  
  @media (max-width: 480px) {
    min-width: calc(100vw - 40px);
    margin: 0 10px;
  }
`

const ToastIcon = styled.div`
  margin-right: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
`

const ToastContent = styled.div`
  flex: 1;
`

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
`

const ToastMessage = styled.div`
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
`

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const ToastProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: ${progressBar} ${(props) => props.duration}ms linear;
`

const InfoSection = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-top: 25px;
  border-left: 4px solid #667eea;
  
  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 20px;
  }
`

const InfoTitle = styled.h3`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '📋';
    font-size: 1rem;
  }
`

const AgeIndicator = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #667eea;
  color: white;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  pointer-events: none;
`

// Scanner Icon SVG Component
const ScannerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7V5H5V7H3ZM17 5V3H19C20.1046 3 21 3.89543 21 5V7H19V5H17ZM7 19V21H5C3.89543 21 3 20.1046 3 19V17H5V19H7ZM19 17V19C19 20.1046 18.1046 21 17 21H19V19H17V17H19ZM2 11H22V13H2V11Z" />
  </svg>
)

// Scanner Hook
const useQuaggaScanner = (onDetected) => {
  const scannerRef = useRef(null)

  const initScanner = () => {
    if (typeof window !== "undefined" && window.Quagga) {
      window.Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          numOfWorkers: 2,
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
            ],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error("Quagga initialization error:", err)
            return
          }
          window.Quagga.start()
        },
      )

      window.Quagga.onDetected(onDetected)
    }
  }

  const stopScanner = () => {
    if (typeof window !== "undefined" && window.Quagga) {
      window.Quagga.stop()
      window.Quagga.offDetected(onDetected)
    }
  }

  return { scannerRef, initScanner, stopScanner }
}

// Scanner Component
const Scanner = ({ onDetected }) => {
  const { scannerRef, initScanner, stopScanner } = useQuaggaScanner(onDetected)

  useEffect(() => {
    initScanner()
    return () => stopScanner()
  }, [])

  return (
    <ScannerViewport>
      <div id="interactive" ref={scannerRef} />
    </ScannerViewport>
  )
}

function getCurrentDateTime() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 16)
}

// Utility function to calculate age from date of birth
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

// Utility function to calculate approximate DOB from age
function calculateDOBFromAge(age) {
  if (!age || isNaN(age)) return ""
  const today = new Date()
  const birthYear = today.getFullYear() - Number.parseInt(age)
  const approximateDOB = new Date(birthYear, today.getMonth(), today.getDate())
  return approximateDOB.toISOString().split("T")[0]
}

const PatientRegistrationAndBilling = () => {
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL
  const franchiseName = localStorage.getItem("franchise_name")

  // Refs to prevent multiple API calls
  const processedBarcodes = useRef(new Set())
  const isProcessingBarcode = useRef(false)

// useEffect(() => {
//   const id = localStorage.getItem("franchise_id");
//   console.log("ID fetched from localStorage:", id); // Debug
//   setFormData((prev) => ({
//     ...prev,
//     franchise_id: id || "",
//   }));
// }, []);
const storedFranchiseId = localStorage.getItem("franchise_id") || "";

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
  const [discount, setDiscount] = useState("")
  const [netAmount, setNetAmount] = useState(0)
  const [paymentMode, setPaymentMode] = useState("Cash")
  const [isHomeCollection, setIsHomeCollection] = useState(false)
  const [toasts, setToasts] = useState([])

  // Scanner states
  const [showScanner, setShowScanner] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanMessage, setScanMessage] = useState(null)
  const [scanError, setScanError] = useState(null)
  const [barcodeId, setbarcodeId] = useState("")
  const [barcodeValidated, setBarcodeValidated] = useState(false)

  const showToast = (type, title, message) => {
    const id = Date.now()
    const newToast = { id, type, title, message, isExiting: false }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)))

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${franchiseurl}test-details/`)
        setTestList(response.data || [])
      } catch (error) {
        console.error("Failed to fetch test details:", error)
      }
    }

    fetchTests()
  }, [])

  useEffect(() => {
    const totalAmt = selectedTests.reduce((acc, test) => acc + Number.parseFloat(test.MRP || 0), 0)
    let discountAmt = 0

    if (discount.toString().includes("%")) {
      const percentage = Number.parseFloat(discount.replace("%", ""))
      discountAmt = (totalAmt * percentage) / 100
    } else {
      discountAmt = Number.parseFloat(discount || 0)
    }

    const netAmt = Math.max(0, totalAmt - discountAmt)
    setTotal(totalAmt)
    setNetAmount(netAmt)
  }, [selectedTests, discount])

  // Check if Quagga is available
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Quagga) {
      setScanError("Quagga library is not loaded. Please install and import Quagga.js")
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "dateOfBirth") {
      const calculatedAge = calculateAge(value)
      setFormData({
        ...formData,
        [name]: value,
        age: calculatedAge,
      })
    } else if (name === "age") {
      // Calculate DOB from age when age is entered
      const calculatedDOB = calculateDOBFromAge(value)
      setFormData({
        ...formData,
        [name]: value,
        dateOfBirth: calculatedDOB,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFileChange = (e) => {
    setTrfFile(e.target.files[0])
  }

  const handleToggle = () => {
    setIsHomeCollection(!isHomeCollection)
  }

  // Clear barcode function
  const clearBarcode = () => {
    setbarcodeId("")
    setBarcodeValidated(false)
    processedBarcodes.current.clear()
    showToast("info", "Barcode Cleared", "Barcode input has been cleared.")
  }

  // Scanner functions
  const openScanner = () => {
    if (scanError) {
      showToast("error", "Scanner Error", scanError)
      return
    }

    setShowScanner(true)
    setScanResult(null)
    setScanMessage(null)
    setScanning(true) // Auto-start scanning when opening
  }

  const closeScanner = () => {
    setShowScanner(false)
    setScanning(false)
    setScanResult(null)
    setScanMessage(null)
  }

  const toggleScanning = () => {
    setScanMessage(null)
    setScanning(!scanning)
  }

  // Modified onBarcodeDetected function - prevent multiple API calls
  const onBarcodeDetected = async (result) => {
    const scannedCode = result.codeResult.code

    // Prevent repeated processing of the same barcode
    if (
      !scannedCode ||
      processedBarcodes.current.has(scannedCode) ||
      isProcessingBarcode.current ||
      scannedCode === barcodeId
    ) {
      return
    }

    // Mark as processing and add to processed set
    isProcessingBarcode.current = true
    processedBarcodes.current.add(scannedCode)

    try {
      // Single API call for validation
      const check = await axios.get(`${franchiseurl}check-barcode-exists/?barcodeId=${scannedCode}`)

      if (check.data.exists) {
        showToast("error", "Barcode Check", `Barcode ${scannedCode} already used.`)
        return
      }

      if (!check.data.valid) {
        showToast("error", "Barcode Check", check.data.message)
        return
      }

      // Barcode is valid - set it and close scanner automatically
      setbarcodeId(scannedCode)
      setBarcodeValidated(true)
      setScanResult({
        code: scannedCode,
        format: result.codeResult.format,
        timestamp: new Date().toLocaleTimeString(),
      })

      showToast("success", "Barcode Scanned", `Barcode ${scannedCode} captured and validated successfully!`)

      // Auto-close scanner after successful scan
      setTimeout(() => {
        closeScanner()
      }, 1500)
    } catch (error) {
      console.error("Error checking barcode:", error)
      showToast("error", "Barcode Check", "Failed to verify barcode.")
      // Remove from processed set on error so it can be retried
      processedBarcodes.current.delete(scannedCode)
    } finally {
      // Reset processing flag
      isProcessingBarcode.current = false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const patientname = `${formData.title} ${formData.firstName} ${formData.lastName}`.trim()
      const form = new FormData()

      // Patient Info
      form.append("patientname", patientname)
      form.append("dateOfBirth", formData.dateOfBirth)
      form.append("age", formData.age)
      form.append("gender", formData.gender)
      form.append("phoneNumber", formData.phoneNumber)
      form.append("email", formData.email)
      form.append("city", formData.city)
      form.append("area", formData.area)
      form.append("pincode", formData.pincode)

      if (formData.patient_id) {
        form.append("patient_id", formData.patient_id)
      }

      // Registration Info
      form.append("registrationDate", formData.registrationDate)
      form.append("franchise_id", formData.franchise_id || storedFranchiseId)
      form.append("referredDoctor", formData.referredDoctor)

      // Billing Info
      const cleanedTests = selectedTests.map((test) => ({
        test_id: test.test_id,
        test_name: test.test_name,
        MRP: test.MRP,
      }))

      form.append("testdetails", JSON.stringify(cleanedTests))
      form.append("total", total)
      form.append("discount", discount)
      form.append("netAmount", netAmount)
      form.append("paymentMode", paymentMode)

      // Segment Info
      form.append("segment", isHomeCollection ? "Home Collection" : "Walkin")

      // Barcode Value
      form.append("barcodeId", barcodeId)

      // File
      if (trfFile) {
        form.append("trf", trfFile)
      }

      const response = await axios.post(`${franchiseurl}registerpatientdetails/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const patient_idReturned = response.data.patient_id
      showToast("success", "Success!", `Registered successfully with ID ${patient_idReturned}`)

      // Reset form
      setFormData({
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
        registrationDate: getCurrentDateTime(),
        referredDoctor: "",
        patient_id: "",
      })
      setTrfFile(null)
      setSelectedTests([])
      setDiscount("")
      setTestSearchQuery("")
      setIsHomeCollection(false)
      setPatientSearchQuery("")
      setbarcodeId("")
      setBarcodeValidated(false)
      processedBarcodes.current.clear()
    } catch (err) {
      console.error("Error submitting registration:", err.response?.data || err.message)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Something went wrong"
      showToast("error", "Submission Failed", errorMessage)
    }
  }

  const handleSearch = async () => {
    if (!patientSearchQuery.trim()) {
      showToast("error", "Invalid Search", "Please enter a Patient ID or Phone Number.")
      return
    }

    try {
      const response = await axios.get(`${franchiseurl}search-patient/?query=${patientSearchQuery.trim()}`)

      if (response.data && response.data.patient) {
        const details = response.data.patient
        const nameParts = (details.patientname || "").split(" ")

        setFormData({
          title: nameParts[0] || "",
          firstName: nameParts[1] || "",
          lastName: nameParts.slice(2).join(" ") || "",
          dateOfBirth: details.dateOfBirth || "",
          age: details.age?.toString() || "",
          gender: details.gender || "",
          phoneNumber: details.phoneNumber || "",
          email: details.email || "",
          city: details.city || "",
          area: details.area || "",
          pincode: details.pincode || "",
          registrationDate: getCurrentDateTime(),
          referredDoctor: "",
          patient_id: details.patient_id || "",
        })

        showToast("success", "Patient Found", "Patient details loaded successfully.")
      } else {
        showToast("info", "Not Found", "No patient record found.")
      }
    } catch (error) {
      console.error("Search error:", error)
      showToast("error", "Search Failed", "Unable to fetch patient details.")
    }
  }

  return (
    <>
      <GlobalStyle />
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} isExiting={toast.isExiting}>
            <ToastIcon>{toast.type === "success" ? "✅" : toast.type === "info" ? "ℹ️" : "❌"}</ToastIcon>
            <ToastContent>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastMessage>{toast.message}</ToastMessage>
            </ToastContent>
            <ToastCloseButton onClick={() => removeToast(toast.id)}>✕</ToastCloseButton>
            <ToastProgress duration={5000} />
          </Toast>
        ))}
      </ToastContainer>

      {/* Scanner Modal */}
      {showScanner && (
        <ScannerOverlay>
          <ScannerModal>
            <ScannerHeader>
              <ScannerTitle>Barcode Scanner</ScannerTitle>
              <CloseButton onClick={closeScanner}>✕</CloseButton>
            </ScannerHeader>

            {scanMessage && <ScanMessage>{scanMessage}</ScanMessage>}

            <ScannerControls>
              <ScannerControlButton onClick={toggleScanning} $scanning={scanning}>
                {scanning ? "Stop Scanning" : "Start Scanning"}
              </ScannerControlButton>
            </ScannerControls>

            {scanning && <Scanner onDetected={onBarcodeDetected} />}

            {scanResult && (
              <ScanResult>
                <ScanResultCode>{scanResult.code}</ScanResultCode>
                <ScanResultFormat>{scanResult.format}</ScanResultFormat>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                  Scanned at: {scanResult.timestamp}
                </div>
              </ScanResult>
            )}
          </ScannerModal>
        </ScannerOverlay>
      )}

      <FormWrapper>
        <h3>Patient Registration & Billing</h3>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FormSection delay="0s">
            <SectionTitle icon="🔍">Search Existing Patient</SectionTitle>
            <SearchRow>
              <SearchCol>
                <FormGroup>
                  <label>Search by Patient ID / Phone Number</label>
                  <Input
                    type="text"
                    placeholder="Enter Patient ID (e.g. SDF001) or Phone Number"
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleSearch()
                      }
                    }}
                  />
                </FormGroup>
              </SearchCol>

              <ButtonCol>
                <SearchButton type="button" onClick={handleSearch}>
                  Search Patient
                </SearchButton>
              </ButtonCol>
            </SearchRow>
          </FormSection>

          {/* Separate Barcode Section */}
          <FormSection delay="0.05s">
            <BarcodeSection>
              <SectionTitle icon="📱">Barcode Scanner</SectionTitle>
              <BarcodeRow>
                <BarcodeInputWrapper>
                  <FormGroup>
                    <label>Barcode Value</label>
                    <Input
                      type="text"
                      disabled
                      className="barcode-input"
                      placeholder="Scan barcode or enter manually"
                      value={barcodeId}
                      onChange={(e) => setbarcodeId(e.target.value)}
                    />
                  </FormGroup>
                </BarcodeInputWrapper>

                <BarcodeActions>
                  {barcodeId && (
                    <BarcodeStatus isValid={barcodeValidated}>
                      {barcodeValidated ? "Validated" : "Pending"}
                    </BarcodeStatus>
                  )}
                  <ScannerButton type="button" onClick={openScanner} title="Scan Barcode">
                    <ScannerIcon />
                  </ScannerButton>
                  {barcodeId && (
                    <ClearButton type="button" onClick={clearBarcode}>
                      Clear
                    </ClearButton>
                  )}
                </BarcodeActions>
              </BarcodeRow>
            </BarcodeSection>
          </FormSection>

          <FormSection delay="0.1s">
            <SectionTitle icon="👤">Patient Information</SectionTitle>
            <Row>
              <Col>
                <FormGroup>
                  <label>Title</label>
                  <Select name="title" value={formData.title} onChange={handleChange} required>
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </Select>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>First Name</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Last Name</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Date of Birth</label>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {formData.age && <AgeIndicator>Age: {formData.age}</AgeIndicator>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label>Age (Years)</label>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age or select DOB"
                    min="0"
                    max="150"
                    required
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Gender</label>
                  <Select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Phone Number</label>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label>City</label>
                  <Input name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Area</label>
                  <Input name="area" value={formData.area} onChange={handleChange} placeholder="Enter area" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Pincode</label>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                  />
                </FormGroup>
              </Col>
            </Row>
          </FormSection>

          <FormSection delay="0.2s">
            <SectionTitle icon="📝">Registration Details</SectionTitle>
            <Row>
              <Col>
                <FormGroup>
                  <label>Registration Date</label>
                  <Input type="datetime-local" name="registrationDate" value={formData.registrationDate} readOnly />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Referred Doctor</label>
                  <Input
                    type="text"
                    name="referredDoctor"
                    value={formData.referredDoctor}
                    onChange={handleChange}
                    placeholder="Enter referred doctor"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Upload TRF Document</label>
                  <Input type="file" onChange={handleFileChange} />
                  {trfFile && (
                    <div style={{ marginTop: "5px", fontSize: "0.75rem", color: "#2d3748" }}>
                      Selected: {trfFile.name}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label>Collection Type</label>
                  <ToggleContainer>
                    <ToggleLabel isActive={!isHomeCollection}>Walk-in</ToggleLabel>
                    <ToggleSwitch isOn={isHomeCollection} onClick={handleToggle}>
                      <ToggleSlider isOn={isHomeCollection} />
                    </ToggleSwitch>
                    <ToggleLabel isActive={isHomeCollection}>Home Collection</ToggleLabel>
                  </ToggleContainer>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Current Segment</label>
                  <SegmentIndicator isHomeCollection={isHomeCollection}>
                    {isHomeCollection ? "Home Collection" : "Walk-in"}
                  </SegmentIndicator>
                </FormGroup>
              </Col>
            </Row>
          </FormSection>

          <InfoSection>
            <InfoTitle>Search & Add Tests</InfoTitle>
            <FormGroup style={{ maxWidth: "350px", marginBottom: "1rem" }}>
              <h4>Search by Test Name</h4>
              <Input
                type="text"
                placeholder="Enter test name"
                value={testSearchQuery}
                onChange={(e) => setTestSearchQuery(e.target.value)}
              />
            </FormGroup>

            {testSearchQuery && (
              <div style={{ maxHeight: "180px", overflowY: "auto", border: "1px solid #ccc", borderRadius: "5px" }}>
                {testList
                  .filter((test) => test.test_name?.toLowerCase().includes(testSearchQuery.toLowerCase()))
                  .map((test, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (selectedTests.some((t) => t._id === test._id)) {
                          alert("You have already selected this test.")
                        } else {
                          const updatedTests = [...selectedTests, test]
                          setSelectedTests(updatedTests)
                        }
                        setTestSearchQuery("")
                      }}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        backgroundColor: "#f9f9f9",
                        color: "black",
                        fontSize: "0.875rem",
                      }}
                    >
                      {test.test_name}
                    </div>
                  ))}
              </div>
            )}
          </InfoSection>

          {selectedTests.length > 0 && (
            <InfoSection>
              <InfoTitle>Added Tests</InfoTitle>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th style={{ padding: "8px", border: "1px solid #ddd", fontSize: "0.875rem" }}>Test Name</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd", fontSize: "0.875rem" }}>MRP</th>
                      <th style={{ padding: "8px", border: "1px solid #ddd", fontSize: "0.875rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTests.map((test, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px", border: "1px solid #ddd", fontSize: "0.875rem" }}>
                          {test.test_name}
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #ddd", fontSize: "0.875rem" }}>{test.MRP}</td>
                        <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedTests((prevTests) => prevTests.filter((t) => t._id !== test._id))
                            }}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#e53e3e",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "15px",
                  alignItems: "center",
                  fontSize: "0.875rem",
                }}
              >
                <div>
                  <strong>Total: ₹{total.toFixed(2)}</strong>
                </div>
                <div>
                  <strong>Discount:</strong>
                  <input
                    type="text"
                    placeholder="e.g. 10 or 10%"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    style={{ marginLeft: "8px", padding: "4px", width: "70px", fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <strong>Net Amount: ₹{netAmount.toFixed(2)}</strong>
                </div>
                <div>
                  <strong>Payment Mode:</strong>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    style={{
                      marginLeft: "8px",
                      padding: "4px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      minWidth: "80px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
              </div>
            </InfoSection>
          )}

          <FormSection delay="0.3s">
            <SearchButton style={{ float: "right", marginRight: "8px" }} type="submit">
              Registration & Billing
            </SearchButton>
          </FormSection>
        </Form>
      </FormWrapper>
    </>
  )
}

export default PatientRegistrationAndBilling
