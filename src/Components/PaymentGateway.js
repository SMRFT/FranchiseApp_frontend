"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import {
  CreditCard,
  Wallet,
  History,
  Loader2,
  AlertCircle,
  X,
  Eye,
  ArrowUpRight,
  Building2,
  ChevronDown,
  Settings,
  TrendingUp,
  DollarSign,
  Zap,
  Plus,
  Activity,
} from "lucide-react"

// Modern Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); 
  padding: 1rem;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
`

const MaxWidthContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.25rem;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.35);
  }
`

const GlassCard = styled(Card)`
  background: rgba(189, 189, 189, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`

const CompactFranchiseCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`

const FranchiseIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FranchiseInfo = styled.div`
  flex: 1;
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }
  p {
    opacity: 0.8;
    margin: 0;
    font-size: 0.875rem;
  }
`

const CardHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`

const CardContent = styled.div`
  padding: 2rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`

const ActionButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Input = styled.input`
  padding: 1.25rem 1.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`

const SelectWrapper = styled.div`
  position: relative;
`

const Select = styled.select`
  padding: 1.25rem 1.5rem;
  padding-right: 3.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  appearance: none;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`

const SelectIcon = styled(ChevronDown)`
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #64748b;
`

const Button = styled.button`
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    transform: translateY(-4px);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  &:hover::before {
    left: 100%;
  }
`

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 16px 32px -8px rgba(102, 126, 234, 0.4);
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
    box-shadow: 0 24px 48px -8px rgba(102, 126, 234, 0.6);
  }
`

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 16px 32px -8px rgba(16, 185, 129, 0.4);
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857);
    box-shadow: 0 24px 48px -8px rgba(16, 185, 129, 0.6);
  }
`

const OutlineButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  &:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }
`

const Alert = styled.div`
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  background-color: ${(props) => (props.success ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  border-color: ${(props) => (props.success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)")};
  color: ${(props) => (props.success ? "#065f46" : "#991b1b")};
`

const WalletBalance = styled.div`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #10b981, #059669);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const ShareCard = styled(GlassCard)`
  text-align: center;
  background: ${(props) => props.gradient};
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
  }
  @keyframes shimmer {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
  }
`

const ShareAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

const ShareLabel = styled.div`
  opacity: 0.9;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  position: relative;
  z-index: 1;
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.4);
  position: relative;
  animation: slideUp 0.3s ease-out;
  width: 100%;
  max-width: 600px;
  @keyframes slideUp {
    from {
       opacity: 0;
      transform: translateY(20px);
    }
    to {
       opacity: 1;
      transform: translateY(0);
    }
  }
`

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  color: #64748b;
  transition: all 0.2s;
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
    transform: scale(1.1);
  }
`

const ModalBody = styled.div`
  padding: 2rem;
`

const PaymentMethodCard = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-2px);
  }
  &.selected {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
  }
