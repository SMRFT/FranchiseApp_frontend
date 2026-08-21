import React, { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Layers, Users, Calendar, Search, RefreshCw, 
  CheckCircle2, Printer, AlertCircle, Check, X,
  Barcode, Download, PlusCircle
} from "lucide-react";

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

  ${props => props.variant === 'success' && `
    background: #10b981;
    color: white;
    border-color: #10b981;
    &:hover { background: #059669; }
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

// Helper: SVG Barcode
function generateBarcodeSVG(text, width = 200, height = 48) {
  const str = String(text || 'BATCH').toUpperCase();
  let x = 6;
  const bars = [];
  bars.push(`<rect x="2" y="0" width="2" height="${height}" fill="black"/>`);
  bars.push(`<rect x="6" y="0" width="1" height="${height}" fill="black"/>`);
  bars.push(`<rect x="9" y="0" width="2" height="${height}" fill="black"/>`);
  x = 14;

  for (let ci = 0; ci < str.length; ci++) {
    const code = str.charCodeAt(ci);
    const bits = [(code >> 6) & 1, (code >> 5) & 1, (code >> 4) & 1, (code >> 3) & 1, (code >> 2) & 1, (code >> 1) & 1, code & 1];
    bits.forEach((bit, bi) => {
      const w = bit ? 3 : 1.5;
      if (bi % 2 === 0) bars.push(`<rect x="${x.toFixed(1)}" y="0" width="${w}" height="${height}" fill="black"/>`);
      x += w + 0.8;
    });
    x += 2;
  }

  bars.push(`<rect x="${x}" y="0" width="2" height="${height}" fill="black"/>`);
  bars.push(`<rect x="${x + 4}" y="0" width="1" height="${height}" fill="black"/>`);
  bars.push(`<rect x="${x + 7}" y="0" width="2" height="${height}" fill="black"/>`);

  const totalW = Math.max(x + 12, width);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${height}" viewBox="0 0 ${totalW} ${height}">
  <rect width="${totalW}" height="${height}" fill="white"/>
  ${bars.join('\n  ')}
</svg>`;
}

