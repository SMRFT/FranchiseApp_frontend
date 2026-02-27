"use client"

import { useState, useEffect } from "react"
import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

// ==========================================
// GLOBAL STYLES
// ==========================================
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0; padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: white;
    color: white;
  }
  button {
    background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
    color: white; font-family: 'Pacifico', cursive; border: none;
    border-radius: 15px; padding: 10px 16px; cursor: pointer;
    font-size: 16px; transition: background 0.3s ease; margin-top: 20px;
  }
  button:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)); }
  label { display: block; font-weight: 600; color: white; margin-bottom: 8px; font-size: 0.95rem; text-transform: capitalize; }
  h3 { font-family: 'Pacifico', cursive; color: white; font-size: 30px; margin: 0; text-align: center; }
  table { background-color: white; width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  th { color: #4B9EB0; font-weight: bold; padding: 12px 16px; text-align: left; background-color: #f0f8fa; }
  td { color: black; padding: 12px 16px; border-top: 1px solid #ddd; }
  strong { color: black; }
`

// ── Styled Components ──
const Container = styled.div`
  font-family: 'Roboto', sans-serif; padding: 15px; max-width: 1200px; margin: 0 auto;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe); min-height: 100vh;
  @media (min-width: 768px) { padding: 20px; }
`
const PageHeader = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); color: white; padding: 20px;
  border-radius: 16px; margin-bottom: 20px; text-align: center;
  box-shadow: 0 4px 20px rgba(75,158,176,0.25);
  @media (min-width: 768px) { padding: 28px; }
`
const PageTitle = styled.h1`
  margin: 0; font-size: 1.5rem; font-weight: 700; font-family: 'Pacifico', cursive; color: white;
  @media (min-width: 768px) { font-size: 2rem; }
`
const PageSubtitle = styled.p` margin: 8px 0 0; opacity: 0.9; font-size: 0.95rem; color: white; `
const Card = styled.div`
  background: rgba(255,255,255,0.97); border-radius: 16px; padding: 18px; margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  @media (min-width: 768px) { padding: 24px; }
`
const SectionTitle = styled.h2`
  color: #2d3748; margin: 0 0 18px; font-size: 1.1rem; font-weight: 700;
  font-family: 'Roboto', sans-serif; display: flex; align-items: center; gap: 10px;
  &::before { content: ''; width: 4px; height: 22px; background: linear-gradient(135deg, #6FB1C4, #4B9EB0); border-radius: 2px; flex-shrink: 0; }
  @media (min-width: 768px) { font-size: 1.25rem; }
`
const FormGrid = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr) auto; align-items: end; }
`
const InputGroup = styled.div` display: flex; flex-direction: column; gap: 6px; `
const Label = styled.label`
  font-weight: 700 !important; color: #4a5568 !important; font-size: 0.75rem !important;
  text-transform: uppercase !important; letter-spacing: 0.5px; margin-bottom: 4px !important;
