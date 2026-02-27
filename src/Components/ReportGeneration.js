"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import jsPDF from "jspdf"
import JsBarcode from "jsbarcode"
import { format } from "date-fns"
import axios from "axios"
import headerImage from "./images/Header.png";
import FooterImage from "./images/Footer.png";
import Vijayan from "./images/Vijayan.png";

// Base URL - you'll need to set this to your actual API base URL
const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

// Styled Components (keeping exactly the same)
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

const DatePickerContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
`

const DateLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 16px;
`

const DateInput = styled.input`
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
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
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
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
    background-color: #f8f9fa;
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

const StatusBadge = styled.span`
  background: ${(props) => {
    switch (props.status) {
      case "completed":
        return "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
      case "pending":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      case "in-progress":
        return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
`

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const PrintButton = styled.button`
  background: ${(props) =>
    props.variant === "letterpad"
      ? "linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */"
      : "linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */"};
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
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`

const EmptyStateTitle = styled.h3`
  font-size: 20px;
  color: #495057;
  margin-bottom: 10px;
`

const EmptyStateText = styled.p`
  color: #6c757d;
  font-size: 16px;
`

const PatientName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`

const PatientId = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-top: 2px;
`

const BarcodeText = styled.div`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #495057;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`

const PatientReportTable = () => {
  const [selectedDate, setSelectedDate] = useState("")
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [franchiseId, setFranchiseId] = useState("")

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Get franchise_id from localStorage on component mount
  useEffect(() => {
    const storedFranchiseId = localStorage.getItem("franchise_id")
    if (storedFranchiseId) {
      setFranchiseId(storedFranchiseId)
    } else {
      setError("Franchise ID not found in localStorage. Please login again.")
    }
  }, [])

  useEffect(() => {
    setSelectedDate(getCurrentDate())
    fetchPatients()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchPatients()
    }
  }, [selectedDate])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8190/_b_a_c_k_e_n_d/franchiseapp/get_test_values/?date=${selectedDate}&franchise_id=${franchiseId}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const result = await response.json()
      // Extract the test data from the nested structure
      const testData = result.test_data?.data || []
      // Add patient_id and barcode to each test item
      const enrichedData = testData.map((item) => ({
        ...item,
        patient_id: result.patient_id,
        barcode: result.barcode,
        patientname: result.patientname,
      }))
      setPatients(enrichedData)
    } catch (error) {
      console.error("Error fetching patients:", error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  // Enhanced handlePrint function with detailed PDF generation
  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true)
      // Fetch detailed patient data using the same API structure
      const response = await axios.get(
        `http://127.0.0.1:8000/get_patient_by_barcode/?date=${selectedDate}&franchise_id=${franchiseId}`,
      )
      const patientDetails = response.data

      // Extract test details from the nested structure
      const testData = patientDetails.test_data?.data?.[0]
      if (!testData || !testData.testdetails || testData.testdetails.length === 0) {
        console.error("No test details found for the patient.")
        setLoading(false)
        return
      }

      // Create a flattened structure that matches what the PDF generation expects
      const flattenedPatientDetails = {
        patient_id: patientDetails.patient_id,
        patientname: patientDetails.patientname,
        barcode: patientDetails.barcode,
        age: testData.age || "N/A",
        gender: testData.gender || "N/A",
        refby: testData.refby || "SELF",
        branch: testData.branch || "N/A",
        testdetails: testData.testdetails.map((test) => ({
          ...test,
          samplecollected_time: testData.date || new Date().toISOString(),
          received_time: testData.date || new Date().toISOString(),
          department: test.department || "GENERAL",
          verified_by: test.verified_by || "Lab Technician",
        })),
      }

      // Enhanced Unicode character mapping for medical units
      const unicodeMap = {
        // Greek letters
        μ: "µ", // Alternative mu symbol that works better in PDF
        α: "α",
        β: "β",
        γ: "γ",
        δ: "δ",
        Ω: "Ω",
        // Superscript numbers
        "²": "²",
        "³": "³",
        "⁴": "⁴",
        // Medical symbols
        "°": "°",
        "±": "±",
        "×": "x",
        "÷": "/",
        // Common Unicode escapes
        "\\u03bc": "µ", // μ
        "\\u00b5": "µ", // µ (micro sign)
        "\\u00b0": "°", // degree
        "\\u00b1": "±", // plus-minus
        "\\u00b2": "²", // superscript 2
        "\\u00b3": "³", // superscript 3
      }

      // Enhanced function to handle Unicode characters in text
      const processUnicodeText = (text) => {
        if (!text) return ""
        let processedText = text
        // Handle Unicode escape sequences first
        processedText = processedText.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          const char = String.fromCharCode(Number.parseInt(hex, 16))
          return unicodeMap[char] || char
        })
        // Handle direct Unicode characters
        Object.keys(unicodeMap).forEach((unicode) => {
          const regex = new RegExp(unicode, "g")
          processedText = processedText.replace(regex, unicodeMap[unicode])
        })
        return processedText
      }

      // Function to extract the number from patient_ref_no
      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A"
        const numberPart = refNo.split("+")[0]
        return numberPart
      }

      // Adding Consultant names and qualifications
      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. VIJAYAN Ph.D.", "Consultant Biochemist", Vijayan],
      ]

      const patientRefNo = flattenedPatientDetails.barcode || "N/A"
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo)

      // Generate Barcode only if patientRefNoNumber is not "N/A"
      let barcodeImage = null
      if (patientRefNoNumber !== "N/A") {
        const barcodeCanvas = document.createElement("canvas")
        JsBarcode(barcodeCanvas, patientRefNoNumber, {
          format: "CODE128",
          lineColor: "#000",
          width: 1.5,
          height: 10,
          displayValue: false,
          margin: 0,
        })
        barcodeImage = barcodeCanvas.toDataURL("image/png")
      }

      // FIXED: Define consistent margins and dimensions regardless of letterpad
      const leftMargin = 10
      const rightMargin = leftMargin + 190 // Total document width is 210, content width is 190
      const contentWidth = rightMargin - leftMargin // Consistent content width (190)

      // FIXED: Consistent header and footer heights regardless of letterpad
      const headerHeight = 30 // Always reserve space for header
      const footerHeight = 20 // Always reserve space for footer
      const contentYStart = headerHeight + 20 // Start content below the header area
      const signatureHeight = 25 // Height needed for signatures
      const disclaimerHeight = 0 // No disclaimer needed
      const tableHeaderHeight = 10 // Height needed for table header

      // Column widths adjusted to fit within content margins
      const colWidths = [
        contentWidth * 0.28, // Test Description
        contentWidth * 0.12, // Specimen Type
        contentWidth * 0.05, // Extra Gap (Added)
        contentWidth * 0.13, // Value(s)
        contentWidth * 0.1, // Unit
        contentWidth * 0.17, // Reference Range
        contentWidth * 0.15, // Method (Moved to last)
      ]

      // Patient information (left and right sides)
      const leftDetails = [
        { label: "Reg.ID", value: flattenedPatientDetails.patient_id || "N/A" },
        {
          label: "Name",
          value: flattenedPatientDetails.patientname || "No name provided",
        },
        {
          label: "Age/Gender",
          value: `${flattenedPatientDetails.age || "N/A"} / ${flattenedPatientDetails.gender || "N/A"}`,
        },
        { label: "Referral", value: flattenedPatientDetails.refby || "SELF" },
        { label: "Branch", value: flattenedPatientDetails.branch || "N/A" },
      ]

      const rightDetails = [
        {
          label: "Collected On",
          value:
            format(new Date(flattenedPatientDetails.testdetails[0].samplecollected_time), "dd MMM yy / HH:mm") || "N/A",
        },
        {
          label: "Received On",
          value: format(new Date(flattenedPatientDetails.testdetails[0].received_time), "dd MMM yy / HH:mm") || "N/A",
        },
        {
          label: "Reported Date",
          value: format(new Date(), "dd MMM yy / hh:mm"),
        },
        { label: "Patient Ref.No", value: patientRefNoNumber },
      ]

      // Function to calculate max width for alignment
      const calculateMaxLabelWidth = (details) => {
        const tempDoc = new jsPDF()
        return Math.max(...details.map((item) => tempDoc.getTextWidth(item.label)))
      }

      // Create the actual document
      const doc = new jsPDF()
      let pageCount = 1
      let isTableStarted = false // Track if we're in the table section

      // FIXED: Function to add header and footer with consistent positioning
      const addHeaderFooter = () => {
        if (withLetterpad) {
          // Position header at the very top of the page with no left margin
          doc.addImage(headerImage, "PNG", 0, 5, doc.internal.pageSize.width, headerHeight)
          // Position footer at the very bottom of the page with no left margin
          const footerY = doc.internal.pageSize.height - footerHeight
          doc.addImage(FooterImage, "PNG", 0, footerY, doc.internal.pageSize.width, footerHeight)
        } else {
          // For non-letterpad version, add a simple header placeholder to maintain consistent spacing
          doc.setFontSize(8)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(255, 255, 255) // White text (invisible)
          doc.text("Header Space", leftMargin, 10)
          doc.setTextColor(0, 0, 0) // Reset to black
        }
      }

      // Enhanced text rendering function with Unicode support
      const renderUnicodeText = (text, x, y, options = {}) => {
        const processedText = processUnicodeText(text)
        // Handle special cases for common medical units
        if (processedText.includes("µ")) {
          // Split text around µ symbol and render parts separately
          const parts = processedText.split("µ")
          let currentX = x
          parts.forEach((part, index) => {
            if (index > 0) {
              // Render µ symbol
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
          // Normal text rendering
          doc.text(processedText, x, y)
        }
      }

      // Function to draw table header
      const drawTableHeader = (yPos) => {
        // Draw Top Line - Use leftMargin and rightMargin for consistency
        doc.line(leftMargin, yPos, rightMargin, yPos)
        yPos += 5
        // Table Header
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        // Updated headers array to match colWidths
        const headers = ["Test", "Specimen", "", "Result", "Units", "Reference Value", "Method"]
        let xPos = leftMargin
        headers.forEach((header, index) => {
          if (header) {
            // Avoid printing the extra gap column header
            doc.text(header, xPos, yPos)
          }
          xPos += colWidths[index] // Move to the next column
        })
        yPos += 3
        // Draw Bottom Line - Use leftMargin and rightMargin for consistency
        doc.line(leftMargin, yPos, rightMargin, yPos)
        yPos += 5
        return yPos
      }

      // UPDATED: Function to wrap text and return height with improved line height
      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0
        const splitText = doc.splitTextToSize(text, maxWidth)
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight)
        })
        return splitText.length * lineHeight
      }

      // FIXED: Function to add signatures with consistent positioning
      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height
        // Calculate signature position with more space from footer
        const signaturesY = pageHeight - footerHeight - signatureHeight - 10 // Added extra 10 units for more space
        // REDUCED signature width from 40 to 30
        const signatureWidth = 35
        const availableWidth = contentWidth - (signatureWidth / 2) * 2 // Space between left and right most signatures
        const signatureSpacing = availableWidth / (consultants.length - 1) // Space between each signature
        consultants.forEach((consultant, index) => {
          // Calculate position based on leftMargin to ensure consistency
          const xPosition = leftMargin + index * signatureSpacing
          // Add Signature (if available) with reduced width
          if (consultant[2]) {
            doc.addImage(
              consultant[2],
              "PNG",
              xPosition,
              signaturesY,
              signatureWidth, // Reduced from 40 to 30
              15, //Space between signature and name
            )
          }
          // Print name below the signature with REDUCED spacing
          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          doc.text(consultant[0], xPosition, signaturesY + 15) // Space for name below signature
          // Print qualification below the name with REDUCED spacing
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
          doc.text(consultant[1], xPosition, signaturesY + 20) // space for qualification below name
        })
        // Removed disclaimer - no longer needed
      }

      // FIXED: Function to check if we need to add a new page with consistent calculations
      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height
        // Use consistent footer space calculation for both versions
        const footerStart = pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12) // Added extra space
        // If content is approaching footer, move to a new page
        if (yPos + estimatedHeight >= footerStart) {
          // Add signatures to current page before creating new page
          addSignatures()
          doc.addPage()
          pageCount++
          addHeaderFooter() // Add header/footer
          let newYPos = contentYStart
          // If we're in the table section, add table header on new page
          if (isTableStarted) {
            newYPos = drawTableHeader(newYPos)
          }
          return newYPos // Reset Y position for new page
        }
        return yPos
      }

      // Function to determine whether a value is high or low compared to reference range
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null
        // Convert value to number if possible
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) return null
        // Handle different reference range formats
        if (reference.includes("-")) {
          const [min, max] = reference.split("-").map((v) => Number.parseFloat(v))
          if (!isNaN(min) && !isNaN(max)) {
            if (numValue < min) return "L"
            if (numValue > max) return "H"
          }
        } else if (reference.includes("<")) {
          const max = Number.parseFloat(reference.replace("<", ""))
          if (!isNaN(max) && numValue > max) return "H"
        } else if (reference.includes(">")) {
          const min = Number.parseFloat(reference.replace(">", ""))
          if (!isNaN(min) && numValue < min) return "L"
        }
        return null
      }

      // Function to draw arrow symbols using lines (compatible with all PDF fonts)
      const drawArrowSymbol = (doc, x, y, direction) => {
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        if (direction === "up") {
          // Draw up arrow using lines
          doc.line(x, y, x + 1, y - 1) // Left diagonal
          doc.line(x + 1, y - 1, x + 2, y) // Right diagonal
          doc.line(x + 1, y - 1, x + 1, y + 2) // Vertical line
        } else if (direction === "down") {
          // Draw down arrow using lines
          doc.line(x, y, x + 1, y + 1) // Left diagonal
          doc.line(x + 1, y + 1, x + 2, y) // Right diagonal
          doc.line(x + 1, y + 1, x + 1, y - 2) // Vertical line
        }
      }

      // Start generating the actual PDF
      addHeaderFooter()
      // FIXED: Use consistent starting position for both versions
      let currentYPosition = contentYStart

      // Better alignment for patient details
      const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails)
      const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails)

      // Calculate positions for patient details aligned with the margins
      const centerPoint = (leftMargin + rightMargin) / 2
      // Left side details positioning
      const leftLabelX = leftMargin
      const leftColonX = leftLabelX + leftMaxLabelWidth + 2
      const leftValueX = leftColonX + 3
      // Right side details positioning
      const rightLabelX = centerPoint + 28
      const rightColonX = rightLabelX + rightMaxLabelWidth + 2
      const rightValueX = rightColonX + 1

      // Uniform font size for patient details
      doc.setFontSize(10)
      for (let i = 0; i < leftDetails.length; i++) {
        const left = leftDetails[i]
        const right = rightDetails[i]
        // Left Side
        doc.setFont("helvetica", "bold")
        doc.text(left.label, leftLabelX, currentYPosition)
        doc.text(":", leftColonX, currentYPosition)
        doc.setFont("helvetica", "bold")
        doc.text(left.value, leftValueX, currentYPosition)
        if (right) {
          // Right Side
          doc.setFont("helvetica", "bold")
          doc.text(right.label, rightLabelX, currentYPosition)
          doc.text(":", rightColonX, currentYPosition)
          doc.setFont("helvetica", "normal")
          doc.text(right.value, rightValueX, currentYPosition)
          // Only add barcode if there's a valid reference number
          if (right.label === "Patient Ref.No" && patientRefNoNumber !== "N/A" && barcodeImage) {
            doc.addImage(
              barcodeImage,
              "PNG",
              rightValueX + doc.getTextWidth(right.value) - 10,
              currentYPosition + 2,
              25,
              8,
            )
          }
        }
        currentYPosition += 5 // Reduced spacing between rows
      }
      currentYPosition += 5 // Extra space after patient details

      // Test rendering logic with better page break handling and consistent alignment
      if (flattenedPatientDetails.testdetails.length) {
        // Mark that we're starting the table section
        isTableStarted = true
        // Check if we need a new page for the table header
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight)
        let yPos = currentYPosition
        // Draw initial table header
        yPos = drawTableHeader(yPos)

        // Group Tests by Department
        const testsByDepartment = flattenedPatientDetails.testdetails.reduce((acc, test) => {
          ; (acc[test.department] = acc[test.department] || []).push(test)
          return acc
        }, {})

        Object.keys(testsByDepartment).forEach((department) => {
          // Check if we need a new page for the department
          const departmentHeight = 15 // Height for department header
          yPos = checkForNewPage(yPos, departmentHeight)
          // Department Title with Underline - Center within content margins
          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          const textWidth = doc.getTextWidth(department.toUpperCase())
          // Center within content margins
          const centerX = leftMargin + contentWidth / 2
          doc.text(department.toUpperCase(), centerX, yPos, {
            align: "center",
          })
          doc.line(centerX - textWidth / 2, yPos + 2, centerX + textWidth / 2, yPos + 2)
          yPos += 10

          // Render each test and its parameters
          testsByDepartment[department].forEach((test) => {
            // Check if parameters exist
            const testsToRender = test.parameters && test.parameters.length > 0 ? [test, ...test.parameters] : [test]
            testsToRender.forEach((currentTest, index) => {
              // UPDATED: Increased estimated height for better text wrapping display
              const estimatedHeight = 18 // Increased from 15 to 18
              // Check if we need a new page with better height estimation
              yPos = checkForNewPage(yPos, estimatedHeight)
              // Table data font size
              doc.setFontSize(10)
              // Start positions for each column
              let xPos = leftMargin
              // MODIFIED: Test Name should be in bold, parameter names normal
              if (index === 0) {
                doc.setFont("helvetica", "bold") // Bold for main test
              } else {
                doc.setFont("helvetica", "normal") // Normal for parameters
              }
              // UPDATED: Test Description with improved line height
              const testNameHeight = wrapText(
                doc,
                index === 0 ? currentTest.testname : `${currentTest.name}`,
                colWidths[0] - 2,
                xPos,
                yPos,
                4, // Increased line height from 3 to 4
              )
              xPos += colWidths[0]
              // Reset font to normal for other columns
              doc.setFont("helvetica", "normal")
              // Specimen Type
              doc.text(currentTest.specimen_type || "", xPos, yPos)
              xPos += colWidths[1]
              // Extra Gap
              xPos += colWidths[2]
              // Value(s) - MODIFIED: Show indicator after the value
              const statusIndicator = currentTest.isHigh
                ? "H"
                : currentTest.isLow
                  ? "L"
                  : getHighLowStatus(currentTest.value, currentTest.reference_range)
              const valueText = currentTest.value || ""
              // FIXED: Keep value bold when there's an indicator
              if (statusIndicator) {
                doc.setFont("helvetica", "bold")
                if (statusIndicator === "H") {
                  doc.setTextColor(255, 0, 0) // Red for high
                } else if (statusIndicator === "L") {
                  doc.setTextColor(0, 0, 255) // Blue for low
                }
                doc.text(valueText, xPos, yPos)
                // Display indicator AFTER the value
                const valueWidth = doc.getTextWidth(valueText)
                if (statusIndicator === "H") {
                  drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "up")
                } else if (statusIndicator === "L") {
                  drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "down")
                }
                doc.setTextColor(0, 0, 0) // Reset to black
                doc.setFont("helvetica", "normal")
              } else {
                doc.text(valueText, xPos, yPos)
              }
              xPos += colWidths[3]
              // Unit
              doc.setFont("helvetica", "normal")
              renderUnicodeText(currentTest.unit || "", xPos, yPos)
              xPos += colWidths[4]
              // UPDATED: Reference Range with improved line height
              const referenceRangeHeight = wrapText(
                doc,
                currentTest.reference_range || "",
                colWidths[5] - 2,
                xPos,
                yPos,
                4, // Increased line height from 3 to 4
              )
              xPos += colWidths[5]
              // UPDATED: Method with improved line height
              doc.setTextColor(0, 0, 0)
              // Remove "Method" from the method name
              const methodText = (currentTest.method || "").replace(/\bMethod\b/i, "").trim()
              // Wrap the method text with improved line height
              const methodHeight = wrapText(
                doc,
                methodText,
                colWidths[6] - 2,
                xPos,
                yPos,
                4, // Increased line height from 3 to 4
              )
              doc.setTextColor(0, 0, 0) // Reset to black
              // UPDATED: Calculate row height based on maximum content height
              const maxContentHeight = Math.max(testNameHeight, referenceRangeHeight, methodHeight)
              // UPDATED: Increased minimum row spacing
              yPos += Math.max(maxContentHeight, 6) + 2 // Increased base height and spacing
              // Reset styling
              doc.setFont("helvetica", "normal")
              doc.setTextColor(0, 0, 0)
            })
            // Add "Verified by" under each test
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text(`Verified by: ${test.verified_by || "N/A"}`, leftMargin, yPos)
            yPos += 8 // Reduced space after verified by from 6 to 5
            // Reset font
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
          })
          yPos += 4 // Reduced space between departments from 5 to 4
        })
        currentYPosition = yPos
      }

      // Mark that we're no longer in the table section
      isTableStarted = false

      // FIXED: Consistent space checking for both versions
      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height
        const footerStart = pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12) // Added extra space
        if (currentYPosition + 5 >= footerStart) {
          // Reduced from 10 to 5
          addSignatures()
          doc.addPage()
          pageCount++
          addHeaderFooter()
          return contentYStart
        }
        return currentYPosition
      }

      // Use this function before adding final content
      currentYPosition = ensureSpaceForFooter(currentYPosition)

      // Add signatures at the bottom of the last page
      addSignatures()

      // End of report - Center within content margins
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      const centerX = leftMargin + contentWidth / 2
      doc.text("**End Of Report**", centerX, currentYPosition, {
        align: "center",
      })

      // CRITICAL: Get the final page count AFTER all content is rendered
      const finalPageCount = pageCount

      // FIXED: Add page numbers with consistent positioning for both versions
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i)
        // Calculate position below signatures consistently
        const pageHeight = doc.internal.pageSize.height
        const pageNumberY = pageHeight - footerHeight - 5
        // Add the page number centered below signatures
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        const centerX = leftMargin + contentWidth / 2
        doc.text(`Page ${i} of ${finalPageCount}`, centerX, pageNumberY, {
          align: "center",
        })
      }

      // Generate the PDF as a Blob
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      // Open the PDF in a new tab for preview
      window.open(pdfUrl, "_blank")
      setLoading(false)
      return pdfBlob
    } catch (error) {
      console.error("Error while generating the PDF:", error)
      setLoading(false)
      return null
    }
  }

  return (
    <Container>
      <Header>
        <Title>Patient Report Table</Title>
        <Subtitle>Comprehensive patient information in tabular format</Subtitle>
      </Header>
      <DatePickerContainer>
        <DateLabel htmlFor="reportDate">Report Date:</DateLabel>
        <DateInput id="reportDate" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </DatePickerContainer>
      {loading ? (
        <LoadingSpinner />
      ) : patients.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateTitle>No Patients Found</EmptyStateTitle>
          <EmptyStateText>
            No patient reports available for the selected date. Please try a different date.
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
              {patients.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <PatientName>{item.patientname}</PatientName>
                  </TableCell>
                  <TableCell>{item.patient_id}</TableCell>
                  <TableCell>
                    <BarcodeText>{item.barcode}</BarcodeText>
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