export default function BatchGeneration() {
  const [franchiseId, setFranchiseId] = useState("");
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [createdBatch, setCreatedBatch] = useState(null);

  const rawBaseUrl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL || 'http://127.0.0.1:8000/';
  const franchiseurl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

  useEffect(() => {
    const id = localStorage.getItem("franchise_id") || "SHF004";
    setFranchiseId(id);
  }, []);

  const fetchTransferredSamples = async () => {
    if (!franchiseId) return;
    setLoading(true);
    try {
      const url = `${franchiseurl}samples/transferred/?franchise_id=${franchiseId}&samplestatus=Transferred&start_date=${fromDate}&end_date=${toDate}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch transferred samples");
      const data = await res.json();
      setSamples(data.transferred_samples || []);
    } catch (e) {
      console.error(e);
      setSamples([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (franchiseId) fetchTransferredSamples();
  }, [franchiseId, fromDate, toDate]);

  const handleCreateBatch = async () => {
    if (samples.length === 0) {
      alert("No transferred samples available to batch.");
      return;
    }

    if (!window.confirm(`Create a new shipment batch for ${samples.length} sample records?`)) {
      return;
    }

    setCreatingBatch(true);
    try {
      const seen = new Set();
      const batchDetails = [];
      for (const s of samples) {
        if (!seen.has(s.barcode)) {
          seen.add(s.barcode);
          batchDetails.push({ barcode: s.barcode });
        }
      }

      const payload = { franchise_id: franchiseId, batch_details: batchDetails, received: false, remarks: null };
      const res = await fetch(`${franchiseurl}batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create batch");
      }

      const data = await res.json();
      setCreatedBatch({ ...data, samples });
      alert(`Batch #${data.batch_number} created successfully!`);
      setSamples([]);
    } catch (e) {
      alert(e.message);
    } finally {
      setCreatingBatch(false);
    }
  };

  const downloadPDF = () => {
    if (!createdBatch) return;
    const {
      batch_number = "N/A",
      shipment_from = franchiseId,
      shipment_to = "Shanmuga Reference Lab",
      specimen_count = [],
      samples: batchSamples = [],
    } = createdBatch;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const barcodeSvg = generateBarcodeSVG(batch_number);
    const barcodeDataUrl = `data:image/svg+xml;base64,${btoa(barcodeSvg)}`;

    let patientRows = "";
    let serialNo = 1;
    batchSamples.forEach((s) => {
      const tests = Array.isArray(s.testdetails) ? s.testdetails : [];
      const rowspan = tests.length || 1;

      if (tests.length === 0) {
        patientRows += `
          <tr>
            <td style="text-align:center">${serialNo++}</td>
            <td>${s.patient_id || "N/A"}</td>
            <td>${s.patientname || "N/A"}</td>
            <td>${s.barcode || "N/A"}</td>
            <td>—</td>
            <td>—</td>
          </tr>`;
      } else {
        tests.forEach((t, ti) => {
          if (ti === 0) {
            patientRows += `
              <tr>
                <td style="text-align:center" rowspan="${rowspan}">${serialNo++}</td>
                <td rowspan="${rowspan}">${s.patient_id || "N/A"}</td>
                <td rowspan="${rowspan}">${s.patientname || "N/A"}</td>
                <td rowspan="${rowspan}">${s.barcode || "N/A"}</td>
                <td>${t.testname || t.test_name || "N/A"}</td>
                <td>${t.collection_container || t.container || "—"}</td>
              </tr>`;
          } else {
            patientRows += `
              <tr>
                <td>${t.testname || t.test_name || "N/A"}</td>
                <td>${t.collection_container || t.container || "—"}</td>
              </tr>`;
          }
        });
      }
    });

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Shipment Report - ${batch_number}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 11px; padding: 24px; color: #1e293b; }
  .doc-header { text-align: center; border-bottom: 2px solid #4B9EB0; padding-bottom: 10px; margin-bottom: 16px; }
  .doc-header h1 { font-size: 20px; font-weight: bold; }
  .doc-header h2 { font-size: 13px; color: #4B9EB0; margin-top: 4px; }
  .meta { display: flex; justify-content: space-between; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #e0f2fe; padding: 8px; border: 1px solid #cbd5e1; font-size: 10px; text-align: left; }
  td { padding: 6px 8px; border: 1px solid #e2e8f0; font-size: 10px; }
</style>
</head>
<body>
<div class="doc-header">
  <h1>Shanmuga Diagnostics</h1>
  <h2>Batch Shipment Manifest - #${batch_number}</h2>
</div>
<div class="meta">
  <div>
    <div><strong>Shipment From:</strong> ${shipment_from}</div>
    <div><strong>Shipment To:</strong> ${shipment_to}</div>
    <div><strong>Date:</strong> ${dateStr} ${timeStr}</div>
    <div><strong>Total Patients:</strong> ${batchSamples.length}</div>
  </div>
  <div style="text-align:center">
    <img src="${barcodeDataUrl}" width="180" height="40" alt="barcode" />
    <div style="font-weight:bold; font-size:12px; margin-top:4px">${batch_number}</div>
  </div>
</div>
<h3>Patient &amp; Sample Manifest</h3>
<table>
  <thead>
    <tr>
      <th style="width:30px">#</th>
      <th style="width:90px">Patient ID</th>
      <th style="width:140px">Patient Name</th>
      <th style="width:100px">Barcode</th>
      <th>Test Name</th>
      <th style="width:140px">Container</th>
    </tr>
  </thead>
  <tbody>
    ${patientRows || '<tr><td colspan="6" style="text-align:center;padding:12px">No samples</td></tr>'}
  </tbody>
</table>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => setTimeout(() => { win.print(); win.close(); }, 600);
  };

  return (
    <Container>
      <TopSection>
        <Header>
          <TitleGroup>
            <h1><Layers size={22} color="#4B9EB0" /> Batch Generation & Manifest</h1>
            <p>Group transferred samples into shipment manifests and generate lab batches</p>
          </TitleGroup>

          <HeaderActions>
            {createdBatch && (
              <Button variant="success" onClick={downloadPDF} title="Download Batch Manifest">
                <Printer size={13} /> Print Manifest (#{createdBatch.batch_number})
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={handleCreateBatch} 
              disabled={samples.length === 0 || creatingBatch}
              title="Create Batch from Transferred Samples"
            >
              <PlusCircle size={13} /> {creatingBatch ? "Creating Batch..." : `Create Batch (${samples.length})`}
            </Button>
            <Button variant="secondary" onClick={fetchTransferredSamples} title="Refresh records">
              <RefreshCw size={13} /> Refresh
            </Button>
          </HeaderActions>
        </Header>

        {/* Stat Cards */}
        <StatsGrid>
          <StatCard iconBg="#e0f2fe" iconColor="#0284c7" valueColor="#0369a1">
            <div className="stat-info">
              <div className="stat-label">Transferred Samples</div>
              <div className="stat-value">{samples.length}</div>
            </div>
            <div className="stat-icon"><Layers size={17} /></div>
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
              <div className="stat-label">Franchise ID</div>
              <div className="stat-value">{franchiseId}</div>
            </div>
            <div className="stat-icon"><CheckCircle2 size={17} /></div>
          </StatCard>
        </StatsGrid>

        {/* Filter Section */}
        <FilterSection>
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

            <Button variant="primary" onClick={fetchTransferredSamples} disabled={loading}>
              Search
            </Button>
          </DateControls>
        </FilterSection>
      </TopSection>

      {/* Table Card */}
      <TableCard>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
            <div>Loading transferred samples...</div>
          </div>
        ) : samples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <Layers size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
              No Transferred Samples Awaiting Batch
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              Transfer samples from the Sample Transfer screen first to create a shipment batch.
            </div>
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Barcode</th>
                  <th>Tests Included</th>
                  <th>Sample Containers</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample, idx) => {
                  const tests = Array.isArray(sample.testdetails) ? sample.testdetails : [];
                  return (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          {sample.patientname || "Patient"}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          ID: #{sample.patient_id}
                        </div>
                      </td>

                      <td>
                        <BarcodeChip>{sample.barcode || "N/A"}</BarcodeChip>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: '#334155' }}>
                          {tests.map(t => t.testname || t.test_name).filter(Boolean).join(', ') || 'Diagnostic Tests'}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {tests.map((t, ti) => (
                            <span key={ti} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', color: '#475569' }}>
                              {t.collection_container || t.container || 'Gel Tube'}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </TableCard>
    </Container>
  );
}