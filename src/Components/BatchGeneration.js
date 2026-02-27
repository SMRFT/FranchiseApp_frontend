"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Styled Components (keeping the same styling as before)
const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  min-height: 100vh;
`

const Header = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(75, 158, 176, 0.2);
`

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
`

const Subtitle = styled.p`
  margin: 10px 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
`

const SectionTitle = styled.h2`
  color: #495057;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: ${(props) => (props.readOnly ? "#f8f9fa" : "white")};
  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  &:disabled {
    background: #ced4da;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const DownloadButton = styled(Button)`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    transition: background-color 0.2s ease;
  }
`

const TableHeaderCell = styled.th`
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.95rem;
  color: #495057;
`

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => {
    switch (props.status) {
      case "transferred":
        return "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
      case "pending":
        return "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)"
      default:
        return "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
    }
  }};
  color: white;
`

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '✅';
    font-size: 1.2rem;
  }
`

const LoadingMessage = styled.div`
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '⏳';
    font-size: 1.2rem;
  }
`

const BatchSummary = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #2196f3;
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
`

const SummaryItem = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const SummaryValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`

const SummaryLabel = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  &::before {
    content: '📋';
    font-size: 4rem;
    display: block;
    margin-bottom: 20px;
  }
`

const SpecimenSummary = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
`

const SpecimenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
`

const SpecimenItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dee2e6;
`

const SpecimenType = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
  font-size: 0.9rem;
`

const SpecimenCount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
`

const ModalTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #495057;
`

const ModalText = styled.p`
  margin: 15px 0;
  color: #6c757d;
`

