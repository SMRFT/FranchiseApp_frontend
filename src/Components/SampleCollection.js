"use client"
import { useState, useEffect, useMemo } from "react"
import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

// ==========================================
// GLOBAL STYLES
// ==========================================
const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; font-family: 'Roboto', sans-serif; background-color: white; color: white; }
  button {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0); color: white;
    font-family: 'Pacifico', cursive; border: none; border-radius: 15px;
    padding: 10px 16px; cursor: pointer; font-size: 16px; transition: background 0.3s ease; margin-top: 20px;
  }
  button:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)); }
  label { display: block; font-weight: 600; color: white; margin-bottom: 8px; font-size: 0.95rem; text-transform: capitalize; }
  h3 { font-family: 'Pacifico', cursive; color: white; font-size: 30px; margin: 0; text-align: center; }
  table { background-color: white; width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  th { color: #4B9EB0; font-weight: bold; padding: 12px 16px; text-align: left; background-color: #f0f8fa; }
  td { color: black; padding: 12px 16px; border-top: 1px solid #ddd; }
  strong { color: black; }
`

// ==========================================
// STYLED COMPONENTS
// ==========================================
const Container = styled.div`
  width: 100%; margin: 0; padding: 10px; font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe); min-height: 100vh; box-sizing: border-box;
  @media (min-width: 768px) { padding: 20px; }
`
const Header = styled.div`
  display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; padding: 15px;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 16px;
  color: #2d3748; box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  @media (min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: center; padding: 20px; }
`
const Title = styled.h1`
  margin: 0; font-size: 1.25rem; font-weight: 800; color: #2d3748; font-family: 'Pacifico', cursive;
  display: flex; align-items: center; gap: 10px;
  &::before { content: '🧪'; font-size: 1.5rem; }
  @media (min-width: 768px) { font-size: 1.75rem; }
`
const PatientCount = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); color: white; padding: 8px 16px;
  border-radius: 20px; font-size: 0.875rem; font-weight: 600;
  box-shadow: 0 4px 12px rgba(75,158,176,0.3); align-self: flex-start; font-family: 'Roboto', sans-serif;
  @media (min-width: 768px) { align-self: center; }
`
const FilterSection = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 20px; padding: 15px;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr) 2fr auto; align-items: end; padding: 20px; }
`
const FilterGroup = styled.div` display: flex; flex-direction: column; gap: 8px; `
const Label = styled.label`
  font-weight: 700 !important; color: #4a5568 !important; font-size: 0.75rem !important;
  text-transform: uppercase !important; letter-spacing: 0.5px; font-family: 'Roboto', sans-serif !important; margin-bottom: 4px !important;