`

const PaymentMethodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  h4 {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 1.125rem;
  }
  p {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled(GlassCard)`
  padding: 1.5rem;
  text-align: center;
  .icon {
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .label {
    font-size: 0.875rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

// API Configuration

const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;
// Main Component
const ModernPaymentGateway = () => {
  const [franchiseId, setFranchiseId] = useState("")
  const [franchiseName, setFranchiseName] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedGateway, setSelectedGateway] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("INR")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: "", message: "" })
  const [walletBalance, setWalletBalance] = useState({
    total_balance: 0,
    franchiser_share: 0,
    franchise_share: 0,
    currency: "INR",
  })
  const [paymentHistory, setPaymentHistory] = useState([])
  const [franchiseExists, setFranchiseExists] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentGateways, setPaymentGateways] = useState([])
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    loadFranchiseData()
    loadRazorpayScript()
    fetchPaymentGateways()
    fetchCurrencies()
  }, [])

  useEffect(() => {
    if (franchiseId) {
      fetchWalletBalance()
      fetchPaymentHistory()
    }
  }, [franchiseId])

  const loadFranchiseData = () => {
    const savedFranchiseId = localStorage.getItem("franchise_id")
    const savedFranchiseName = localStorage.getItem("franchise_name")
    if (savedFranchiseId) setFranchiseId(savedFranchiseId)
    if (savedFranchiseName) setFranchiseName(savedFranchiseName)
  }

  const loadRazorpayScript = () => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }

  const fetchPaymentGateways = async () => {
    try {
      const response = await fetch(`${franchiseurl}payment-gateways/`)
      if (response.ok) {
        const data = await response.json()
        setPaymentGateways(data.payment_gateways || [])
        // Set default gateway to Razorpay if available
        const razorpay = data.payment_gateways?.find((g) => g.name === "Razorpay")
        if (razorpay) {
          setSelectedGateway(razorpay.id)
        }
      }
    } catch (error) {
      console.error("Error fetching payment gateways:", error)
    }
  }

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${franchiseurl}currencies/`)
      if (response.ok) {
        const data = await response.json()
        setCurrencies(data.currencies || [])
      }
    } catch (error) {
      console.error("Error fetching currencies:", error)
    }
  }

  const fetchWalletBalance = async () => {
    if (!franchiseId) return
    try {
      const response = await fetch(`${franchiseurl}wallet-balance/${franchiseId}/`)
      if (response.ok) {
        const data = await response.json()
        setWalletBalance(data)
        setFranchiseExists(true)
        setStatus({ type: "", message: "" })
      } else {
        setFranchiseExists(false)
        setStatus({ type: "error", message: "Franchise not found" })
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
      setStatus({ type: "error", message: "Failed to fetch wallet balance" })
    }
  }

  const fetchPaymentHistory = async () => {
    if (!franchiseId) return
    try {
      const response = await fetch(`${franchiseurl}payment-history/${franchiseId}/`)
      if (response.ok) {
        const data = await response.json()
        setPaymentHistory(data.payments || [])
      }
    } catch (error) {
      console.error("Error fetching payment history:", error)
    }
  }

  const savePaymentToDatabase = async (paymentData) => {
    try {
      const response = await fetch(`${franchiseurl}save-payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })
      if (response.ok) {
        fetchWalletBalance()
        fetchPaymentHistory()
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Payment save failed")
      }
    } catch (error) {
      console.error("Error saving payment:", error)
      throw error
    }
  }

  const handlePayment = async () => {
    if (!franchiseId.trim() || !franchiseName.trim() || !amount || Number.parseFloat(amount) <= 0) {
      setStatus({ type: "error", message: "Please fill all required fields with valid data" })
      return
    }
    if (!franchiseExists) {
      setStatus({ type: "error", message: "Please verify franchise ID first" })
      return
    }
    if (!selectedGateway || !selectedCurrency) {
      setStatus({ type: "error", message: "Please select payment gateway and currency" })
      return
    }

    setLoading(true)
    setStatus({ type: "", message: "" })

    // Save franchise data to localStorage
    localStorage.setItem("franchise_id", franchiseId)
    localStorage.setItem("franchise_name", franchiseName)

    try {
      const referenceId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase()

      // Get selected gateway details
      const gateway = paymentGateways.find((g) => g.id === selectedGateway)
      if (gateway?.name === "Razorpay") {
        const options = {
          key: "rzp_test_YooSlpOnNDsCoN", // Replace with your actual Razorpay key
          amount: Number.parseFloat(amount) * 100, // Amount in paise
          currency: selectedCurrency,
          name: "Shanmuga Diagnostics",
          description: `Payment for Franchise: ${franchiseName} (ID: ${franchiseId})`,
          handler: async (response) => {
            try {
              const paymentData = {
                reference_id: referenceId,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id || "",
                signature: response.razorpay_signature || "",
                amount: Number.parseFloat(amount),
                franchise_id: franchiseId,
                franchise_name: franchiseName,
                payment_type: "topup",
                status: "success",
                payment_gateway_id: selectedGateway,
                currency_code: selectedCurrency,
              }
              await savePaymentToDatabase(paymentData)
              setStatus({
                type: "success",
                message: `Payment successful! Reference ID: ${referenceId}`,
              })
              setAmount("")
              setShowPaymentModal(false)
            } catch (error) {
              setStatus({
                type: "error",
                message: "Payment completed but failed to save. Please contact support.",
              })
            } finally {
              setLoading(false)
            }
          },
          prefill: {
            name: franchiseName,
            email: `${franchiseId}@franchise.com`,
            contact: "+919876543210",
          },
          theme: {
            color: "#667eea",
          },
          modal: {
            ondismiss: () => {
              setLoading(false)
              setStatus({ type: "error", message: "Payment cancelled by user" })
            },
          },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        setLoading(false)
        setStatus({ type: "error", message: `${gateway?.name} integration not implemented yet` })
      }
    } catch (error) {
      setLoading(false)
      setStatus({ type: "error", message: "Payment initialization failed" })
    }
  }

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    }
    return symbols[currencyCode] || currencyCode
  }

  return (
    <Container>
      <MaxWidthContainer>
        <Header>
          <MainTitle>Modern Payment Gateway</MainTitle>
          <Subtitle>Seamless payments with advanced security and multiple gateway support</Subtitle>
        </Header>

        {/* Compact Franchise Information */}
        {franchiseId && franchiseName && (
          <CompactFranchiseCard>
            <FranchiseIcon>
              <Building2 size={24} />
            </FranchiseIcon>
            <FranchiseInfo>
              <h3>{franchiseName}</h3>
              <p>ID: {franchiseId}</p>
            </FranchiseInfo>
          </CompactFranchiseCard>
        )}

        {/* Action Buttons */}
        <ActionButtonsGrid>
          <PrimaryButton onClick={() => setShowPaymentModal(true)} disabled={!franchiseExists}>
            <Plus size={20} />
            Make Payment
            <ArrowUpRight size={16} />
          </PrimaryButton>
          <SecondaryButton onClick={() => setShowHistoryModal(true)} disabled={!franchiseExists}>
            <History size={20} />
            Payment History
            <Eye size={16} />
          </SecondaryButton>
        </ActionButtonsGrid>

        {/* Stats Section */}
        <StatsGrid>
          <StatCard>
            <div className="icon">
              <TrendingUp size={32} />
            </div>
            <div className="value">{paymentHistory.length}</div>
            <div className="label">Total Transactions</div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <DollarSign size={32} />
            </div>
            <div className="value">
              {getCurrencySymbol(walletBalance.currency)}
              {(walletBalance.total_balance ?? 0).toFixed(0)}
            </div>
            <div className="label">Wallet Balance</div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Activity size={32} />
            </div>
            <div className="value">{paymentHistory.filter((p) => p.status === "success").length}</div>
            <div className="label">Successful Payments</div>
          </StatCard>
        </StatsGrid>

        {/* Wallet Balance Display */}
        {franchiseExists && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Wallet size={24} />
                  Wallet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WalletBalance>
                  {getCurrencySymbol(walletBalance.currency)}
                  {(walletBalance.total_balance ?? 0).toFixed(2)}
                </WalletBalance>
              </CardContent>
            </Card>

            {/* <TwoColumnGrid>
              <ShareCard gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))">
                <CardContent>
                  <ShareAmount>
                    {getCurrencySymbol(walletBalance.currency)}
                    {(walletBalance.franchiser_share ?? 0).toFixed(2)}
                  </ShareAmount>
                  <ShareLabel>Franchiser Share (70%)</ShareLabel>
                </CardContent>
              </ShareCard>
              <ShareCard gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(29, 78, 216, 0.9))">
                <CardContent>
                  <ShareAmount>
                    {getCurrencySymbol(walletBalance.currency)}
                    {(walletBalance.franchise_share ?? 0).toFixed(2)}
                  </ShareAmount>
                  <ShareLabel>Franchise Share (30%)</ShareLabel>
                </CardContent>
              </ShareCard>
            </TwoColumnGrid> */}
          </>
        )}

        {/* Status Alert */}
        {status.message && (
          <Alert success={status.type === "success"}>
            <AlertCircle size={16} />
            {status.message}
          </Alert>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <Modal onClick={() => setShowPaymentModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  <Zap size={24} />
                  Make Payment
                </ModalTitle>
                <CloseButton onClick={() => setShowPaymentModal(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <Grid style={{ marginBottom: "2rem" }}>
                  <InputGroup>
                    <Label>Payment Gateway</Label>
                    <SelectWrapper>
                      <Select
                        value={selectedGateway}
                        onChange={(e) => setSelectedGateway(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Gateway</option>
                        {paymentGateways.map((gateway) => (
                          <option key={gateway.id} value={gateway.id}>
                            {gateway.name}
                          </option>
                        ))}
                      </Select>
                      <SelectIcon size={20} />
                    </SelectWrapper>
                  </InputGroup>
                  <InputGroup>
                    <Label>Currency</Label>
                    <SelectWrapper>
                      <Select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        disabled={loading}
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.name} ({currency.code})
                          </option>
                        ))}
                      </Select>
                      <SelectIcon size={20} />
                    </SelectWrapper>
                  </InputGroup>
                </Grid>

                <InputGroup style={{ marginBottom: "2rem" }}>
                  <Label>Amount ({getCurrencySymbol(selectedCurrency)})</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    min="0"
                    step="0.01"
                  />
                </InputGroup>

                {/* Payment Gateway Info */}
                {selectedGateway && (
                  <PaymentMethodCard className="selected">
                    <PaymentMethodInfo>
                      <Settings size={24} />
                      <div>
                        <h4>{paymentGateways.find((g) => g.id === selectedGateway)?.name}</h4>
                        <p>{paymentGateways.find((g) => g.id === selectedGateway)?.description}</p>
                      </div>
                    </PaymentMethodInfo>
                  </PaymentMethodCard>
                )}

                <PrimaryButton
                  onClick={handlePayment}
                  disabled={loading || !franchiseExists || !selectedGateway || !selectedCurrency}
                  style={{ width: "100%" }}
                >
                  {loading && <LoadingSpinner size={16} />}
                  <CreditCard size={20} />
                  {loading ? "Processing..." : `Pay ${getCurrencySymbol(selectedCurrency)}${amount || "0.00"}`}
                  <ArrowUpRight size={16} />
                </PrimaryButton>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        {/* History Modal */}
        {showHistoryModal && (
          <Modal onClick={() => setShowHistoryModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  <History size={24} />
                  Payment History
                </ModalTitle>
                <CloseButton onClick={() => setShowHistoryModal(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                {paymentHistory.length > 0 ? (
                  <div>
                    {paymentHistory.map((payment, index) => (
                      <PaymentMethodCard key={index} style={{ cursor: "default" }}>
                        <Grid style={{ fontSize: "0.875rem", gap: "1rem" }}>
                          <div>
                            <strong>Reference ID:</strong> {payment.reference_id}
                          </div>
                          <div>
                            <strong>Amount:</strong> {getCurrencySymbol(payment.currency || "INR")}
                            {payment.amount}
                          </div>
                          <div>
                            <strong>Gateway:</strong> {payment.payment_gateway_name || "N/A"}
                          </div>
                          <div>
                            <strong>Type:</strong> {payment.transaction_type}
                          </div>
                          <div>
                            <strong>Status:</strong>
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                background:
                                  payment.status === "success"
                                    ? "#dcfce7"
                                    : payment.status === "failed"
                                      ? "#fee2e2"
                                      : "#fef3c7",
                                color:
                                  payment.status === "success"
                                    ? "#166534"
                                    : payment.status === "failed"
                                      ? "#991b1b"
                                      : "#92400e",
                              }}
                            >
                              {payment.status}
                            </span>
                          </div>
                          <div>
                            <strong>Date:</strong> {new Date(payment.created_at).toLocaleString()}
                          </div>
                        </Grid>
                      </PaymentMethodCard>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#64748b" }}>
                    <History size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                      No Payment History
                    </h3>
                    <p>No transactions found for this franchise</p>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </MaxWidthContainer>
    </Container>
  )
}

export default ModernPaymentGateway
