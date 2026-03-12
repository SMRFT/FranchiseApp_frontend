import { jsPDF } from 'jspdf';

/**
 * Generates a PDF report from patient data and downloads it.
 * @param {object[]} data - The filtered and sorted patient registration data.
 * @param {object} stats - The calculated statistics.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 */
export const generatePdf = (data, stats, startDate, endDate) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const margin = 10;
  let yPos = margin;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;

  // --- Title and Metadata ---
  doc.setFontSize(16);
  doc.setTextColor(45, 55, 72);
  doc.text('Patient Test Management Report', margin, yPos);
  yPos += lineHeight;
  
  doc.setFontSize(10);
  doc.setTextColor(74, 85, 104);
  doc.text(`Date Range: ${startDate} to ${endDate}`, margin, yPos);
  yPos += lineHeight * 1.5;

  // --- Stats Section ---
  doc.setFontSize(12);
  doc.setTextColor(102, 126, 234);
  doc.text('Summary Statistics', margin, yPos);
  yPos += lineHeight;

  doc.setFontSize(10);
  doc.setTextColor(45, 55, 72);
  doc.text(`Total Registrations: ${stats.totalRegistrations}`, margin, yPos);
  doc.text(`Total Tests: ${stats.totalTests}`, 80, yPos);
  doc.text(`Total Revenue: ₹${stats.totalRevenue.toFixed(2)}`, 140, yPos);
  yPos += lineHeight * 1.5;
  
  // --- Table Header ---
  const headers = [
    'ID', 'Name', 'Phone', 'Barcode', 'Segment', 'Date', 'Amount', 'Tests'
  ];
  const colWidths = [15, 30, 25, 25, 25, 20, 20, 10]; // mm
  const startX = margin;
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setFillColor(102, 126, 234); // Primary color
  doc.setTextColor(255, 255, 255);
  doc.rect(startX, yPos, doc.internal.pageSize.width - 2 * margin, lineHeight, 'F');
  
  let currentX = startX;
  headers.forEach((header, index) => {
    doc.text(header, currentX + 1, yPos + 4.5);
    currentX += colWidths[index];
  });
  yPos += lineHeight;
  
  // --- Table Body ---
  doc.setFont(undefined, 'normal');
  doc.setTextColor(45, 55, 72);
  
  data.forEach((item, index) => {
    // Check for page break
    if (yPos + lineHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      // Re-draw header on new page
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.setFillColor(102, 126, 234); 
      doc.setTextColor(255, 255, 255);
      doc.rect(startX, yPos, doc.internal.pageSize.width - 2 * margin, lineHeight, 'F');
      
      currentX = startX;
      headers.forEach((header, index) => {
        doc.text(header, currentX + 1, yPos + 4.5);
        currentX += colWidths[index];
      });
      yPos += lineHeight;
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(45, 55, 72);
    }
    
    // Stripe background
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252); 
      doc.rect(startX, yPos, doc.internal.pageSize.width - 2 * margin, lineHeight, 'F');
    }
    
    doc.setFontSize(8);
    
    const testDetails = JSON.parse(item.testdetails || '[]')
    
    const rowData = [
      item.patient,
      item.patient_info?.patientname || 'N/A',
      item.patient_info?.phoneNumber || 'N/A',
      item.barcode,
      item.segment,
      new Date(item.registrationDate).toLocaleDateString(),
      `₹${item.netAmount}`,
      testDetails.length,
    ];

    currentX = startX;
    rowData.forEach((cellData, cellIndex) => {
      doc.text(String(cellData), currentX + 1, yPos + 4.5);
      currentX += colWidths[cellIndex];
    });
    
    yPos += lineHeight;
  });
  
  // --- Download ---
  doc.save(`Patient_List_Report_${startDate}_to_${endDate}.pdf`);
};