const SampleBatchManagement = () => {
  const [franchiseId, setFranchiseId] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [transferredSamples, setTransferredSamples] = useState([])
  const [loadingSamples, setLoadingSamples] = useState(false)
  const [sampleError, setSampleError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [loadingBatch, setLoadingBatch] = useState(false)
  const [batchError, setBatchError] = useState(null)
  const [batchSuccess, setBatchSuccess] = useState(null)
  const [franchiseTestDetails, setFranchiseTestDetails] = useState([])
  const [createdBatchData, setCreatedBatchData] = useState(null)

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  useEffect(() => {
    const storedFranchiseId = localStorage.getItem("franchise_id")
    if (storedFranchiseId) {
      setFranchiseId(storedFranchiseId)
      fetchFranchiseDetails(storedFranchiseId)
    }
    const today = getCurrentDate()
    setFromDate(today)
    setToDate(today)
  }, [])

  useEffect(() => {
    if (franchiseId && fromDate && toDate) {
      fetchTransferredSamples()
    }
  }, [franchiseId, fromDate, toDate])

  const fetchFranchiseDetails = async (fId) => {
    try {
      const testDetailsResponse = await fetch(`${franchiseurl}test-details/?franchise_id=${fId}`)
      if (testDetailsResponse.ok) {
        const testDetailsData = await testDetailsResponse.json()
        setFranchiseTestDetails(testDetailsData.results || testDetailsData || [])
      }
    } catch (error) {
      console.error("Error fetching franchise details:", error)
    }
  }

  const fetchTransferredSamples = async () => {
    setLoadingSamples(true)
    setSampleError(null)
    setTransferredSamples([])

    try {
      if (!franchiseId) {
        throw new Error("Franchise ID is required.")
      }

      let url = `${franchiseurl}samples/transferred/?franchise_id=${franchiseId}&samplestatus=Transferred`
      if (fromDate && toDate) {
        url += `&start_date=${fromDate}&end_date=${toDate}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch transferred samples.")
      }

      const data = await response.json()
      if (data.transferred_samples && Array.isArray(data.transferred_samples)) {
        setTransferredSamples(data.transferred_samples)
      }
    } catch (error) {
      setSampleError(error.message)
    } finally {
      setLoadingSamples(false)
    }
  }

  const handleBatchCreation = () => {
    if (transferredSamples.length === 0) {
      setBatchError("No samples to batch. Please fetch samples first.")
      return
    }
    setShowConfirmModal(true)
  }

  const confirmBatchCreation = async () => {
    setShowConfirmModal(false)
    setLoadingBatch(true)
    setBatchError(null)
    setBatchSuccess(null)

    try {
      const batchDetails = transferredSamples.map((sample) => ({
        barcode: sample.barcode,
      }))

      const payload = {
        franchise_id: franchiseId,
        batch_details: batchDetails,
        received: false,
        remarks: null,
      }

      console.log("Sending payload:", payload)

      const response = await fetch(`${franchiseurl}batch/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Failed to create batch.")
      }

      const data = await response.json()
      setBatchSuccess("Batch created successfully!")
      setCreatedBatchData({
        ...data,
        samples: transferredSamples,
      })

      console.log("Batch created:", data)
      setTransferredSamples([])
    } catch (error) {
      setBatchError(error.message)
    } finally {
      setLoadingBatch(false)
    }
  }

  const generateBarcode = (text) => {
    // Simple barcode representation using pipes
    return "||||| || ||| | |||| ||| || | |||||| | || ||| ||||"
  }

  const downloadPDF = async () => {
    if (!createdBatchData) return
    try {
      // Create scripts for jsPDF and autoTable if they don't exist
      if (!window.jsPDF) {
        // Load jsPDF
        const jsPDFScript = document.createElement('script')
        jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        document.head.appendChild(jsPDFScript)
        await new Promise((resolve, reject) => {
          jsPDFScript.onload = resolve
          jsPDFScript.onerror = reject
        })
        // Load autoTable plugin
        const autoTableScript = document.createElement('script')
        autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
        document.head.appendChild(autoTableScript)
        await new Promise((resolve, reject) => {
          autoTableScript.onload = resolve
          autoTableScript.onerror = reject
        })
      }
      // Access jsPDF from the global window object
      const jsPDF = window.jsPDF || window.jspdf?.jsPDF
      if (!jsPDF) {
        throw new Error('jsPDF library failed to load')
      }
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      const formattedTime = currentDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      // Barcode (simple representation)
      doc.setFontSize(10)
      doc.setFont("courier", "normal")
      doc.text("||||| || ||| | |||| ||| || | |||||| | || ||| ||||", 20, 20)
      // Main Header
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("Shanmuga Diagnostics", pageWidth / 2, 35, { align: "center" })
      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text("Shipment Report", pageWidth / 2, 45, { align: "center" })
      // Add underline for Shipment Report
      const textWidth = doc.getTextWidth("Shipment Report")
      doc.line((pageWidth - textWidth) / 2, 47, (pageWidth + textWidth) / 2, 47)
      // Left column details
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const leftX = 20
      const rightX = pageWidth / 2 + 20
      let yPos = 65
      // Left side information
      doc.text(`Shipment No    : ${createdBatchData.batch_number || "N/A"}`, leftX, yPos)
      doc.text(`Shipment Date  : ${formattedDate} ${formattedTime}`, rightX, yPos)
      yPos += 10
      // Main table
      const tableHeaders = [
        "Specimen Id",
        "Collection Date",
        "Patient Name",
        "Test Name",
        "Received On",
      ]
      const tableData = createdBatchData.samples.map((sample, index) => [
        sample.barcode || "N/A",
        formattedDate + " " + formattedTime.substring(0, 5),
        sample.patient_name || `Patient ${index + 1}`,
        sample.testdetails?.testname || "N/A",
        "", // Received On
      ])
      // Use autoTable
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [173, 216, 230], // Light blue
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 20 },
          2: { cellWidth: 18 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
        },
        margin: { left: 20, right: 20 },
      })
      // Specimen Summary Table
      yPos = doc.lastAutoTable.finalY + 15
      const specimenHeaders = ["Specimen Name", "Count"]
      const specimenData = []
      if (createdBatchData.specimen_count) {
        createdBatchData.specimen_count.forEach((spec) => {
          specimenData.push([spec.specimen_type, spec.count.toString()])
        })
        const totalCount = createdBatchData.specimen_count.reduce((sum, spec) => sum + spec.count, 0)
        specimenData.push(["Total", totalCount.toString()])
      }
      if (specimenData.length > 0) {
        doc.autoTable({
          head: [specimenHeaders],
          body: specimenData,
          startY: yPos,
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [173, 216, 230], // Light blue
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 30, halign: "center" },
          },
          margin: { left: 20, right: 20 },
        })
        yPos = doc.lastAutoTable.finalY + 30
      } else {
        yPos += 30
      }
      // Signature section
      doc.setFontSize(10)
      doc.text("Signature      :", leftX, yPos)
      // Save the PDF
      doc.save(`shipment_${createdBatchData.batch_number}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("PDF generation failed. Please ensure you have a stable internet connection and try again.")
    }
  }
  return (
    <Container>
      <Header>
        <Title>Sample Batch Management</Title>
        <Subtitle>Manage and track transferred samples efficiently</Subtitle>
      </Header>

      <Card>
        <SectionTitle>Search Parameters</SectionTitle>
        <FormGrid>
          <InputGroup>
            <Label htmlFor="franchiseId">Franchise ID</Label>
            <Input
              id="franchiseId"
              type="text"
              value={franchiseId}
              onChange={(e) => {
                setFranchiseId(e.target.value)
                if (e.target.value) {
                  fetchFranchiseDetails(e.target.value)
                }
              }}
              placeholder="Enter Franchise ID"
              disabled
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </InputGroup>
        </FormGrid>

        {sampleError && <ErrorMessage>{sampleError}</ErrorMessage>}
        {loadingSamples && <LoadingMessage>Loading samples...</LoadingMessage>}
      </Card>

      {transferredSamples.length > 0 && (
        <Card>
          <SectionTitle>Transferred Samples ({transferredSamples.length} samples)</SectionTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>#</TableHeaderCell>
                <TableHeaderCell>Barcode</TableHeaderCell>
                <TableHeaderCell>Test Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {transferredSamples.map((sample, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sample.barcode}</TableCell>
                  <TableCell>{sample.testdetails?.testname || "N/A"}</TableCell>
                  <TableCell>
                    <StatusBadge status="transferred">Transferred</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <ButtonGroup style={{ marginTop: "20px" }}>
            <Button onClick={handleBatchCreation}>Create Batch</Button>
          </ButtonGroup>
        </Card>
      )}

      {transferredSamples.length === 0 && !loadingSamples && !sampleError && (
        <Card>
          <EmptyState>
            <h3>No Transferred Samples Found</h3>
            <p>Try selecting a different date or franchise ID</p>
          </EmptyState>
        </Card>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Confirm Batch Creation</ModalTitle>
            <ModalText>Are you sure you want to create a batch with {transferredSamples.length} samples?</ModalText>
            <ModalText>
              <strong>Note:</strong> Shipment details will be automatically populated based on your franchise
              information.
            </ModalText>
            <ButtonGroup style={{ justifyContent: "center", marginTop: "20px" }}>
              <Button onClick={confirmBatchCreation} disabled={loadingBatch}>
                {loadingBatch ? "Creating..." : "Confirm"}
              </Button>
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={loadingBatch}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ConfirmationModal>
      )}

      {batchError && <ErrorMessage>{batchError}</ErrorMessage>}
      {batchSuccess && <SuccessMessage>{batchSuccess}</SuccessMessage>}

      {createdBatchData && (
        <Card>
          <SectionTitle>Batch Created Successfully</SectionTitle>
          <BatchSummary>
            <h3 style={{ margin: "0 0 20px 0", color: "#495057" }}>Batch Details</h3>
            <SummaryGrid>
              <SummaryItem>
                <SummaryValue>{createdBatchData.batch_number}</SummaryValue>
                <SummaryLabel>Batch Number</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>{createdBatchData.samples?.length || 0}</SummaryValue>
                <SummaryLabel>Total Samples</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>{new Date().toLocaleDateString()}</SummaryValue>
                <SummaryLabel>Created Date</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>{createdBatchData.shipment_from || "N/A"}</SummaryValue>
                <SummaryLabel>Shipment From</SummaryLabel>
              </SummaryItem>
            </SummaryGrid>

            {/* Specimen Summary */}
            {createdBatchData.specimen_counts && createdBatchData.specimen_counts.length > 0 && (
              <SpecimenSummary>
                <h4 style={{ margin: "0 0 15px 0", color: "#495057" }}>Specimen Summary</h4>
                <SpecimenGrid>
                  {createdBatchData.specimen_counts.map((specimen, index) => (
                    <SpecimenItem key={index}>
                      <SpecimenType>{specimen.specimen_type}</SpecimenType>
                      <SpecimenCount>{specimen.count}</SpecimenCount>
                    </SpecimenItem>
                  ))}
                  <SpecimenItem
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
                  >
                    <SpecimenType style={{ color: "white" }}>Total</SpecimenType>
                    <SpecimenCount style={{ color: "white" }}>
                      {createdBatchData.specimen_counts.reduce((sum, spec) => sum + spec.count, 0)}
                    </SpecimenCount>
                  </SpecimenItem>
                </SpecimenGrid>
              </SpecimenSummary>
            )}

            <ButtonGroup>
              <DownloadButton onClick={downloadPDF}>📄 Download PDF Report</DownloadButton>
            </ButtonGroup>
          </BatchSummary>
        </Card>
      )}
    </Container>
  )
}

export default SampleBatchManagement
