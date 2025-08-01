"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styled, { keyframes } from "styled-components"

// Animations
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

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  min-height: 100vh;
`

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
`

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '📊';
    font-size: 1.8rem;
  }
`

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const DateInput = styled.input`
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`

const FetchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const RegistrationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const RegistrationCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;
`

const PatientId = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '👤';
    font-size: 1rem;
  }
`

const BarcodeChip = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`

const SegmentBadge = styled.div`
  background: ${(props) => (props.segment === "Home Collection" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)")};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '${(props) => (props.segment === "Home Collection" ? "🏠" : "🚶")}';
    font-size: 0.8rem;
  }
`

const PatientDetails = styled.div`
  margin-bottom: 1.5rem;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
`

const DetailLabel = styled.span`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
`

const DetailValue = styled.span`
  color: #2d3748;
  font-size: 0.875rem;
  font-weight: 500;
`

const TestsSection = styled.div`
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h4`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🧪';
    font-size: 0.9rem;
  }
`

const TestItem = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 3px solid #667eea;
`

const TestName = styled.span`
  font-weight: 500;
  color: #2d3748;
  font-size: 0.875rem;
  flex: 1;
`

const TestPrice = styled.span`
  font-weight: 600;
  color: #059669;
  font-size: 0.875rem;
`

const AmountSection = styled.div`
  background: linear-gradient(135deg, #f8fafc, #edf2f7);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
`

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 0.5rem;
    border-top: 2px solid #e2e8f0;
    font-weight: 700;
    font-size: 1.1rem;
  }
`

const AmountLabel = styled.span`
  color: #4a5568;
  font-weight: 500;
`

const AmountValue = styled.span`
  color: #2d3748;
  font-weight: 600;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  
  &::before {
    content: '📋';
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
  }
`

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  
  &::before {
    content: '⏳';
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
  }
`

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

const FranchiseRegistrationViewer = () => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  // Calculate statistics
  const totalRegistrations = data.length
  const totalAmount = data.reduce((sum, item) => sum + Number.parseFloat(item.total || 0), 0)
  const totalNetAmount = data.reduce((sum, item) => sum + Number.parseFloat(item.netAmount || 0), 0)
  const totalTests = data.reduce((sum, item) => sum + (item.testdetails?.length || 0), 0)
  const homeCollectionCount = data.filter((item) => item.segment === "Home Collection").length
  const walkinCount = data.filter((item) => item.segment === "Walkin").length

  const handleFetch = async () => {
    const franchise_id = localStorage.getItem("franchise_id")
    if (!franchise_id || !selectedDate) return

    setLoading(true)
    try {
      const response = await axios.get(`${franchiseurl}registrations/`, {
        params: {
          franchise_id,
          date: selectedDate,
        },
      })
      setData(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch on component mount and date change
  useEffect(() => {
    if (selectedDate) {
      handleFetch()
    }
  }, [selectedDate])

  return (
    <Container>
      <Header>
        <Title>Registration Dashboard</Title>
        <FilterSection>
          <DateInput type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <FetchButton onClick={handleFetch} disabled={loading}>
            {loading ? "Loading..." : "Refresh Data"}
          </FetchButton>
        </FilterSection>
      </Header>

      {/* Statistics Cards */}
      <StatsGrid>
        <StatCard delay="0.1s">
          <StatIcon>👥</StatIcon>
          <StatValue>{totalRegistrations}</StatValue>
          <StatLabel>Total Registrations</StatLabel>
        </StatCard>

        <StatCard delay="0.2s">
          <StatIcon>💰</StatIcon>
          <StatValue>₹{totalAmount.toFixed(2)}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>

        <StatCard delay="0.3s">
          <StatIcon>💳</StatIcon>
          <StatValue>₹{totalNetAmount.toFixed(2)}</StatValue>
          <StatLabel>Net Amount</StatLabel>
        </StatCard>

        <StatCard delay="0.4s">
          <StatIcon>🧪</StatIcon>
          <StatValue>{totalTests}</StatValue>
          <StatLabel>Total Tests</StatLabel>
        </StatCard>

        <StatCard delay="0.5s">
          <StatIcon>🏠</StatIcon>
          <StatValue>{homeCollectionCount}</StatValue>
          <StatLabel>Home Collections</StatLabel>
        </StatCard>

        <StatCard delay="0.6s">
          <StatIcon>🚶</StatIcon>
          <StatValue>{walkinCount}</StatValue>
          <StatLabel>Walk-ins</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Registration Cards */}
      {loading ? (
        <LoadingState>
          <h3>Loading registrations...</h3>
          <p>Please wait while we fetch the data</p>
        </LoadingState>
      ) : data.length === 0 ? (
        <EmptyState>
          <h3>No registrations found</h3>
          <p>No registrations were found for the selected date</p>
        </EmptyState>
      ) : (
        <RegistrationsGrid>
          {data.map((item, index) => (
            <RegistrationCard key={index} delay={`${0.1 * (index % 10)}s`}>
              <CardHeader>
                <PatientId>{item.patient}</PatientId>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <BarcodeChip>{item.barcode}</BarcodeChip>
                  <SegmentBadge segment={item.segment}>{item.segment}</SegmentBadge>
                </div>
              </CardHeader>

              <PatientDetails>
                <DetailRow>
                  <DetailLabel>Patient Name:</DetailLabel>
                  <DetailValue>{item.patient_info?.patientname || "N/A"}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Phone:</DetailLabel>
                  <DetailValue>{item.patient_info?.phoneNumber || "N/A"}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Email:</DetailLabel>
                  <DetailValue>{item.patient_info?.email || "N/A"}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>City:</DetailLabel>
                  <DetailValue>{item.patient_info?.city || "N/A"}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Registration Date:</DetailLabel>
                  <DetailValue>{new Date(item.registrationDate).toLocaleString()}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Payment Mode:</DetailLabel>
                  <DetailValue>{item.paymentMode}</DetailValue>
                </DetailRow>
              </PatientDetails>

              <TestsSection>
                <SectionTitle>Tests ({item.testdetails?.length || 0})</SectionTitle>
                {item.testdetails?.map((test, testIndex) => (
                  <TestItem key={testIndex}>
                    <TestName>{test.test_name}</TestName>
                    <TestPrice>₹{test.MRP}</TestPrice>
                  </TestItem>
                ))}
              </TestsSection>

              <AmountSection>
                <AmountRow>
                  <AmountLabel>Total Amount:</AmountLabel>
                  <AmountValue>₹{item.total}</AmountValue>
                </AmountRow>
                {item.discount && (
                  <AmountRow>
                    <AmountLabel>Discount:</AmountLabel>
                    <AmountValue>₹{item.discount}</AmountValue>
                  </AmountRow>
                )}
                <AmountRow>
                  <AmountLabel>Net Amount:</AmountLabel>
                  <AmountValue>₹{item.netAmount}</AmountValue>
                </AmountRow>
              </AmountSection>
            </RegistrationCard>
          ))}
        </RegistrationsGrid>
      )}
    </Container>
  )
}

export default FranchiseRegistrationViewer
