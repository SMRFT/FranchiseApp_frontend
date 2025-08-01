"use client"
import { useState, useEffect } from "react"
import styled from "styled-components"

// Styled Components (keeping all existing styles and adjusting colors for transfer theme)
const Container = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 10px;
  font-family: 'Arial', sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  
  @media (min-width: 768px) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
`

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 24px;
  }
`

const SampleCount = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`

const FilterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-items: end;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`

const Label = styled.label`
  font-weight: 500;
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fafbfc;
  
  &:focus {
    outline: none;
    border-color: #f59e0b; /* Orange focus */
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    background: white;
  }
`

const Button = styled.button`
  padding: 10px 16px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
  
  &:hover {
    // background: #d97706; /* Darker orange */
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background: #f1f5f9;
`

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const TableHead = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    padding: 15px 12px;
    font-size: 13px;
  }
`

const TableCell = styled.td`
  padding: 12px 8px;
  color: #334155;
  font-size: 13px;
  vertical-align: middle;
  
  @media (min-width: 768px) {
    padding: 15px 12px;
    font-size: 14px;
  }
`

const PatientId = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
`

const TestDetailsPreview = styled.div`
  font-size: 11px;
  color: #64748b;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  color: white;
`

const TransferButton = styled.button`
  padding: 6px 12px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
    transform: scale(1.05);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #f59e0b; /* Orange */
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const NoData = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  font-size: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: #dc2626;
  font-weight: 500;
  font-size: 14px;
`

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: #15803d;
  font-weight: 500;
  font-size: 14px;
`

const FranchiseInfo = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  // border: 1px solid #f59e0b; /* Orange border */
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  // color: #92400e; /* Darker orange text */
  font-size: 14px;
  font-weight: 500;
`

// Modal Styles (reused from SampleCollection, adjusted colors)
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
  padding: 20px;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  color: white;
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
  padding: 0;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`

const ModalBody = styled.div`
  padding: 0;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
`

const PatientInfoSection = styled.div`
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: center;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.span`
  font-size: 16px;
  color: #1e293b;
  font-weight: 600;
`

const TestsSection = styled.div`
  padding: 20px 24px;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`

const SectionTitle = styled.h3`
  margin: 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`

const TestCount = styled.span`
  // background: #f59e0b; /* Orange */
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
`

const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`

const TestTableHeader = styled.thead`
  background: #f1f5f9;
`

const TestTableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const TestTableHead = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    padding: 15px 12px;
    font-size: 12px;
  }
`

const TestTableCell = styled.td`
  padding: 12px 8px;
  color: #334155;
  font-size: 12px;
  vertical-align: middle;
  
  @media (min-width: 768px) {
    padding: 15px 12px;
    font-size: 13px;
  }
`

const TestName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
  font-size: 13px;
  line-height: 1.3;
`

const TestContainer = styled.div`
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
`

const TestPrice = styled.div`
  font-size: 11px;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 2px;
  font-weight: 500;
`

const Select = styled.select`
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #f59e0b; /* Orange focus */
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
  }
`

const Checkbox = styled.input`
  margin: 0;
  cursor: pointer;
  width: 16px;
  height: 16px;
