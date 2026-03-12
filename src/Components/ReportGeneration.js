"use client"

import { useState, useEffect, useMemo } from "react"
import styled from "styled-components"
import jsPDF from "jspdf"
import JsBarcode from "jsbarcode"
import { format } from "date-fns"
import axios from "axios"
import headerImage from "./images/Header.png";
import FooterImage from "./images/Footer.png";
import Rajesh from "./images/Rajesh.png";

const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`

const Header = styled.header`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 600;
`

const Subtitle = styled.p`
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
`

const ControlsRow = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`

const DateLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
`

const DateInput = styled.input`
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4B9EB0;
    box-shadow: 0 0 0 3px rgba(75, 158, 176, 0.1);
  }
`

const Divider = styled.div`
  width: 1px;
  height: 36px;
  background: #e1e5e9;
  margin: 0 5px;

  @media (max-width: 600px) {
    display: none;
  }
`

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;
`

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  color: #9aa5b1;
  pointer-events: none;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4B9EB0;
    box-shadow: 0 0 0 3px rgba(75, 158, 176, 0.1);
  }

  &::placeholder {
    color: #b0b8c1;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9aa5b1;
  font-size: 16px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 50%;

  &:hover {
    color: #4B9EB0;
    background: #f0f7fa;
  }
`

const ResultCount = styled.span`
  font-size: 13px;
  color: #6c757d;
  white-space: nowrap;
`

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e1e5e9;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
`

const TableHeaderCell = styled.th`
  padding: 20px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`

const TableBody = styled.tbody``

const TableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f7fa;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e1e5e9;
  }
`

const TableCell = styled.td`
  padding: 15px;
  font-size: 14px;
  color: #2c3e50;
  vertical-align: middle;
`

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const PrintButton = styled.button`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

const PrintIcon = styled.span`
  font-size: 14px;
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;

  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4B9EB0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0%  { transform: rotate(0deg); }
    100%{ transform: rotate(360deg); }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const EmptyStateIcon = styled.div`font-size: 48px; margin-bottom: 20px;`
const EmptyStateTitle = styled.h3`font-size: 20px; color: #495057; margin-bottom: 10px;`
const EmptyStateText = styled.p`color: #6c757d; font-size: 16px;`

const PatientName = styled.div`font-weight: 600; color: #2c3e50;`

const BarcodeText = styled.div`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #495057;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`