`
const Input = styled.input`
  padding: 12px 14px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem;
  transition: all 0.3s ease; background: white; color: #2d3748; width: 100%; box-sizing: border-box; font-family: 'Roboto', sans-serif;
  &:focus { outline: none; border-color: #4B9EB0; box-shadow: 0 0 0 3px rgba(75,158,176,0.1); }
`
const ButtonGroup = styled.div`
  display: flex; gap: 10px; margin-top: 5px;
  @media (min-width: 768px) { margin-top: 0; }
`
const Button = styled.button`
  flex: 1; padding: 12px 20px !important; background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important; border: none; border-radius: 15px !important; cursor: pointer; font-size: 0.9rem;
  font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(75,158,176,0.3);
  white-space: nowrap; margin-top: 0 !important;
  &:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)) !important; transform: translateY(-2px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`
const ClearButton = styled(Button)`
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  &:hover { background: linear-gradient(135deg, #f59e0b, #b45309) !important; }
`
const TableContainer = styled.div`
  background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1); margin-bottom: 20px; padding: 10px;
  @media (min-width: 768px) { padding: 0; overflow: hidden; }
`
const StyledTable = styled.table`
  width: 100%; border-collapse: collapse; background-color: white !important;
  @media (max-width: 768px) { display: block; }
`
const TableHeader = styled.thead`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  @media (max-width: 768px) { display: none; }
`
const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0; transition: all 0.2s ease;
  @media (min-width: 768px) { &:hover { background: rgba(75,158,176,0.05); } &:last-child { border-bottom: none; } }
  @media (max-width: 768px) {
    display: block; background: white; border-radius: 12px; margin-bottom: 15px;
    border: 1px solid #e2e8f0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); padding: 15px;
    &:last-child { margin-bottom: 0; }
  }
`
const TableHead = styled.th`
  padding: 16px 12px; text-align: left; font-weight: 700; color: white !important;
  font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; background-color: transparent !important;
`
const TableCell = styled.td`
  padding: 16px 12px; color: #334155 !important; font-size: 0.9rem; vertical-align: middle; border-top: 1px solid #e2e8f0 !important;
  @media (max-width: 768px) {
    display: flex; justify-content: space-between; align-items: center; padding: 10px 0;
    border-bottom: 1px solid #f1f5f9 !important; border-top: none !important; text-align: right;
    &:last-child { border-bottom: none !important; padding-bottom: 0; padding-top: 15px; justify-content: center; }
    &:first-child { padding-top: 0; }
    &::before { content: attr(data-label); font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 0.75rem; text-align: left; margin-right: 10px; }
  }
`
const PatientName = styled.div` font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 1rem; `
const PatientId = styled.div`
  font-size: 0.75rem; color: #64748b; background: #f1f5f9; padding: 2px 8px;
  border-radius: 4px; display: inline-block; font-weight: 600;
`
const PendingBadge = styled.span`
  display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 12px;
  font-size: 0.75rem; font-weight: 700;
  background: ${p => p.count > 0 ? "#fff7ed" : "#f0fdf4"};
  color: ${p => p.count > 0 ? "#d97706" : "#059669"};
  border: 1px solid ${p => p.count > 0 ? "#fed7aa" : "#a7f3d0"};
`
const ViewButton = styled.button`
  padding: 10px 20px !important; background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important; border: none; border-radius: 10px !important; cursor: pointer; font-size: 0.85rem;
  font-weight: 600; transition: all 0.3s ease; width: 100%; margin-top: 0 !important; font-family: 'Roboto', sans-serif !important;
  @media (min-width: 768px) { width: auto; padding: 8px 16px !important; }
  &:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)) !important; transform: translateY(-2px); }
  &:disabled { background: linear-gradient(135deg, #cbd5e1, #94a3b8) !important; cursor: not-allowed; transform: none; }
`
const LoadingSpinner = styled.div`
  display: flex; justify-content: center; align-items: center; height: 200px; font-size: 1rem;
  background: rgba(255,255,255,0.95); border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  color: #4B9EB0; font-weight: 600;
`
const NoData = styled.div`
  text-align: center; padding: 60px 20px; color: #64748b; font-size: 1rem;
  background: rgba(255,255,255,0.95); border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  &::before { content: '📋'; font-size: 3rem; display: block; margin-bottom: 16px; }
`
const ErrorMessage = styled.div`
  background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 16px;
  margin-bottom: 20px; color: #dc2626; font-weight: 600; font-size: 0.9rem;
`

// ── Modal ──
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 10px;
`
const ModalContent = styled.div`
  background: white; border-radius: 20px; width: 100%; max-width: 900px; max-height: 90vh;
  overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); display: flex; flex-direction: column;
`
const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 15px 20px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); color: white; flex-shrink: 0;
  @media (min-width: 768px) { padding: 24px 28px; }
`
const ModalTitle = styled.h2`
  margin: 0; font-size: 1.1rem; font-weight: 700; font-family: 'Pacifico', cursive; color: white;
  @media (min-width: 768px) { font-size: 1.25rem; }
`
const CloseButton = styled.button`
  background: none !important; border: none; font-size: 24px; cursor: pointer; color: white !important;
  padding: 5px; margin-top: 0 !important; border-radius: 0 !important; box-shadow: none !important;
  &:hover { opacity: 0.8; background: none !important; }
`
const ModalBody = styled.div` padding: 0; overflow-y: auto; flex-grow: 1; `
const PatientInfoSection = styled.div`
  padding: 15px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  @media (min-width: 768px) { padding: 24px 28px; }
`
const PatientInfoGrid = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 15px;
  @media (min-width: 480px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); gap: 20px; }