`

const SaveButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`

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
    date: new Date().toISOString().split("T")[0],
  })
  const [testSelections, setTestSelections] = useState({})
  const [testStatuses, setTestStatuses] = useState({})
  const [saving, setSaving] = useState(false)
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  // Get franchise_id and transferred_by from localStorage on component mount
  useEffect(() => {
    const storedFranchiseId = localStorage.getItem("franchise_id")
    const storedTransferredBy =
      localStorage.getItem("username") || localStorage.getItem("user_name") || localStorage.getItem("logged_user")
    if (storedFranchiseId) {
      setFranchiseId(storedFranchiseId)
    } else {
      setError("Franchise ID not found in localStorage. Please login again.")
    }
    if (storedTransferredBy) {
      setTransferredBy(storedTransferredBy)
    } else {
      setError("User information not found in localStorage. Please login again.")
    }
  }, [])

  // Parse test details - handles the specific format from your API
  const parseTestDetails = (testStr) => {
    try {
      if (!testStr) return []

      let parsed
      if (typeof testStr === "string") {
        // The backend is sending a JSON string that is itself stringified and escaped.
        let cleanedStr = testStr.trim()

        // If it starts and ends with quotes, remove them
        if (cleanedStr.startsWith('"') && cleanedStr.endsWith('"')) {
          cleanedStr = cleanedStr.slice(1, -1)
        }
        // Fix the main issue: Replace all single backslashes with double backslashes
        // This handles cases like "Plain\Gel" -> "Plain\\Gel"
        cleanedStr = cleanedStr.replace(/\\(?!["\\])/g, "\\\\") // Only replace single backslashes not followed by " or \
        // Then unescape the properly escaped quotes
        cleanedStr = cleanedStr.replace(/\\"/g, '"')
        // console.log("Original test string:", testStr)
        // console.log("Cleaned test string for parsing:", cleanedStr)

        parsed = JSON.parse(cleanedStr)
      } else if (Array.isArray(testStr)) {
        parsed = testStr
      } else if (typeof testStr === "object") {
        parsed = [testStr]
      } else {
        return []
      }

      // Ensure we always return an array
      if (!Array.isArray(parsed)) {
        parsed = [parsed]
      }

      // console.log("Successfully parsed test details:", parsed)
      return parsed
    } catch (error) {
      console.error("Error parsing test details:", error, "Input:", testStr)

      // Fallback: try to extract test information manually if JSON parsing fails
      try {
        if (typeof testStr === "string") {
          // Try to extract basic info using regex as a fallback
          const testNameMatch = testStr.match(/"testname":\s*"([^"]+)"/)
          const containerMatch = testStr.match(/"container":\s*"([^"]+)"/)
          const mrpMatch = testStr.match(/"MRP":\s*(\d+)/)

          if (testNameMatch) {
            return [
              {
                testname: testNameMatch[1],
                container: containerMatch ? containerMatch[1].replace(/\\/g, "") : "Plain/Gel",
                MRP: mrpMatch ? Number.parseInt(mrpMatch[1]) : 0,
              },
            ]
          }
        }
      } catch (fallbackError) {
        console.error("Fallback parsing also failed:", fallbackError)
      }

      return []
    }
  }

  // Get test details preview for table display
  const getTestDetailsPreview = (testdetails) => {
    const tests = parseTestDetails(testdetails)
    if (tests.length === 0) return "No tests"
    const testNames = tests.map((test) => test.testname || test.test_name || "Unknown Test").slice(0, 2) // Show first 2 tests
    const preview = testNames.join(", ")
    return tests.length > 2 ? `${preview} +${tests.length - 2} more` : preview
  }

  // Fetch collected samples based on filters
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
        date: filters.date,
      })
      console.log("Fetching collected samples with params:", queryParams.toString())
      // Call the sample endpoint without patient_id to get all collected samples for the date
      const response = await fetch(`${franchiseurl}sample/?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched samples data:", data)
      if (data.error) {
        throw new Error(data.error)
      }
      setSamples(data)
    } catch (error) {
      console.error("Error fetching collected samples:", error)
      setError(`Failed to fetch collected samples: ${error.message}`)
      setSamples([])
    } finally {
      setLoading(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Open modal with sample details
  const openModal = async (sample) => {
    console.log("Opening modal for sample:", sample)
    setSelectedSample(sample)
    setShowModal(true)

    // Fetch current sample status for this patient (if not already fully loaded)
    let currentSampleData = sample // Use the sample data passed directly if it's comprehensive
    if (!currentSampleData || !currentSampleData.testdetails) {
      try {
        const sampleQueryParams = new URLSearchParams({
          franchise_id: franchiseId,
          barcode: sample.barcode,
        })
        const response = await fetch(`${franchiseurl}sample/?${sampleQueryParams}`)
        if (response.ok) {
          currentSampleData = await response.json()
          console.log("Fetched current sample data for modal:", currentSampleData)
        } else if (response.status === 404) {
          console.log("No existing sample data for this patient.")
        } else {
          throw new Error(`HTTP error fetching sample data! status: ${response.status}`)
        }
      } catch (err) {
        console.error("Error fetching sample data for modal:", err)
        setError(`Failed to load sample data for modal: ${err.message}`)
        return // Exit if data cannot be loaded
      }
    }

    // Initialize test selections and statuses based on original tests and fetched sample data
    const originalTests = parseTestDetails(currentSampleData.testdetails)
    const initialSelections = {}
    const initialStatuses = {}

    originalTests.forEach((test, index) => {
      const testKey = `${currentSampleData.patient_id}_${index}`
      const testName = test.testname || test.test_name || "Unknown Test"
      const container = test.container || "Plain/Gel"

      const status = test.samplestatus || "Collected" // Default status from fetched data
      const isSelected = status === "Transferred" // If already transferred, it's selected

      initialSelections[testKey] = isSelected
      initialStatuses[testKey] = status
    })

    setTestSelections(initialSelections)
    setTestStatuses(initialStatuses)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedSample(null)
    setTestSelections({})
    setTestStatuses({})
    setError("") // Clear any modal-specific errors
    setSuccess("") // Clear any modal-specific success
  }

  // Handle individual test selection
  const handleTestSelection = (testKey, selected) => {
    setTestSelections((prev) => ({
      ...prev,
      [testKey]: selected,
    }))
    setTestStatuses((prev) => ({
      ...prev,
      [testKey]: selected ? "Transferred" : "Collected", // If selected, set to Transferred, else Collected
    }))
  }

  // Handle select all
  const handleSelectAll = (selectAll) => {
    if (!selectedSample) return
    const tests = parseTestDetails(selectedSample.testdetails)
    const updatedSelections = {}
    const updatedStatuses = {}

    tests.forEach((test, index) => {
      const testKey = `${selectedSample.patient_id}_${index}`
      // If selectAll is true, mark for transfer, otherwise Collected
      updatedSelections[testKey] = selectAll
      updatedStatuses[testKey] = selectAll ? "Transferred" : "Collected"
    })
    setTestSelections(updatedSelections)
    setTestStatuses(updatedStatuses)
  }

  // Handle status change
  const handleStatusChange = (testKey, status) => {
    setTestStatuses((prev) => ({
      ...prev,
      [testKey]: status,
    }))
    // If status is changed to Transferred, ensure it's selected
    if (status === "Transferred") {
      setTestSelections((prev) => ({
        ...prev,
        [testKey]: true,
      }))
    } else {
      // If changed to Collected, deselect it
      setTestSelections((prev) => ({
        ...prev,
        [testKey]: false,
      }))
    }
  }

  // Save test selections and statuses (for transfer)
  const saveTestData = async () => {
    setSaving(true)
    setError("") // Clear previous errors
    setSuccess("")

    try {
      const originalTests = parseTestDetails(selectedSample.testdetails)
      const currentTime = new Date().toISOString()

      // Prepare test details with new structure for selected tests
      const formattedTestDetails = originalTests
        .map((test, index) => {
          const testKey = `${selectedSample.patient_id}_${index}`
          const isSelected = testSelections[testKey]
          const currentStatus = testStatuses[testKey] || "Collected"

          // Only include tests that are selected for transfer or already transferred
          if (!isSelected && currentStatus !== "Transferred") return null

          const updatedTest = {
            ...test, // Keep existing test details
            samplestatus: currentStatus,
            sampletransferred_time: currentStatus === "Transferred" ? currentTime : null,
            transferred_by: currentStatus === "Transferred" ? transferredBy : null,
          }
          // Ensure collected_by and samplecollected_time are preserved if they exist
          if (test.collected_by) updatedTest.collected_by = test.collected_by
          if (test.samplecollected_time) updatedTest.samplecollected_time = test.samplecollected_time

          return updatedTest
        })
        .filter((test) => test !== null)

      if (formattedTestDetails.length === 0) {
        alert("Please select at least one test to transfer.")
        setSaving(false)
        return
      }

      // Prepare data for API call
      const sampleData = {
        franchise_id: franchiseId,
        barcode: selectedSample.barcode,
        testdetails: formattedTestDetails, // This is the list of selected/updated tests
        // created_by and collected_by are handled by the backend based on status
      }
      console.log("Saving sample data for transfer:", sampleData)

      // Make API call to save sample data using PATCH
      const response = await fetch(`${franchiseurl}sample/`, {
        method: "PATCH", // Use PATCH for updating existing sample
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Sample data transferred successfully:", result)
      setSuccess("Test data transferred successfully!")
      closeModal()
      // Refresh the sample list
      fetchCollectedSamples()
    } catch (error) {
      console.error("Error saving test data:", error)
      setError(`Failed to transfer test data: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Auto-fetch when franchiseId is available
  useEffect(() => {
    if (franchiseId) {
      fetchCollectedSamples()
    }
  }, [franchiseId, filters.date]) // Added filters.date to dependency array for auto-refresh on date change

  // Check if any test is selected for transfer
  const hasSelectedTestsForTransfer = Object.values(testSelections).some((selected) => selected)

  return (
    <Container>
      <Header>
        <Title>Sample Transfer</Title>
        <SampleCount>Collected: {samples.length}</SampleCount>
      </Header>
      {franchiseId && (
        <FranchiseInfo>
          <strong>Franchise ID:</strong> {franchiseId} | <strong>Transferred By:</strong> {transferredBy}
        </FranchiseInfo>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <FilterSection>
        <FilterGroup>
          <Label>Date</Label>
          <Input type="date" value={filters.date} onChange={(e) => handleFilterChange("date", e.target.value)} />
        </FilterGroup>
        <Button onClick={fetchCollectedSamples} disabled={loading || !franchiseId}>
          {loading ? "Loading..." : "Search Collected Samples"}
        </Button>
      </FilterSection>
      {loading && <LoadingSpinner>Loading collected samples...</LoadingSpinner>}
      {!loading && !error && samples.length === 0 && <NoData>No collected samples found for the selected date.</NoData>}
      {!loading && !error && samples.length > 0 && (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {samples.map((sample) => {
                const tests = parseTestDetails(sample.testdetails)
                // Determine overall status for display in the main table
                const allTransferred = tests.every((test) => test.samplestatus === "Transferred")
                const anyCollected = tests.some((test) => test.samplestatus === "Collected")
                const displayStatus = allTransferred ? "Transferred" : anyCollected ? "Collected" : "Collected"

                return (
                  <TableRow key={sample._id || sample.patient_id}>
                    <TableCell>
                      <PatientId>{sample.patient_id}</PatientId>
                    </TableCell>
                    <TableCell>{sample.barcode || "N/A"}</TableCell>
                    <TableCell>
                      <StatusBadge status={displayStatus}>{displayStatus}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <TransferButton onClick={() => openModal(sample)} disabled={allTransferred}>
                        {allTransferred ? "Transferred" : "Transfer"}
                      </TransferButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </tbody>
          </Table>
        </TableContainer>
      )}
      {/* Modal */}
      {showModal && selectedSample && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Sample Transfer Details</ModalTitle>
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
                    Tests for Transfer
                    <TestCount>{parseTestDetails(selectedSample.testdetails).length}</TestCount>
                  </SectionTitle>
                  <SelectAllContainer>
                    <Checkbox
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        Object.values(testSelections).every((selected) => selected) &&
                        Object.values(testSelections).length > 0
                      }
                    />
                    <span>Select All</span>
                  </SelectAllContainer>
                </SectionHeader>
                <TestTable>
                  <TestTableHeader>
                    <TestTableRow>
                      <TestTableHead>Select</TestTableHead>
                      <TestTableHead>Test Name</TestTableHead>
                      <TestTableHead>Container</TestTableHead>
                      <TestTableHead>Status</TestTableHead>
                    </TestTableRow>
                  </TestTableHeader>
                  <tbody>
                    {parseTestDetails(selectedSample.testdetails).map((test, index) => {
                      const testKey = `${selectedSample.patient_id}_${index}`
                      const isTransferred = testStatuses[testKey] === "Transferred"
                      return (
                        <TestTableRow key={index}>
                          <TestTableCell>
                            <Checkbox
                              type="checkbox"
                              checked={testSelections[testKey] || false}
                              onChange={(e) => handleTestSelection(testKey, e.target.checked)}
                              disabled={isTransferred} // Disable checkbox if already transferred
                            />
                          </TestTableCell>
                          <TestTableCell>
                            <TestName>{test.testname || test.test_name || "Unknown Test"}</TestName>
                          </TestTableCell>
                          <TestTableCell>
                            <TestContainer>{test.container || "Plain/Gel"}</TestContainer>
                          </TestTableCell>
                          <TestTableCell>
                            <Select
                              value={testStatuses[testKey] || "Collected"}
                              onChange={(e) => handleStatusChange(testKey, e.target.value)}
                              disabled={isTransferred} // Disable select if already transferred
                            >
                              <option value="Transferred">Transferred</option>
                            </Select>
                          </TestTableCell>
                        </TestTableRow>
                      )
                    })}
                  </tbody>
                </TestTable>
                <SaveButton onClick={saveTestData} disabled={!hasSelectedTestsForTransfer || saving}>
                  {saving ? "Transferring..." : "Transfer Selected Samples"}
                </SaveButton>
              </TestsSection>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default SampleTransfer
