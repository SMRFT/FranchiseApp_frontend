"use client"

import { useState, useEffect, useMemo } from "react"
import styled, { keyframes } from "styled-components"
import jsPDF from "jspdf"
import JsBarcode from "jsbarcode"
import { format } from "date-fns"
import axios from "axios"
import headerImage from "./images/Header.png";
import FooterImage from "./images/Footer.png";
import Rajesh from "./images/Rajesh.png";
import { FileCheck, Users, Calendar, Search, RefreshCw, Printer, FileText, Barcode } from "lucide-react";

const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  background-color: #f8fafc;
  box-sizing: border-box;

  @media (max-width: 900px) {
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;

const TopSection = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const TitleGroup = styled.div`
  h1 {
    font-size: 1.3rem;
    color: #0f172a;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.02em;
  }
  p {
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 500;
    margin: 2px 0 0 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;

  .stat-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #64748b;
    margin-bottom: 2px;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${props => props.valueColor || '#0f172a'};
    letter-spacing: -0.02em;
    line-height: 1.2;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.iconBg || '#f1f5f9'};
    color: ${props => props.iconColor || '#475569'};
  }
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const SearchWrapper = styled.div`
  position: relative;
  min-width: 240px;
  flex: 1;
  max-width: 380px;

  input {
    width: 100%;
    padding: 6px 10px 6px 30px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.82rem;
    color: #1e293b;
    background: white;
    outline: none;
    font-family: inherit;

    &:focus {
      border-color: #4B9EB0;
    }
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }
`;

const DateControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;

  .date-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #64748b;
  }

  input[type="date"] {
    padding: 5px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 0.8rem;
    color: #1e293b;
    outline: none;
    background: white;
    font-family: inherit;

    &:focus {
      border-color: #4B9EB0;
    }
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.78rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
  border: 1px solid transparent;

  ${props => props.variant === 'primary' && `
    background: #4B9EB0;
    color: white;
    border-color: #4B9EB0;
    &:hover { background: #3c8697; }
  `}

  ${props => props.variant === 'outline' && `
    background: white;
    border-color: #cbd5e1;
    color: #334155;
    &:hover { background: #f8fafc; border-color: #94a3b8; }
  `}

  ${props => props.variant === 'secondary' && `
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #334155;
    &:hover { background: #e2e8f0; }
  `}
`;

const TableCard = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
  min-width: 800px;

  th {
    position: sticky;
    top: 0;
    z-index: 5;
    background: #f8fafc;
    padding: 9px 12px;
    font-weight: 700;
    color: #475569;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  td {
    padding: 9px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
    white-space: nowrap;
  }

  tr:hover td {
    background-color: #f8fafc;
  }
`;

const BarcodeChip = styled.span`
  font-family: monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  border: 1px solid #e2e8f0;
`;

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
      <TopSection>
        <Header>
          <TitleGroup>
            <h1><FileCheck size={22} color="#4B9EB0" /> Patient Report Directory</h1>
            <p>Generate, preview, and print verified diagnostic patient test reports</p>
          </TitleGroup>

          <HeaderActions>
            <Button variant="secondary" onClick={fetchPatients} title="Refresh records">
              <RefreshCw size={13} /> Refresh
            </Button>
          </HeaderActions>
        </Header>

        {/* Stat Cards */}
        <StatsGrid>
          <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
            <div className="stat-info">
              <div className="stat-label">Verified Reports</div>
              <div className="stat-value">{filteredPatients.length}</div>
            </div>
            <div className="stat-icon"><FileCheck size={17} /></div>
          </StatCard>

          <StatCard iconBg="#fef3c7" iconColor="#b45309" valueColor="#b45309">
            <div className="stat-info">
              <div className="stat-label">Date Filter</div>
              <div className="stat-value" style={{ fontSize: '0.95rem' }}>{fromDate}</div>
            </div>
            <div className="stat-icon"><Calendar size={17} /></div>
          </StatCard>

          <StatCard iconBg="#dcfce7" iconColor="#15803d" valueColor="#15803d">
            <div className="stat-info">
              <div className="stat-label">Franchise Station</div>
              <div className="stat-value">{franchiseId}</div>
            </div>
            <div className="stat-icon"><Users size={17} /></div>
          </StatCard>
        </StatsGrid>

        {/* Filter Section */}
        <FilterSection>
          <SearchWrapper>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Patient Name, ID, Barcode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <DateControls>
            <span className="date-label">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />

            <span className="date-label">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />

            <Button variant="primary" onClick={fetchPatients} disabled={loading}>
              Search
            </Button>
          </DateControls>
        </FilterSection>
      </TopSection>

      {/* Main Table Card */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
            <div>Loading verified reports...</div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <FileCheck size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
              No Patient Reports Found
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              No verified laboratory reports found for the selected date range.
            </div>
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient Name</th>
                  <th>Patient ID</th>
                  <th>Barcode</th>
                  <th style={{ textAlign: 'center', width: '230px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        <HighlightedText text={item.patientname} query={searchQuery} />
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#475569' }}>
                        #{item.patient_id}
                      </span>
                    </td>
                    <td>
                      <BarcodeChip>
                        <HighlightedText text={item.barcode} query={searchQuery} />
                      </BarcodeChip>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <Button
                          variant="primary"
                          onClick={() => handlePrint(item, true)}
                          title="Print report with Letterpad header"
                          disabled={loading}
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          <Printer size={12} /> Letterpad
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePrint(item, false)}
                          title="Print report on plain paper"
                          disabled={loading}
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          <FileText size={12} /> Plain
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </TableCard>
    </Container>
  );
}

export default PatientReportTable;