`
const InfoItem = styled.div` display: flex; flex-direction: column; gap: 4px; `
const InfoLabel = styled.span` font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; `
const InfoValue = styled.span` font-size: 0.95rem; color: #1e293b; font-weight: 600; word-break: break-word; `
const TestsSection = styled.div`
  padding: 15px 20px;
  @media (min-width: 768px) { padding: 24px 28px; }
`
const SectionHeader = styled.div`
  display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px;
  @media (min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 20px; }
`
const SectionTitle = styled.h3`
  margin: 0 !important; color: #1e293b !important; font-size: 1rem !important; font-weight: 700;
  text-align: left !important; display: flex; align-items: center; gap: 10px;
  @media (min-width: 768px) { font-size: 1.15rem !important; }
`
const TestCount = styled.span`
  background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 4px 10px;
  border-radius: 12px; font-size: 0.75rem; font-weight: 600;
`
const SelectAllContainer = styled.div`
  display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #475569; font-weight: 600;
  background: #f1f5f9; padding: 8px 12px; border-radius: 8px; width: fit-content;
`
const TestTableWrapper = styled.div`
  overflow-x: auto; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;
`
const TestTable = styled.table`
  width: 100%; border-collapse: collapse; min-width: 500px; background-color: white !important;
`
const TestTableHeader = styled.thead` background: #f0f8fa !important; `
const TestTableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0; transition: all 0.2s ease; background: white;
  &:hover { background: #f8fafc; } &:last-child { border-bottom: none; }
`
const TestTableHead = styled.th`
  padding: 12px !important; text-align: left !important; font-weight: 700; color: #4B9EB0 !important;
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; background-color: #f0f8fa !important;
`
const TestTableCell = styled.td`
  padding: 12px !important; color: #334155 !important; font-size: 0.85rem; vertical-align: middle; border-top: 1px solid #e2e8f0 !important;
`
const TestName = styled.div` font-weight: 600; color: #1e293b; margin-bottom: 4px; font-size: 0.9rem; line-height: 1.4; `
const TestContainerBadge = styled.div`
  font-size: 0.7rem; color: #64748b; background: #f1f5f9; padding: 3px 8px; border-radius: 4px; display: inline-block; font-weight: 600;
`
const TestPrice = styled.div`
  font-size: 0.75rem; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 4px; display: inline-block; font-weight: 700;
`
const Select = styled.select`
  padding: 8px 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; background: white;
  cursor: pointer; transition: all 0.3s ease; width: 100%; font-family: 'Roboto', sans-serif; color: #334155;
  &:focus { outline: none; border-color: #4B9EB0; box-shadow: 0 0 0 3px rgba(75,158,176,0.1); }
`
const Checkbox = styled.input`
  margin: 0; cursor: pointer; width: 20px; height: 20px; accent-color: #4B9EB0;
`
const SaveButton = styled.button`
  width: 100%; padding: 14px 20px !important; background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important; border: none; border-radius: 12px !important; cursor: pointer; font-size: 1rem; font-weight: 700;
  transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(75,158,176,0.3); margin-bottom: 10px; margin-top: 0 !important;
  &:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)) !important; transform: translateY(-2px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`

// ==========================================
// HELPERS
// ==========================================
const parseTestDetails = (testStr) => {
  try {
    if (!testStr) return []
    if (Array.isArray(testStr)) return testStr
    if (typeof testStr === "object") return [testStr]
    let s = testStr.trim()
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1)
    s = s.replace(/\\(?!["\\])/g, "\\\\").replace(/\\"/g, '"')
    const parsed = JSON.parse(s)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch { return [] }
}

// ==========================================
// COMPONENT
// ==========================================
const SampleCollection = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [franchiseId, setFranchiseId] = useState("")
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchQuery: "",
  })
  // testSelections: { [testKey]: boolean | null }
  // null  = already Collected (hidden from modal)
  // false = unchecked but visible
  // true  = checked
  const [testSelections, setTestSelections] = useState({})
  const [testStatuses, setTestStatuses] = useState({})
  const [saving, setSaving] = useState(false)

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  useEffect(() => {
    const id = localStorage.getItem("franchise_id")
    if (id) setFranchiseId(id)
    else setError("Franchise ID not found. Please login again.")
  }, [])

  // ── Fetch patients from billing (backend already filters: no sample OR has Pending) ──
  const fetchPatients = async () => {
    if (!franchiseId) { setError("Franchise ID is required"); return }
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({
        franchise_id: franchiseId,
        start_date: filters.startDate,
        end_date: filters.endDate,
      })
      const res = await fetch(`${franchiseurl}get_patient_by_franchise_and_date/?${params}`)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPatients(data)
    } catch (e) {
      setError(`Failed to fetch patients: ${e.message}`)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (franchiseId) fetchPatients() }, [franchiseId])

  const filteredPatients = useMemo(() => {
    if (!filters.searchQuery) return patients
    const q = filters.searchQuery.toLowerCase()
    return patients.filter(p =>
      p.patientname?.toLowerCase().includes(q) ||
      p.patient_id?.toLowerCase().includes(q) ||
      p.barcode?.toLowerCase().includes(q)
    )
  }, [patients, filters.searchQuery])

  // ── Open modal: cross-reference billing tests vs already-collected sample tests ──
  // Show only tests that are NOT yet collected (Pending or unsaved)
  const openModal = async (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)

    // Try to fetch existing sample to know which tests are already Collected
    let collectedTestIds = new Set()
    let collectedTestNames = new Set()
    try {
      const params = new URLSearchParams({ franchise_id: franchiseId, barcode: patient.barcode })
      const res = await fetch(`${franchiseurl}sample/?${params}`)
      if (res.ok) {
        const sampleData = await res.json()
        const existingTests = parseTestDetails(sampleData.testdetails)
        existingTests.forEach(t => {
          if (t.samplestatus === "Collected" || t.samplestatus === "Transferred") {
            if (t.test_id) collectedTestIds.add(t.test_id)
            if (t.testname || t.test_name) collectedTestNames.add(t.testname || t.test_name)
          }
        })
      }
    } catch (e) {
      // No existing sample — all tests are new/pending, show all
    }

    // Build selections from billing testdetails (already enriched with collection_container by backend)
    const billingTests = parseTestDetails(patient.testdetails)
    const initialSelections = {}
    const initialStatuses = {}

    billingTests.forEach((test, index) => {
      const testKey = `${patient.patient_id}_${index}`
      const testId = test.test_id
      const testName = test.testname || test.test_name || ""

      // Check if this test is already collected
      const alreadyCollected =
        (testId && collectedTestIds.has(testId)) ||
        (!testId && testName && collectedTestNames.has(testName))

      if (alreadyCollected) {
        initialSelections[testKey] = null      // null = hidden
        initialStatuses[testKey] = "Collected"
      } else {
        // Pending or new — show it, pre-checked, default status = Collected
        initialSelections[testKey] = true
        initialStatuses[testKey] = "Collected"
      }
    })

    setTestSelections(initialSelections)
    setTestStatuses(initialStatuses)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
    setTestSelections({})
    setTestStatuses({})
    setError("")
  }

  const handleTestSelection = (testKey, checked) => {
    setTestSelections(prev => ({ ...prev, [testKey]: checked }))
  }

  const handleStatusChange = (testKey, status) => {
    setTestStatuses(prev => ({ ...prev, [testKey]: status }))
    if (status === "Collected") setTestSelections(prev => ({ ...prev, [testKey]: true }))
  }

  const handleSelectAll = (selectAll) => {
    if (!selectedPatient) return
    const tests = parseTestDetails(selectedPatient.testdetails)
    const updated = {}
    tests.forEach((_, i) => {
      const k = `${selectedPatient.patient_id}_${i}`
      if (testSelections[k] !== null) updated[k] = selectAll
    })
    setTestSelections(prev => ({ ...prev, ...updated }))
  }

  const saveTestData = async () => {
    setSaving(true)
    setError("")
    try {
      const billingTests = parseTestDetails(selectedPatient.testdetails)
      const currentTime = new Date().toISOString()

      const formattedTests = billingTests
        .map((test, index) => {
          const testKey = `${selectedPatient.patient_id}_${index}`
          if (testSelections[testKey] === null) return null  // already collected, skip
          if (!testSelections[testKey]) return null           // unchecked, skip

          const status = testStatuses[testKey] || "Collected"
          return {
            testname: test.testname || test.test_name || "Unknown Test",
            test_id: test.test_id || null,
            samplestatus: status,
            samplecollected_time: status === "Collected" ? currentTime : null,
            collected_by: status === "Collected" ? franchiseId : null,
            collection_container: test.collection_container || test.container || null,
            specimen_type: test.specimen_type || null,
            batch_number: null,
            sampletransferred_time: null,
            transferred_by: null,
            received_time: null,
            received_by: null,
            remarks: null,
          }
        })
        .filter(Boolean)

      if (formattedTests.length === 0) {
        alert("Please select at least one test to save.")
        setSaving(false)
        return
      }

      const res = await fetch(`${franchiseurl}sample/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          franchise_id: franchiseId,
          barcode: selectedPatient.barcode,
          testdetails: formattedTests,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || `HTTP error ${res.status}`)
      }

      alert("Test data saved successfully!")
      closeModal()
      fetchPatients()
    } catch (e) {
      setError(`Failed to save: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  // ── Derive counts from billing testdetails + what's hidden ──
  const getPendingCount = (patient) => {
    const billingTests = parseTestDetails(patient.testdetails)
    return billingTests.length  // Backend already filters out fully-collected patients
  }

  // Visible tests in modal (not null)
  const visibleTests = selectedPatient
    ? parseTestDetails(selectedPatient.testdetails).filter((_, i) => {
        const k = `${selectedPatient.patient_id}_${i}`
        return testSelections[k] !== null
      })
    : []

  const hasSelectedTests = Object.values(testSelections).some(v => v === true)

  const allVisibleSelected = visibleTests.length > 0 && selectedPatient &&
    parseTestDetails(selectedPatient.testdetails).every((_, i) => {
      const k = `${selectedPatient.patient_id}_${i}`
      return testSelections[k] === null || testSelections[k] === true
    })

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Sample Collection</Title>
          <PatientCount>Total Patients: {filteredPatients.length}</PatientCount>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FilterSection>
          <FilterGroup>
            <Label>From Date</Label>
            <Input type="date" value={filters.startDate} onChange={e => setFilters(p => ({ ...p, startDate: e.target.value }))} />
          </FilterGroup>
          <FilterGroup>
            <Label>To Date</Label>
            <Input type="date" value={filters.endDate} onChange={e => setFilters(p => ({ ...p, endDate: e.target.value }))} />
          </FilterGroup>
          <FilterGroup>
            <Label>Search</Label>
            <Input type="text" placeholder="Search by Name, ID or Barcode..." value={filters.searchQuery} onChange={e => setFilters(p => ({ ...p, searchQuery: e.target.value }))} />
          </FilterGroup>
          <ButtonGroup>
            <Button onClick={fetchPatients} disabled={loading || !franchiseId}>{loading ? "Loading..." : "Search"}</Button>
            <ClearButton onClick={() => {
              const today = new Date().toISOString().split("T")[0]
              setFilters({ startDate: today, endDate: today, searchQuery: "" })
            }}>Clear</ClearButton>
          </ButtonGroup>
        </FilterSection>

        {loading && <LoadingSpinner>Loading patients...</LoadingSpinner>}

        {!loading && filteredPatients.length === 0 && (
          <NoData>
            <h3 style={{ color: "#64748b", fontFamily: "Pacifico, cursive", fontSize: "1.2rem" }}>No patients with pending tests</h3>
            <p style={{ color: "#94a3b8" }}>All samples collected, or try a different date range</p>
          </NoData>
        )}

        {!loading && filteredPatients.length > 0 && (
          <TableContainer>
            <StyledTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {filteredPatients.map(patient => {
                  const pendingCount = getPendingCount(patient)
                  return (
                    <TableRow key={patient._id || patient.patient_id}>
                      <TableCell data-label="Patient">
                        <PatientName>{patient.patientname || "Unknown"}</PatientName>
                        <PatientId>#{patient.patient_id}</PatientId>
                      </TableCell>
                      <TableCell data-label="Date">
                        {patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString("en-GB") : "—"}
                      </TableCell>
                      <TableCell data-label="Barcode">
                        <strong>{patient.barcode || "N/A"}</strong>
                      </TableCell>
                      <TableCell data-label="Action">
                        <ViewButton onClick={() => openModal(patient)} disabled={pendingCount === 0}>
                          {pendingCount === 0 ? "✓ Collected" : "View / Collect"}
                        </ViewButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>
            </StyledTable>
          </TableContainer>
        )}

        {/* Modal */}
        {showModal && selectedPatient && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Sample Collection</ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <PatientInfoSection>
                  <PatientInfoGrid>
                    <InfoItem><InfoLabel>Patient Name</InfoLabel><InfoValue>{selectedPatient.patientname || "Unknown"}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Patient ID</InfoLabel><InfoValue>{selectedPatient.patient_id}</InfoValue></InfoItem>
                    <InfoItem><InfoLabel>Barcode</InfoLabel><InfoValue>{selectedPatient.barcode}</InfoValue></InfoItem>
                    <InfoItem>
                      <InfoLabel>Registration Date</InfoLabel>
                      <InfoValue>{selectedPatient.registrationDate ? new Date(selectedPatient.registrationDate).toLocaleDateString("en-GB") : "—"}</InfoValue>
                    </InfoItem>
                  </PatientInfoGrid>
                </PatientInfoSection>

                <TestsSection>
                  <SectionHeader>
                    <SectionTitle>
                      Pending Tests
                      <TestCount>{visibleTests.length}</TestCount>
                    </SectionTitle>
                    {visibleTests.length > 0 && (
                      <SelectAllContainer>
                        <Checkbox type="checkbox" checked={allVisibleSelected} onChange={e => handleSelectAll(e.target.checked)} />
                        <span>Select All</span>
                      </SelectAllContainer>
                    )}
                  </SectionHeader>

                  {visibleTests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px", borderRadius: 12, border: "1px solid #e2e8f0", color: "#64748b" }}>
                      ✅ All tests have been collected for this patient.
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
                              <TestTableHead>Price</TestTableHead>
                              <TestTableHead>Status</TestTableHead>
                            </TestTableRow>
                          </TestTableHeader>
                          <tbody>
                            {parseTestDetails(selectedPatient.testdetails).map((test, index) => {
                              const testKey = `${selectedPatient.patient_id}_${index}`
                              if (testSelections[testKey] === null) return null  // already collected, hidden

                              return (
                                <TestTableRow key={index}>
                                  <TestTableCell>
                                    <Checkbox type="checkbox" checked={testSelections[testKey] || false} onChange={e => handleTestSelection(testKey, e.target.checked)} />
                                  </TestTableCell>
                                  <TestTableCell>
                                    <TestName>{test.testname || test.test_name || "Unknown Test"}</TestName>
                                  </TestTableCell>
                                  <TestTableCell>
                                    {/* Backend enriches with collection_container from core_testdetails */}
                                    <TestContainerBadge>{test.collection_container || test.container || "Plain/Gel"}</TestContainerBadge>
                                  </TestTableCell>
                                  <TestTableCell>
                                    <TestPrice>₹{test.MRP || 0}</TestPrice>
                                  </TestTableCell>
                                  <TestTableCell>
                                    <Select value={testStatuses[testKey] || "Collected"} onChange={e => handleStatusChange(testKey, e.target.value)}>
                                      <option value="Pending">Pending</option>
                                      <option value="Collected">Collected</option>
                                    </Select>
                                  </TestTableCell>
                                </TestTableRow>
                              )
                            })}
                          </tbody>
                        </TestTable>
                      </TestTableWrapper>
                      <SaveButton onClick={saveTestData} disabled={!hasSelectedTests || saving}>
                        {saving ? "Saving..." : "Save Selected Tests"}
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

export default SampleCollection