`
const Input = styled.input`
  padding: 11px 14px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem;
  transition: all 0.3s; background: ${p => p.readOnly || p.disabled ? "#f8fafc" : "white"};
  color: #2d3748; width: 100%; box-sizing: border-box; font-family: 'Roboto', sans-serif;
  &:focus { outline: none; border-color: #4B9EB0; box-shadow: 0 0 0 3px rgba(75,158,176,0.1); }
`
const SearchBtn = styled.button`
  padding: 11px 24px !important; background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important; border: none; border-radius: 10px !important; cursor: pointer;
  font-size: 0.9rem; font-weight: 600; white-space: nowrap; margin-top: 0 !important;
  font-family: 'Roboto', sans-serif !important; transition: all 0.3s;
  &:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)) !important; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`
const CreateBatchBtn = styled.button`
  padding: 12px 28px !important; background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important; border: none; border-radius: 10px !important; cursor: pointer;
  font-size: 0.95rem; font-weight: 700; margin-top: 0 !important;
  font-family: 'Roboto', sans-serif !important; transition: all 0.3s;
  &:hover { background: linear-gradient(135deg, #059669, #047857) !important; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`
const DownloadBtn = styled.button`
  padding: 12px 28px !important; background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: white !important; border: none; border-radius: 10px !important; cursor: pointer;
  font-size: 0.95rem; font-weight: 700; margin-top: 0 !important;
  font-family: 'Roboto', sans-serif !important; transition: all 0.3s;
  &:hover { background: linear-gradient(135deg, #d97706, #b45309) !important; transform: translateY(-1px); }
`
const BtnRow = styled.div` display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; `
const StyledTable = styled.table` width: 100%; border-collapse: collapse; background-color: white !important; border-radius: 10px; overflow: hidden; `
const THead = styled.thead` background: linear-gradient(135deg, #6FB1C4, #4B9EB0); `
const THeadCell = styled.th`
  padding: 13px 12px !important; text-align: left !important; font-weight: 700;
  color: white !important; font-size: 0.8rem; text-transform: uppercase;
  letter-spacing: 0.5px; background: transparent !important; white-space: nowrap;
`
const TRow = styled.tr`
  border-bottom: 1px solid #e2e8f0; transition: background 0.15s;
  &:hover { background: #f0f8fa; } &:last-child { border-bottom: none; }
`
const TCell = styled.td`
  padding: 12px !important; color: #334155 !important; font-size: 0.87rem;
  vertical-align: middle; border-top: 1px solid #e2e8f0 !important;
`
const ViewBtn = styled.button`
  padding: 7px 14px !important; background: linear-gradient(135deg, #6FB1C4, #4B9EB0) !important;
  color: white !important; border: none; border-radius: 8px !important; cursor: pointer;
  font-size: 0.78rem; font-weight: 600; margin-top: 0 !important;
  font-family: 'Roboto', sans-serif !important; transition: all 0.2s; white-space: nowrap;
  &:hover { background: linear-gradient(135deg, rgb(85,156,175), rgb(38,136,158)) !important; }
`
const StatusBadge = styled.span`
  padding: 4px 10px; border-radius: 12px; font-size: 0.73rem; font-weight: 700;
  background: linear-gradient(135deg,#10b981,#059669); color: white; white-space: nowrap;
`
const BatchSummaryGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;
  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
`
const SummaryCard = styled.div`
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #bae6fd;
  border-radius: 12px; padding: 14px; text-align: center;
`
const SummaryVal = styled.div` font-size: 1.4rem; font-weight: 800; color: #4B9EB0; margin-bottom: 4px; `
const SummaryLbl = styled.div` font-size: 0.72rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; `
const ErrorMsg = styled.div`
  background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px;
  padding: 14px 18px; margin-bottom: 16px; color: #dc2626; font-weight: 600; font-size: 0.9rem;
`
const SuccessMsg = styled.div`
  background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px;
  padding: 14px 18px; margin-bottom: 16px; color: #15803d; font-weight: 600; font-size: 0.9rem;
`
const LoadingMsg = styled.div` text-align: center; padding: 40px; color: #4B9EB0; font-weight: 600; font-size: 1rem; `
const EmptyState = styled.div`
  text-align: center; padding: 50px 20px; color: #64748b;
  &::before { content: '📋'; font-size: 3rem; display: block; margin-bottom: 14px; }
`
const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 10px;
`
const ModalBox = styled.div`
  background: white; border-radius: 18px; width: 100%; max-width: 640px; max-height: 88vh;
  overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
`
const ModalHeader = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); padding: 16px 22px;
  display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
`
const ModalTitle = styled.h3`
  margin: 0 !important; font-size: 1rem !important; font-weight: 700;
  color: white !important; font-family: 'Pacifico', cursive !important; text-align: left !important;
`
const ModalClose = styled.button`
  background: none !important; border: none; font-size: 22px; color: white !important;
  cursor: pointer; padding: 4px; margin: 0 !important; border-radius: 0 !important;
  box-shadow: none !important; line-height: 1;
  &:hover { background: none !important; opacity: 0.8; }
`
const ModalBody = styled.div` padding: 20px; overflow-y: auto; flex-grow: 1; `
const PatientInfoGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 18px;
  padding: 14px; background: #f8fafc; border-radius: 10px;
  @media (min-width: 480px) { grid-template-columns: repeat(3, 1fr); }
`
const InfoItem = styled.div``
const InfoLbl = styled.div` font-size: 0.68rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; `
const InfoVal = styled.div` font-size: 0.9rem; color: #1e293b; font-weight: 600; `
const ConfirmModal = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center; z-index: 1100; padding: 10px;
`
const ConfirmBox = styled.div`
  background: white; border-radius: 18px; padding: 28px; max-width: 440px; width: 100%;
  text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
`
const ConfirmTitle = styled.h3` margin: 0 0 12px; color: #1e293b; font-size: 1.2rem; font-family: 'Roboto', sans-serif; `
const ConfirmText = styled.p` color: #64748b; margin: 0 0 20px; font-size: 0.92rem; line-height: 1.5; `

// ── Barcode SVG ──
function generateBarcodeSVG(text, width = 200, height = 48) {
  const bars = []
  let x = 2
  const str = String(text)

  // Start guard
  bars.push(`<rect x="2" y="0" width="2" height="${height}" fill="black"/>`)
  bars.push(`<rect x="6" y="0" width="1" height="${height}" fill="black"/>`)
  bars.push(`<rect x="9" y="0" width="2" height="${height}" fill="black"/>`)
  x = 14

  for (let ci = 0; ci < str.length; ci++) {
    const code = str.charCodeAt(ci)
    const bits = [(code >> 6) & 1, (code >> 5) & 1, (code >> 4) & 1, (code >> 3) & 1, (code >> 2) & 1, (code >> 1) & 1, code & 1]
    bits.forEach((bit, bi) => {
      const w = bit ? 3 : 1.5
      if (bi % 2 === 0) bars.push(`<rect x="${x.toFixed(1)}" y="0" width="${w}" height="${height}" fill="black"/>`)
      x += w + 0.8
    })
    x += 2
  }

  // End guard
  bars.push(`<rect x="${x}" y="0" width="2" height="${height}" fill="black"/>`)
  bars.push(`<rect x="${x + 4}" y="0" width="1" height="${height}" fill="black"/>`)
  bars.push(`<rect x="${x + 7}" y="0" width="2" height="${height}" fill="black"/>`)

  const totalW = Math.max(x + 12, width)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${height}" viewBox="0 0 ${totalW} ${height}">
  <rect width="${totalW}" height="${height}" fill="white"/>
  ${bars.join('\n  ')}
</svg>`
}

// ==========================================
// COMPONENT
// ==========================================
const SampleBatchManagement = () => {
  const [franchiseId, setFranchiseId] = useState("")
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0])
  // samples: each item is { franchise_id, barcode, patient_id, patientname, age, gender, phone, registrationDate, testdetails: [...] }
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [creatingBatch, setCreatingBatch] = useState(false)
  const [createdBatch, setCreatedBatch] = useState(null)
  const [viewPatient, setViewPatient] = useState(null)

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  useEffect(() => {
    const id = localStorage.getItem("franchise_id")
    if (id) setFranchiseId(id)
  }, [])

  useEffect(() => {
    if (franchiseId) fetchTransferredSamples()
  }, [franchiseId, fromDate, toDate])

  // Backend now returns patient details embedded — no extra calls needed
  const fetchTransferredSamples = async () => {
    if (!franchiseId) return
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const url = `${franchiseurl}samples/transferred/?franchise_id=${franchiseId}&samplestatus=Transferred&start_date=${fromDate}&end_date=${toDate}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch transferred samples")
      const data = await res.json()
      setSamples(data.transferred_samples || [])
    } catch (e) {
      setError(e.message)
      setSamples([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBatch = () => {
    if (samples.length === 0) { setError("No transferred samples to batch."); return }
    setShowConfirm(true)
  }

  const confirmCreate = async () => {
    setShowConfirm(false)
    setCreatingBatch(true)
    setError("")
    setSuccess("")
    try {
      const seen = new Set()
      const batchDetails = []
      for (const s of samples) {
        if (!seen.has(s.barcode)) { seen.add(s.barcode); batchDetails.push({ barcode: s.barcode }) }
      }
      const payload = { franchise_id: franchiseId, batch_details: batchDetails, received: false, remarks: null }
      const res = await fetch(`${franchiseurl}batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || JSON.stringify(err) || "Failed to create batch")
      }
      const data = await res.json()
      setCreatedBatch({ ...data, samples })
      setSuccess(`Batch ${data.batch_number} created successfully!`)
      setSamples([])
    } catch (e) {
      setError(e.message)
    } finally {
      setCreatingBatch(false)
    }
  }

const downloadPDF = () => {
    if (!createdBatch) return
    const {
      batch_number = "N/A",
      shipment_from = "N/A",
      shipment_to = "Shanmuga Reference Lab",
      specimen_count = [],
      samples: batchSamples = [],
    } = createdBatch

    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    const barcodeSvg = generateBarcodeSVG(batch_number)
    const barcodeDataUrl = `data:image/svg+xml;base64,${btoa(barcodeSvg)}`

    const specimenRows = specimen_count.map(s =>
      `<tr><td>${s.specimen_type}</td><td class="center">${s.count}</td></tr>`
    ).join("")
    const totalSpecimen = specimen_count.reduce((a, b) => a + b.count, 0)

    // Build patient rows — each test gets its own row, patient info spans multiple rows
    let patientRows = ""
    let serialNo = 1
    batchSamples.forEach((s) => {
      const tests = Array.isArray(s.testdetails) ? s.testdetails : []
      const rowspan = tests.length || 1

      if (tests.length === 0) {
        patientRows += `
          <tr>
            <td class="center">${serialNo++}</td>
            <td>${s.patient_id || "N/A"}</td>
            <td>${s.patientname || "N/A"}</td>
            <td class="mono">${s.barcode || "N/A"}</td>
            <td>—</td>
            <td>—</td>
          </tr>`
      } else {
        tests.forEach((t, ti) => {
          if (ti === 0) {
            // First test row — include patient info cells with rowspan
            patientRows += `
              <tr>
                <td class="center" rowspan="${rowspan}">${serialNo++}</td>
                <td rowspan="${rowspan}">${s.patient_id || "N/A"}</td>
                <td rowspan="${rowspan}">${s.patientname || "N/A"}</td>
                <td class="mono" rowspan="${rowspan}">${s.barcode || "N/A"}</td>
                <td>${t.testname || t.test_name || "N/A"}</td>
                <td>${t.collection_container || t.container || "—"}</td>
              </tr>`
          } else {
            // Subsequent test rows — only test columns
            patientRows += `
              <tr>
                <td>${t.testname || t.test_name || "N/A"}</td>
                <td>${t.collection_container || t.container || "—"}</td>
              </tr>`
          }
        })
      }
    })

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Shipment Report - ${batch_number}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #000; padding: 28px 30px; }

  .doc-header { text-align: center; padding-bottom: 12px; border-bottom: 2.5px solid #4B9EB0; margin-bottom: 16px; }
  .doc-header h1 { font-size: 22px; color: #1e293b; font-weight: 800; letter-spacing: 0.5px; }
  .doc-header h2 { font-size: 13px; color: #4B9EB0; font-weight: 500; margin-top: 4px; text-decoration: underline; letter-spacing: 1px; }

  .meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
  .meta-left { flex: 1; }
  .meta-row { margin-bottom: 7px; font-size: 11.5px; line-height: 1.4; }
  .meta-row .lbl { font-weight: bold; color: #4a5568; display: inline-block; width: 120px; }
  .meta-right { text-align: center; }
  .batch-num { font-size: 13px; font-weight: bold; letter-spacing: 3px; color: #1e293b; margin-top: 4px; }

  .sec-title { font-size: 11px; font-weight: bold; color: #4B9EB0; text-transform: uppercase; letter-spacing: 0.8px; margin: 18px 0 7px; padding-bottom: 3px; border-bottom: 1px solid #bae6fd; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  th { padding: 9px 10px; font-size: 10px; font-weight: bold; text-align: left; background: #d1eaf0; color: #1e293b; border: 1px solid #b8d9e8; text-transform: uppercase; letter-spacing: 0.4px; }
  td { padding: 7px 10px; border: 1px solid #dde8ee; font-size: 10.5px; color: #1e293b; vertical-align: middle; }

  /* Alternating row color — only on first test row per patient */
  tr.patient-first td { background: #f5fbfd; }
  tr.patient-next td { background: #ffffff; }

  .center { text-align: center; }
  .mono { font-family: 'Courier New', monospace; font-size: 10px; }
  .total-row td { background: #d1eaf0 !important; font-weight: bold; }
  .specimen-wrap { width: 55%; }

  .sig-section { display: flex; justify-content: flex-end; margin-top: 40px; }
  .sig-box { width: 200px; text-align: center; }
  .sig-line { border-top: 1.5px solid #333; padding-top: 6px; font-size: 11px; font-weight: bold; color: #4a5568; letter-spacing: 0.5px; }

  @media print { body { padding: 15px 20px; } @page { margin: 10mm; } }
</style>
</head>
<body>

<div class="doc-header">
  <h1>Shanmuga Diagnostics</h1>
  <h2>Shipment Report</h2>
</div>

<div class="meta">
  <div class="meta-left">
    <div class="meta-row"><span class="lbl">Shipment Date</span>: ${dateStr} &nbsp;${timeStr}</div>
    <div class="meta-row"><span class="lbl">Shipment From</span>: ${shipment_from}</div>
    <div class="meta-row"><span class="lbl">Shipment To</span>: ${shipment_to}</div>
    <div class="meta-row"><span class="lbl">Total Patients</span>: ${batchSamples.length}</div>
  </div>
  <div class="meta-right">
    <img src="${barcodeDataUrl}" width="200" height="48" alt="barcode" style="display:block;margin-bottom:4px"/>
    <div class="batch-num">${batch_number}</div>
  </div>
</div>

<div class="sec-title">Patient &amp; Sample Details</div>
<table>
  <thead>
    <tr>
      <th class="center" style="width:32px">#</th>
      <th style="width:90px">Patient ID</th>
      <th style="width:130px">Patient Name</th>
      <th style="width:100px">Barcode</th>
      <th>Test Name</th>
      <th style="width:160px">Collection Container</th>
    </tr>
  </thead>
  <tbody>
    ${patientRows || '<tr><td colspan="6" class="center" style="color:#888;padding:16px">No patient data</td></tr>'}
  </tbody>
</table>

<div class="sec-title">Specimen Summary</div>
<div class="specimen-wrap">
  <table>
    <thead>
      <tr><th>Specimen Name</th><th class="center" style="width:80px">Count</th></tr>
    </thead>
    <tbody>
      ${specimenRows || '<tr><td colspan="2" class="center" style="color:#888">No specimen data</td></tr>'}
      <tr class="total-row"><td>Total</td><td class="center">${totalSpecimen}</td></tr>
    </tbody>
  </table>
</div>
<div class="sig-section">
  <div class="sig-box">
    <div class="sig-line">Signature</div>
  </div>
</div>
</body>
</html>`

    const win = window.open("", "_blank", "width=900,height=700")
    if (!win) { alert("Please allow popups to print the PDF."); return }
    win.document.write(html)
    win.document.close()
    win.onload = () => setTimeout(() => { win.print(); win.close() }, 600)
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <PageHeader>
          <PageTitle>Sample Batch Management</PageTitle>
          <PageSubtitle>Manage and track transferred samples efficiently</PageSubtitle>
        </PageHeader>

        {/* ── Search ── */}
        <Card>
          <SectionTitle>Search Parameters</SectionTitle>
          <FormGrid>
            <InputGroup>
              <Label>Franchise ID</Label>
              <Input value={franchiseId} readOnly disabled />
            </InputGroup>
            <InputGroup>
              <Label>From Date</Label>
              <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>To Date</Label>
              <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </InputGroup>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <SearchBtn onClick={fetchTransferredSamples} disabled={loading || !franchiseId}>
                {loading ? "Loading..." : "Search"}
              </SearchBtn>
            </div>
          </FormGrid>
          {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}
          {success && <SuccessMsg>✅ {success}</SuccessMsg>}
        </Card>

        {/* ── Created Batch (shown at top after creation) ── */}
        {createdBatch && (
          <Card>
            <SectionTitle>✅ Batch Created Successfully</SectionTitle>
            <BatchSummaryGrid>
              <SummaryCard>
                <SummaryVal>{createdBatch.batch_number}</SummaryVal>
                <SummaryLbl>Batch Number</SummaryLbl>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal>{createdBatch.samples?.length || 0}</SummaryVal>
                <SummaryLbl>Total Patients</SummaryLbl>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal style={{ fontSize: "1rem" }}>{createdBatch.shipment_from || "N/A"}</SummaryVal>
                <SummaryLbl>Shipment From</SummaryLbl>
              </SummaryCard>
              <SummaryCard>
                <SummaryVal style={{ fontSize: "1rem" }}>{createdBatch.shipment_to || "Shanmuga Ref Lab"}</SummaryVal>
                <SummaryLbl>Shipment To</SummaryLbl>
              </SummaryCard>
            </BatchSummaryGrid>

            {createdBatch.specimen_count?.length > 0 && (
              <>
                <div style={{ fontWeight: 700, color: "#4a5568", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                  Specimen Summary
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                  {createdBatch.specimen_count.map((sp, i) => (
                    <div key={i} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "10px 20px", textAlign: "center" }}>
                      <div style={{ fontWeight: 800, color: "#4B9EB0", fontSize: "1.3rem" }}>{sp.count}</div>
                      <div style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: 700 }}>{sp.specimen_type}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <BtnRow>
              <DownloadBtn onClick={downloadPDF}>📄 Download PDF Report</DownloadBtn>
            </BtnRow>
          </Card>
        )}

        {/* ── Samples Table ── */}
        {loading && <LoadingMsg>⏳ Loading samples...</LoadingMsg>}

        {!loading && samples.length > 0 && (
          <Card>
            <SectionTitle>Transferred Samples ({samples.length} patients)</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <StyledTable>
                <THead>
                  <tr>
                    <THeadCell>#</THeadCell>
                    <THeadCell>Date</THeadCell>
                    <THeadCell>Patient ID</THeadCell>
                    <THeadCell>Patient Name</THeadCell>
                    <THeadCell>Barcode</THeadCell>
                    <THeadCell>Status</THeadCell>
                    <THeadCell>Tests</THeadCell>
                  </tr>
                </THead>
                <tbody>
                  {samples.map((sample, i) => (
                    <TRow key={i}>
                      <TCell>{i + 1}</TCell>
                      <TCell>
                        {sample.registrationDate
                          ? new Date(sample.registrationDate).toLocaleDateString("en-GB")
                          : "—"}
                      </TCell>
                      <TCell style={{ fontWeight: 700, color: "#1e293b" }}>{sample.patient_id || "—"}</TCell>
                      <TCell style={{ fontWeight: 600 }}>{sample.patientname || "—"}</TCell>
                      <TCell>
                        <span style={{ fontFamily: "Courier New, monospace", fontSize: "0.82rem", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>
                          {sample.barcode}
                        </span>
                      </TCell>
                      <TCell><StatusBadge>Transferred</StatusBadge></TCell>
                      <TCell>
                        <ViewBtn onClick={() => setViewPatient(sample)}>
                          View Tests ({Array.isArray(sample.testdetails) ? sample.testdetails.length : 0})
                        </ViewBtn>
                      </TCell>
                    </TRow>
                  ))}
                </tbody>
              </StyledTable>
            </div>
            <BtnRow>
              <CreateBatchBtn onClick={handleCreateBatch} disabled={creatingBatch}>
                {creatingBatch ? "Creating..." : "Create Batch"}
              </CreateBatchBtn>
            </BtnRow>
          </Card>
        )}

        {!loading && samples.length === 0 && !createdBatch && (
          <Card>
            <EmptyState>
              <h3 style={{ color: "#64748b", fontFamily: "Pacifico, cursive", fontSize: "1.1rem" }}>No Transferred Samples Found</h3>
              <p style={{ color: "#94a3b8", marginTop: 8 }}>Try selecting a different date range</p>
            </EmptyState>
          </Card>
        )}

        {/* ── Test View Modal ── */}
        {viewPatient && (
          <ModalOverlay onClick={() => setViewPatient(null)}>
            <ModalBox onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Tests — {viewPatient.patientname || viewPatient.patient_id}</ModalTitle>
                <ModalClose onClick={() => setViewPatient(null)}>&times;</ModalClose>
              </ModalHeader>
              <ModalBody>
                <PatientInfoGrid>
                  <InfoItem><InfoLbl>Patient ID</InfoLbl><InfoVal>{viewPatient.patient_id || "—"}</InfoVal></InfoItem>
                  <InfoItem><InfoLbl>Patient Name</InfoLbl><InfoVal>{viewPatient.patientname || "—"}</InfoVal></InfoItem>
                  <InfoItem>
                    <InfoLbl>Barcode</InfoLbl>
                    <InfoVal style={{ fontFamily: "Courier New, monospace", fontSize: "0.85rem" }}>{viewPatient.barcode}</InfoVal>
                  </InfoItem>
                  <InfoItem>
                    <InfoLbl>Date</InfoLbl>
                    <InfoVal>{viewPatient.registrationDate ? new Date(viewPatient.registrationDate).toLocaleDateString("en-GB") : "—"}</InfoVal>
                  </InfoItem>
                  {viewPatient.age && viewPatient.age !== "N/A" && (
                    <InfoItem><InfoLbl>Age</InfoLbl><InfoVal>{viewPatient.age}</InfoVal></InfoItem>
                  )}
                  {viewPatient.gender && viewPatient.gender !== "N/A" && (
                    <InfoItem><InfoLbl>Gender</InfoLbl><InfoVal>{viewPatient.gender}</InfoVal></InfoItem>
                  )}
                </PatientInfoGrid>

                <div style={{ fontWeight: 700, color: "#4a5568", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                  Test List ({Array.isArray(viewPatient.testdetails) ? viewPatient.testdetails.length : 0} tests)
                </div>

                {Array.isArray(viewPatient.testdetails) && viewPatient.testdetails.length > 0 ? (
                  <StyledTable>
                    <THead>
                      <tr>
                        <THeadCell style={{ width: 40 }}>#</THeadCell>
                        <THeadCell>Test Name</THeadCell>
                        <THeadCell>Container</THeadCell>
                        <THeadCell>Status</THeadCell>
                        {viewPatient.testdetails.some(t => t.transfer_to) && <THeadCell>Transfer To</THeadCell>}
                      </tr>
                    </THead>
                    <tbody>
                      {viewPatient.testdetails.map((t, i) => (
                        <TRow key={i}>
                          <TCell>{i + 1}</TCell>
                          <TCell style={{ fontWeight: 600 }}>{t.testname || t.test_name || "N/A"}</TCell>
                          <TCell>
                            <span style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: 4, fontSize: "0.78rem", fontWeight: 600, color: "#64748b" }}>
                              {t.collection_container || "Plain/Gel"}
                            </span>
                          </TCell>
                          <TCell><StatusBadge>{t.samplestatus || "N/A"}</StatusBadge></TCell>
                          {t.transfer_to && <TCell style={{ fontSize: "0.8rem", color: "#4B9EB0", fontWeight: 600 }}>{t.transfer_to}</TCell>}
                        </TRow>
                      ))}
                    </tbody>
                  </StyledTable>
                ) : (
                  <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No test details available</div>
                )}
              </ModalBody>
            </ModalBox>
          </ModalOverlay>
        )}

        {/* ── Confirm Modal ── */}
        {showConfirm && (
          <ConfirmModal>
            <ConfirmBox>
              <ConfirmTitle>Confirm Batch Creation</ConfirmTitle>
              <ConfirmText>
                Create a batch with <strong>{samples.length} patients</strong>?
                <br /><br />
                Shipment details will be auto-populated from your franchise information.
              </ConfirmText>
              <BtnRow style={{ justifyContent: "center" }}>
                <CreateBatchBtn onClick={confirmCreate} disabled={creatingBatch}>
                  {creatingBatch ? "Creating..." : "Yes, Create"}
                </CreateBatchBtn>
                <SearchBtn onClick={() => setShowConfirm(false)}>Cancel</SearchBtn>
              </BtnRow>
            </ConfirmBox>
          </ConfirmModal>
        )}
      </Container>
    </>
  )
}

export default SampleBatchManagement