// Highlight matched text
const HighlightedText = ({ text = "", query = "" }) => {
  if (!query.trim()) return <span>{text}</span>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = String(text).split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} style={{ background: "#fff3a3", borderRadius: 2, padding: "0 1px" }}>{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const PatientReportTable = () => {
  const [fromDate, setFromDate]     = useState("")
  const [toDate, setToDate]         = useState("")
  const [patients, setPatients]     = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState("")
  const [franchiseId, setFranchiseId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const getCurrentDate = () => new Date().toISOString().split("T")[0]

  useEffect(() => {
    const storedFranchiseId = localStorage.getItem("franchise_id")
    if (storedFranchiseId) {
      setFranchiseId(storedFranchiseId)
    } else {
      setError("Franchise ID not found in localStorage. Please login again.")
    }
  }, [])

  useEffect(() => {
    setFromDate(getCurrentDate())
    setToDate(getCurrentDate())
  }, [])

  useEffect(() => {
    if (fromDate && toDate && franchiseId) {
      fetchPatients()
    }
  }, [fromDate, toDate, franchiseId])

  // ─── Filter patients by search query ────────────────────────────────────────
  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) => {
      const name      = String(p.patientname || "").toLowerCase()
      const patientId = String(p.patient_id  || "").toLowerCase()
      const barcode   = String(p.barcode      || "").toLowerCase()
      return name.includes(q) || patientId.includes(q) || barcode.includes(q)
    })
  }, [patients, searchQuery])

  // ─── Fetch patients ──────────────────────────────────────────────────────────
  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${franchiseurl}get_test_value_for_franchise/?from_date=${fromDate}&to_date=${toDate}&franchise_id=${franchiseId}`,
      )
      if (!response.ok) throw new Error("Failed to fetch data")

      const result   = await response.json()
      const testData = result.data || []

      // Group by barcode — one row per barcode
      const groupedMap = {}
      testData.forEach((item) => {
        const barcode = item.barcode
        if (!groupedMap[barcode]) {
          groupedMap[barcode] = {
            ...item,
            patient_id:  item.patient_id || item.franchise_id,
            patientname: item.patientname || item.testdetails?.[0]?.patientname || "Unknown",
            date:        item.date,
            testdetails: Array.isArray(item.testdetails) ? [...item.testdetails] : [],
          }
        } else {
          const incoming = Array.isArray(item.testdetails) ? item.testdetails : []
          groupedMap[barcode].testdetails = [...groupedMap[barcode].testdetails, ...incoming]
        }
      })

      setPatients(Object.values(groupedMap))
    } catch (err) {
      console.error("Error fetching patients:", err)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  // ─── PDF Generation ──────────────────────────────────────────────────────────
  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      console.log("Fetching patient details for barcode:", patient.barcode)

      const response = await axios.get(
        `${franchiseurl}get_patient_by_barcode/?date=${patient.date}&franchise_id=${franchiseId}&barcode=${patient.barcode}`,
      )

      if (!response.data) {
        console.error("Failed to fetch patient details: No data returned")
        setLoading(false)
        return null
      }

      console.log("API Response:", response.data)

      let patientDetails = response.data
      let signaturesData = []

      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap((record) => record.testdetails || []),
        }
      }

      if (patientDetails.test_data?.data?.[0]) {
        const testData = patientDetails.test_data.data[0]
        patientDetails = {
          ...patientDetails,
          testdetails: testData.testdetails.map((test) => ({
            ...test,
            samplecollected_time: testData.date || new Date().toISOString(),
            received_time:        testData.date || new Date().toISOString(),
            dispatch_time:        test.dispatch_time || null,
            department:           test.department    || "GENERAL",
            verified_by:          test.verified_by   || "Lab Technician",
          })),
        }
      }

      console.log("Processed Patient Details:", patientDetails)

      if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
        console.error("No test details found for the patient.")
        setLoading(false)
        return null
      }

      // Unicode
      const unicodeMap = {
        μ: "µ", α: "α", β: "β", γ: "γ", δ: "δ", Ω: "Ω",
        "²": "²", "³": "³", "⁴": "⁴",
        "°": "°", "±": "±", "×": "x", "÷": "/",
        "\\u03bc": "µ", "\\u00b5": "µ", "\\u00b0": "°",
        "\\u00b1": "±", "\\u00b2": "²", "\\u00b3": "³",
      }

      const processUnicodeText = (text) => {
        if (!text) return ""
        let processed = text
        processed = processed.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          const char = String.fromCharCode(parseInt(hex, 16))
          return unicodeMap[char] || char
        })
        Object.keys(unicodeMap).forEach((key) => {
          processed = processed.replace(new RegExp(key, "g"), unicodeMap[key])
        })
        return processed
      }

      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A"
        return refNo.split("+")[0]
      }

      // Designation-based consultants
      const designationMapping = {
        "DESIG101": { position: 0, title: "Consultant Microbiologist" },
        "DESIG100": { position: 1, title: "Consultant Pathologist" },
        "DESIG099": { position: 2, title: "Consultant Biochemist" },
      }

      const consultants = [null, null, null]
      signaturesData.forEach((sig) => {
        const mapping = designationMapping[sig.designation]
        if (mapping) {
          consultants[mapping.position] = [
            sig.employeeName,
            mapping.title,
            sig.signatureBase64 ? `data:image/png;base64,${sig.signatureBase64}` : null,
          ]
        }
      })

      if (consultants.every((c) => c === null)) {
        consultants[2] = ["Dr.V.Dhana Rangesh Kumar Ph.D.,",     "Consultant Biochemist",     Rajesh]
      }

      const activeConsultants = consultants.filter((c) => c !== null)
      console.log("Active Consultants:", activeConsultants)

      const departmentOrder = [
        "Haematology", "Coagulation", "Biochemistry", "Immunology",
        "Immunoassay", "Serology", "Clinical Pathology", "Clinical Chemistry",
        "Cytology", "Genetics", "Histopathology", "Immunohistochemistry",
        "Microbiology", "Molecular Biology",
      ]

      // Barcode
      const patientRefNo       = patientDetails.barcode || "N/A"
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo)

      let barcodeImage = null
      if (patientRefNoNumber !== "N/A") {
        const barcodeCanvas = document.createElement("canvas")
        JsBarcode(barcodeCanvas, patientRefNoNumber, {
          format: "CODE128", lineColor: "#000",
          width: 1.5, height: 10, displayValue: false, margin: 0,
        })
        barcodeImage = barcodeCanvas.toDataURL("image/png")
      }

      // Document dimensions
      const leftMargin        = 10
      const rightMargin       = leftMargin + 190
      const contentWidth      = rightMargin - leftMargin
      const headerHeight      = 30
      const footerHeight      = 20
      const contentYStart     = headerHeight + 20
      const signatureHeight   = 35
      const tableHeaderHeight = 10

      const colWidths = [
        contentWidth * 0.28,
        contentWidth * 0.12,
        contentWidth * 0.05,
        contentWidth * 0.13,
        contentWidth * 0.1,
        contentWidth * 0.17,
        contentWidth * 0.15,
      ]

      // Patient info panels
      const leftDetails = [
        { label: "Patient ID",  value: patientDetails.patient_id  || "N/A" },
        { label: "Name",        value: patientDetails.patientname  || "No name provided" },
        { label: "Age/Gender",  value: `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}` },
        { label: "Referral",    value: patientDetails.refby        || "SELF" },
        { label: "Branch",      value: patientDetails.branch       || franchiseId },
      ]

      const rightDetails = [
        {
          label: "Collected On",
          value: format(new Date(patientDetails.testdetails[0].samplecollected_time), "dd MMM yy / HH:mm"),
        },
        {
          label: "Received On",
          value: format(new Date(patientDetails.testdetails[0].received_time), "dd MMM yy / HH:mm"),
        },
        ...(patientDetails.testdetails[0].dispatch_time &&
          patientDetails.testdetails[0].dispatch_time !== "null" ? [{
          label: "Released On",
          value: format(new Date(patientDetails.testdetails[0].dispatch_time), "dd MMM yy / HH:mm"),
        }] : []),
        { label: "Reported Date",  value: format(new Date(), "dd MMM yy / HH:mm") },
        { label: "Patient Ref.No", value: patientRefNoNumber },
      ]

      // Helpers
      const calculateMaxLabelWidth = (details) => {
        const tempDoc = new jsPDF()
        tempDoc.setFontSize(10)
        return Math.max(...details.map((item) => tempDoc.getTextWidth(item.label)))
      }

      const wrapTextAndGetLines = (doc, text, maxWidth) => {
        if (!text) return []
        return doc.splitTextToSize(String(text), maxWidth)
      }

      const renderWrappedText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0
        const lines = wrapTextAndGetLines(doc, text, maxWidth)
        lines.forEach((line, index) => doc.text(line, startX, yPos + index * lineHeight))
        return lines.length * lineHeight
      }

      const doc       = new jsPDF()
      let pageCount   = 1
      let isTableStarted = false

      // Header / Footer
      const addHeaderFooter = () => {
        if (withLetterpad) {
          doc.addImage(headerImage, "PNG", 0, 10, doc.internal.pageSize.width, headerHeight)
          const footerY = doc.internal.pageSize.height - footerHeight
          doc.addImage(FooterImage, "PNG", 0, footerY, doc.internal.pageSize.width, footerHeight)
        } else {
          doc.setFontSize(8)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(255, 255, 255)
          doc.text("Header Space", leftMargin, 10)
          doc.setTextColor(0, 0, 0)

          const ph        = doc.internal.pageSize.height
          const footerLineY = ph - footerHeight + 4
          doc.setDrawColor(180, 180, 180)
          doc.setLineWidth(0.3)
          doc.line(leftMargin, footerLineY - 3, rightMargin, footerLineY - 3)
          doc.setDrawColor(0, 0, 0)
          doc.setLineWidth(0.2)
          doc.setFont("helvetica", "bold")
          doc.setFontSize(9)
          doc.text("Sample Processed at Shanmuga Hospital", leftMargin, footerLineY + 2)
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
        }
      }

      // Patient info block
      const addPatientInfo = (yPos) => {
        const leftMaxLabelWidth  = calculateMaxLabelWidth(leftDetails)
        const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails)
        const halfWidth          = contentWidth / 2

        const leftLabelX = leftMargin
        const leftColonX = leftLabelX + leftMaxLabelWidth + 2
        const leftValueX = leftColonX + 5

        const rightSectionWidth = rightMaxLabelWidth + 35
        const rightLabelX = rightMargin - rightSectionWidth
        const rightColonX = rightLabelX + rightMaxLabelWidth + 2
        const rightValueX = rightColonX + 5

        doc.setFontSize(10)
        let patientInfoY = yPos
        const maxLength  = Math.max(leftDetails.length, rightDetails.length)

        for (let i = 0; i < maxLength; i++) {
          const left  = leftDetails[i]
          const right = rightDetails[i]
          let leftRowHeight = 5

          if (left) {
            doc.setFont("helvetica", "bold")
            doc.text(left.label, leftLabelX, patientInfoY)
            doc.text(":", leftColonX, patientInfoY)
            doc.setFont("helvetica", "normal")
            const maxLeftValueWidth = halfWidth - (leftValueX - leftMargin) - 2
            const leftValueLines    = wrapTextAndGetLines(doc, left.value, maxLeftValueWidth)
            leftValueLines.forEach((line, li) => doc.text(line, leftValueX, patientInfoY + li * 4))
            leftRowHeight = Math.max(leftValueLines.length * 4, 5)
          }

          if (right) {
            doc.setFont("helvetica", "bold")
            doc.text(right.label, rightLabelX, patientInfoY)
            doc.text(":", rightColonX, patientInfoY)
            doc.setFont("helvetica", "normal")
            doc.text(right.value, rightValueX, patientInfoY)

            if (right.label === "Patient Ref.No" && patientRefNoNumber !== "N/A" && barcodeImage) {
              doc.addImage(barcodeImage, "PNG", rightValueX, patientInfoY + 3, 28, 10)
            }
          }

          patientInfoY += Math.max(leftRowHeight, 5)
        }

        return patientInfoY
      }

      // Unicode renderer
      const renderUnicodeText = (text, x, y, options = {}) => {
        const processed = processUnicodeText(text)
        if (processed.includes("µ")) {
          const parts = processed.split("µ")
          let currentX = x
          parts.forEach((part, index) => {
            if (index > 0) {
              doc.setFont("helvetica", options.fontStyle || "normal")
              doc.text("µ", currentX, y)
              currentX += doc.getTextWidth("µ")
            }
            if (part) {
              doc.text(part, currentX, y)
              currentX += doc.getTextWidth(part)
            }
          })
        } else {
          doc.text(processed, x, y)
        }
      }

      // Table header
      const drawTableHeader = (yPos) => {
        doc.line(leftMargin, yPos, rightMargin, yPos)
        yPos += 5
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        const headers = ["Test", "Specimen", "", "Result", "Units", "Reference Value", "Method"]
        let xPos = leftMargin
        headers.forEach((header, index) => {
          if (header) doc.text(header, xPos, yPos)
          xPos += colWidths[index]
        })
        yPos += 3
        doc.line(leftMargin, yPos, rightMargin, yPos)
        yPos += 5
        return yPos
      }

      // Signatures
      const addSignatures = () => {
        const ph         = doc.internal.pageSize.height
        const signaturesY  = ph - footerHeight - signatureHeight - 2
        const signatureWidth = 35

        if (activeConsultants.length === 0) return

        const signatureSpacing = 60
        const startX = rightMargin - (activeConsultants.length * signatureSpacing)

        activeConsultants.forEach((consultant, index) => {
          const xPosition = startX + index * signatureSpacing
          if (consultant[2]) {
            doc.addImage(consultant[2], "PNG", xPosition, signaturesY, signatureWidth, 15)
          }
          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          doc.text(consultant[0], xPosition, signaturesY + 20)
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
          doc.text(consultant[1], xPosition, signaturesY + 25)
        })
      }

      // Page break check
      const checkForNewPage = (yPos, estimatedHeight) => {
        const ph          = doc.internal.pageSize.height
        const footerStart = ph - (footerHeight + signatureHeight + 5)

        if (yPos + estimatedHeight >= footerStart) {
          addSignatures()
          doc.addPage()
          pageCount++
          addHeaderFooter()
          let newYPos = contentYStart
          newYPos = addPatientInfo(newYPos)
          newYPos += 10
          if (isTableStarted) newYPos = drawTableHeader(newYPos)
          return newYPos
        }
        return yPos
      }

      // High / Low status
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null
        const numValue = parseFloat(value)
        if (isNaN(numValue)) return null
        if (reference.includes("-")) {
          const [min, max] = reference.split("-").map((v) => parseFloat(v))
          if (!isNaN(min) && !isNaN(max)) {
            if (numValue < min) return "L"
            if (numValue > max) return "H"
          }
        } else if (reference.includes("<")) {
          const max = parseFloat(reference.replace("<", ""))
          if (!isNaN(max) && numValue > max) return "H"
        } else if (reference.includes(">")) {
          const min = parseFloat(reference.replace(">", ""))
          if (!isNaN(min) && numValue < min) return "L"
        }
        return null
      }

      // Arrow symbol
      const drawArrowSymbol = (doc, x, y, direction) => {
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        if (direction === "up") {
          doc.line(x, y, x + 1, y - 1)
          doc.line(x + 1, y - 1, x + 2, y)
          doc.line(x + 1, y - 1, x + 1, y + 2)
        } else {
          doc.line(x, y, x + 1, y + 1)
          doc.line(x + 1, y + 1, x + 2, y)
          doc.line(x + 1, y + 1, x + 1, y - 2)
        }
      }

      // ── START PDF GENERATION ────────────────────────────────────────────────
      addHeaderFooter()
      let currentYPosition = addPatientInfo(contentYStart)
      currentYPosition += 10

      if (patientDetails.testdetails.length) {
        isTableStarted = true
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight)
        let yPos = drawTableHeader(currentYPosition)

        const testsByDepartment = patientDetails.testdetails.reduce((acc, test) => {
          ;(acc[test.department] = acc[test.department] || []).push(test)
          return acc
        }, {})

        const sortedDepartments = Object.keys(testsByDepartment).sort((a, b) => {
          const indexA = departmentOrder.indexOf(a)
          const indexB = departmentOrder.indexOf(b)
          if (indexA !== -1 && indexB !== -1) return indexA - indexB
          if (indexA !== -1) return -1
          if (indexB !== -1) return 1
          return a.localeCompare(b)
        })

        sortedDepartments.forEach((department) => {
          const verifiedBySet = new Set()
          testsByDepartment[department].forEach((test) => {
            if (test.verified_by && test.verified_by.trim() !== "") verifiedBySet.add(test.verified_by)
          })
          const hasMultipleVerifiers = verifiedBySet.size > 1

          testsByDepartment[department].forEach((test, testIndex) => {
            if (testIndex === 0) {
              yPos = checkForNewPage(yPos, 15)
              doc.setFont("helvetica", "bold")
              doc.setFontSize(10)
              const textWidth = doc.getTextWidth(department.toUpperCase())
              const centerX   = leftMargin + contentWidth / 2
              doc.text(department.toUpperCase(), centerX, yPos, { align: "center" })
              doc.line(centerX - textWidth / 2, yPos + 2, centerX + textWidth / 2, yPos + 2)
              yPos += 10
            }

            const parametersBySubtitle = {}
            if (test.parameters && test.parameters.length > 0) {
              test.parameters.forEach((param) => {
                const subtitle = param.sub_title || ""
                if (!parametersBySubtitle[subtitle]) parametersBySubtitle[subtitle] = []
                parametersBySubtitle[subtitle].push(param)
              })
            }

            yPos = checkForNewPage(yPos, 20)
            doc.setFontSize(10)

            const testNameLines  = wrapTextAndGetLines(doc, test.testname, colWidths[0] - 2)
            const valueText      = test.value || ""
            const valueLines     = wrapTextAndGetLines(doc, valueText, colWidths[3] - 2)
            const referenceLines = wrapTextAndGetLines(doc, test.reference_range || "", colWidths[5] - 2)
            const methodText     = (test.method || "").replace(/\bMethod\b/i, "").trim()
            const methodLines    = wrapTextAndGetLines(doc, methodText, colWidths[6] - 2)

            const maxLines        = Math.max(testNameLines.length, valueLines.length, referenceLines.length, methodLines.length)
            const lineHeight      = 4
            const actualRowHeight = maxLines * lineHeight + 2

            yPos = checkForNewPage(yPos, actualRowHeight)

            let xPos = leftMargin
            doc.setFont("helvetica", "bold")
            renderWrappedText(doc, test.testname, colWidths[0] - 2, xPos, yPos, lineHeight)
            xPos += colWidths[0]

            doc.setFont("helvetica", "normal")
            doc.text(test.specimen_type || "", xPos, yPos)
            xPos += colWidths[1]
            xPos += colWidths[2]

            const statusIndicator = test.isHigh ? "H" : test.isLow ? "L" : getHighLowStatus(valueText, test.reference_range)
            if (statusIndicator) {
              doc.setFont("helvetica", "bold")
              doc.setTextColor(statusIndicator === "H" ? 255 : 0, 0, statusIndicator === "L" ? 255 : 0)
              renderWrappedText(doc, valueText, colWidths[3] - 5, xPos, yPos, lineHeight)
              const valueWidth = doc.getTextWidth(valueText)
              if (valueWidth < colWidths[3] - 5) {
                drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, statusIndicator === "H" ? "up" : "down")
              }
              doc.setTextColor(0, 0, 0)
              doc.setFont("helvetica", "normal")
            } else {
              renderWrappedText(doc, valueText, colWidths[3] - 2, xPos, yPos, lineHeight)
            }
            xPos += colWidths[3]

            renderUnicodeText(test.unit || "", xPos, yPos)
            xPos += colWidths[4]

            renderWrappedText(doc, test.reference_range || "", colWidths[5] - 2, xPos, yPos, lineHeight)
            xPos += colWidths[5]

            doc.setTextColor(0, 0, 0)
            renderWrappedText(doc, methodText, colWidths[6] - 2, xPos, yPos, lineHeight)

            yPos += actualRowHeight + 4
            doc.setFont("helvetica", "normal")
            doc.setTextColor(0, 0, 0)

            if (test.outsourced === true) {
              doc.setFont("helvetica", "italic")
              doc.setFontSize(8)
              doc.text("(Outsourced)", leftMargin, yPos)
              yPos += 4
            }

            if ((!test.parameters || test.parameters.length === 0) && test.comment && test.comment.trim() !== "") {
              doc.setFont("helvetica", "italic")
              doc.setFontSize(8)
              const commentHeight = renderWrappedText(
                doc, `Note: ${test.comment}`,
                colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
                leftMargin, yPos, 3.5
              )
              yPos += commentHeight + 2
            }

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)

            Object.keys(parametersBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                yPos = checkForNewPage(yPos, 25)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(9)
                doc.text(subtitle, leftMargin, yPos)
                yPos += 6
              }

              parametersBySubtitle[subtitle].forEach((currentTest) => {
                doc.setFontSize(10)

                const paramNameLines   = wrapTextAndGetLines(doc, currentTest.name, colWidths[0] - 2)
                const paramValueText   = currentTest.value || ""
                const paramValueLines  = wrapTextAndGetLines(doc, paramValueText, colWidths[3] - 2)
                const paramRefLines    = wrapTextAndGetLines(doc, currentTest.reference_range || "", colWidths[5] - 2)
                const paramMethodText  = (currentTest.method || "").replace(/\bMethod\b/i, "").trim()
                const paramMethodLines = wrapTextAndGetLines(doc, paramMethodText, colWidths[6] - 2)

                const paramMaxLines       = Math.max(paramNameLines.length, paramValueLines.length, paramRefLines.length, paramMethodLines.length)
                const paramLineHeight     = 4
                const paramActualRowHeight = paramMaxLines * paramLineHeight + 2

                yPos = checkForNewPage(yPos, paramActualRowHeight)

                let xPos = leftMargin
                doc.setFont("helvetica", "normal")
                renderWrappedText(doc, currentTest.name, colWidths[0] - 2, xPos, yPos, paramLineHeight)
                xPos += colWidths[0]

                doc.text(currentTest.specimen_type || "", xPos, yPos)
                xPos += colWidths[1]
                xPos += colWidths[2]

                const paramStatus = currentTest.isHigh ? "H" : currentTest.isLow ? "L" : getHighLowStatus(paramValueText, currentTest.reference_range)
                if (paramStatus) {
                  doc.setFont("helvetica", "bold")
                  doc.setTextColor(paramStatus === "H" ? 255 : 0, 0, paramStatus === "L" ? 255 : 0)
                  renderWrappedText(doc, paramValueText, colWidths[3] - 5, xPos, yPos, paramLineHeight)
                  const paramValueWidth = doc.getTextWidth(paramValueText)
                  if (paramValueWidth < colWidths[3] - 5) {
                    drawArrowSymbol(doc, xPos + paramValueWidth + 2, yPos - 1, paramStatus === "H" ? "up" : "down")
                  }
                  doc.setTextColor(0, 0, 0)
                  doc.setFont("helvetica", "normal")
                } else {
                  renderWrappedText(doc, paramValueText, colWidths[3] - 2, xPos, yPos, paramLineHeight)
                }
                xPos += colWidths[3]

                renderUnicodeText(currentTest.unit || "", xPos, yPos)
                xPos += colWidths[4]

                renderWrappedText(doc, currentTest.reference_range || "", colWidths[5] - 2, xPos, yPos, paramLineHeight)
                xPos += colWidths[5]

                doc.setTextColor(0, 0, 0)
                renderWrappedText(doc, paramMethodText, colWidths[6] - 2, xPos, yPos, paramLineHeight)

                yPos += paramActualRowHeight

                if (currentTest.comment && currentTest.comment.trim() !== "") {
                  doc.setFont("helvetica", "italic")
                  doc.setFontSize(8)
                  const paramCommentHeight = renderWrappedText(
                    doc, `Note: ${currentTest.comment}`,
                    colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
                    leftMargin, yPos, 3.5
                  )
                  yPos += paramCommentHeight + 2
                }

                doc.setFont("helvetica", "normal")
                doc.setFontSize(10)
                doc.setTextColor(0, 0, 0)
              })
            })

            if (hasMultipleVerifiers && test.verified_by && test.verified_by.trim() !== "") {
              doc.setFont("helvetica", "normal")
              doc.setFontSize(10)
              doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos)
              yPos += 8
            }
          })

          if (!hasMultipleVerifiers && verifiedBySet.size > 0) {
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text(`Verified by: ${Array.from(verifiedBySet).join(", ")}`, leftMargin, yPos)
            yPos += 8
          }

          yPos += 4
        })

        currentYPosition = yPos
      }

      isTableStarted = false

      const ph          = doc.internal.pageSize.height
      const footerStart = ph - (footerHeight + signatureHeight + 15)
      if (currentYPosition + 10 >= footerStart) {
        addSignatures()
        doc.addPage()
        pageCount++
        addHeaderFooter()
        currentYPosition = addPatientInfo(contentYStart)
      }

      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("**End of the Report**", leftMargin + contentWidth / 2, currentYPosition, { align: "center" })

      addSignatures()

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.text(
          `Page ${i} of ${pageCount}`,
          leftMargin + contentWidth / 2,
          doc.internal.pageSize.height - footerHeight - 2,
          { align: "center" }
        )
      }

      const pdfBlob = doc.output("blob")
      window.open(URL.createObjectURL(pdfBlob), "_blank")
      setLoading(false)
      return pdfBlob

    } catch (error) {
      console.error("Error while generating the PDF:", error)
      setLoading(false)
      return null
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <Container>
      <Header>
        <Title>Patient Report Table</Title>
        <Subtitle>Comprehensive patient information in tabular format</Subtitle>
      </Header>

      <ControlsRow>
        {/* Date pickers */}
        <DateLabel htmlFor="fromDate">From:</DateLabel>
        <DateInput
          id="fromDate"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <DateLabel htmlFor="toDate">To:</DateLabel>
        <DateInput
          id="toDate"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <Divider />

        {/* Search */}
        <SearchWrapper>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name, patient ID or barcode…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ClearButton onClick={() => setSearchQuery("")} title="Clear search">✕</ClearButton>
          )}
        </SearchWrapper>

        {/* Result count — only when a query is active */}
        {searchQuery && (
          <ResultCount>
            {filteredPatients.length} of {patients.length} result{patients.length !== 1 ? "s" : ""}
          </ResultCount>
        )}
      </ControlsRow>

      {loading ? (
        <LoadingSpinner />
      ) : filteredPatients.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateTitle>
            {searchQuery ? "No Matching Results" : "No Patients Found"}
          </EmptyStateTitle>
          <EmptyStateText>
            {searchQuery
              ? `No patients match "${searchQuery}". Try a different name, ID, or barcode.`
              : "No patient reports available for the selected dates. Please try a different date range."}
          </EmptyStateText>
        </EmptyState>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Patient Name</TableHeaderCell>
                <TableHeaderCell>Patient ID</TableHeaderCell>
                <TableHeaderCell>Barcode</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <PatientName>
                      <HighlightedText text={item.patientname} query={searchQuery} />
                    </PatientName>
                  </TableCell>
                  <TableCell>
                    <HighlightedText text={item.patient_id} query={searchQuery} />
                  </TableCell>
                  <TableCell>
                    <BarcodeText>
                      <HighlightedText text={item.barcode} query={searchQuery} />
                    </BarcodeText>
                  </TableCell>
                  <TableCell>
                    <ActionContainer>
                      <PrintButton
                        variant="letterpad"
                        onClick={() => handlePrint(item, true)}
                        title="Print with letterpad"
                        disabled={loading}
                      >
                        <PrintIcon>🖨️</PrintIcon>
                        With Letterpad
                      </PrintButton>
                      <PrintButton
                        variant="normal"
                        onClick={() => handlePrint(item, false)}
                        title="Print without letterpad"
                        disabled={loading}
                      >
                        <PrintIcon>📄</PrintIcon>
                        Without Letterpad
                      </PrintButton>
                    </ActionContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default PatientReportTable