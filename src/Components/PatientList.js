"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import axios from "axios"
import styled, { keyframes } from "styled-components"
import headerImage from "./images/Header.png"
import FooterImage from "./images/Footer.png"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from 'html2canvas' // Import html2canvas
import { Download, Share2 } from 'lucide-react'

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; transform: translateY(-10px); }
  to { opacity: 1; max-height: 2000px; transform: translateY(0); }
`

// --- Main Container ---
const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);

  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
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
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
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
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    &::before {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    flex-direction: column;
    text-align: center;
  }
`

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const DateRangeGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`

const DateLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
`

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  background: ${props => props.$variant === 'primary'
    ? 'linear-gradient(135deg, #667eea, #764ba2)'
    : 'linear-gradient(135deg, #f59e0b, #d97706)'};
  
  box-shadow: ${props => props.$variant === 'primary'
    ? '0 4px 15px rgba(102, 126, 234, 0.3)'
    : '0 4px 15px rgba(245, 158, 11, 0.3)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'primary'
    ? '0 6px 20px rgba(102, 126, 234, 0.4)'
    : '0 6px 20px rgba(245, 158, 11, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
`

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

// Table Components (Desktop)
const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 16px;
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: calc(100vh - 450px);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
`

const THead = styled.thead`
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  z-index: 10;
`

const TH = styled.th`
  padding: 1rem;
  text-align: left;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    background: ${props => props.$sortable ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  }
`

const TBody = styled.tbody``

const TR = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const ExpandedTR = styled.tr`
  animation: ${slideDown} 0.3s ease-out;
  background: #f8fafc;
`

const TD = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #2d3748;
  vertical-align: top;
`

// Mobile Card View
const MobileCardContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    padding: 1rem;
  }
`

const MobileCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  }
`

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
`

const MobileCardTitle = styled.div`
  flex: 1;
`

const MobilePatientName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`

const MobilePatientId = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  font-family: 'Courier New', monospace;
`

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const MobileCardLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
`

const MobileCardValue = styled.span`
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 500;
  text-align: right;
`

const MobileExpandButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem;
  background: ${props => props.$expanded
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$expanded
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(59, 130, 246, 0.3)'};
  }
  
  &::before {
    content: '${props => props.$expanded ? '▼' : '▶'}';
    font-size: 0.7rem;
  }
`

const MobileTestList = styled.div`
  margin-top: 1rem;
  animation: ${slideDown} 0.3s ease-out;
`

const ExpandButton = styled.button`
  background: ${props => props.$expanded
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.$expanded
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(59, 130, 246, 0.3)'};
  }
  
  &::before {
    content: '${props => props.$expanded ? '▼' : '▶'}';
    font-size: 0.6rem;
  }
`

const TestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
    box-shadow: none;
    background: transparent;
    max-height: none;
  }
`

const TestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.$cancelled ? '#fee2e2' : '#f8fafc'};
  border-radius: 6px;
  border-left: 3px solid ${props => props.$cancelled ? '#ef4444' : '#667eea'};
  font-size: 0.85rem;
  transition: all 0.2s ease;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`

const TestName = styled.span`
  flex: 1;
  font-weight: 500;
  color: #2d3748;
  text-decoration: ${props => props.$cancelled ? 'line-through' : 'none'};
  min-width: 150px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    font-size: 0.95rem;
  }
`

const TestPrice = styled.span`
  font-weight: 600;
  color: ${props => props.$cancelled ? '#ef4444' : '#059669'};
  margin: 0 1rem;
  min-width: 80px;
  text-align: right;
  
  @media (max-width: 768px) {
    margin: 0;
    font-size: 1rem;
  }
`

const CancelButton = styled.button`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.35rem 0.7rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    min-width: 90px;
  }
`

const CancelledBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 0.35rem 0.7rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 70px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    min-width: 90px;
  }
`

const Badge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
  
  ${props => props.$type === 'barcode' && `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    font-family: 'Courier New', monospace;
  `}
  
  ${props => props.$type === 'segment-home' && `
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  `}
  
  ${props => props.$type === 'segment-walkin' && `
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  `}
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.7rem;
  }
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 2px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`

const PageInfo = styled.div`
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
    order: 1;
  }
`

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
    order: 2;
  }
`

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f7fafc'};
    border-color: #667eea;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
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
  
  h3 {
    margin-bottom: 0.5rem;
    color: #2d3748;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    
    &::before {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.25rem;
    }
    
    p {
      font-size: 0.875rem;
    }
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
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: #2d3748;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    
    &::before {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.25rem;
    }
    
    p {
      font-size: 0.875rem;
    }
  }
`
const DownloadButton = styled(Button)`
  padding: 0.4rem 0.8rem; /* Adjusted for smaller icon button */
  font-size: 0.75rem; /* Adjusted for smaller icon button */
  background: linear-gradient(135deg, #059669, #047857); /* Green color for download */
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
`;

const WhatsAppButton = styled.button`
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.875rem;
    font-size: 0.9rem;
    justify-content: center;
  }
`

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px; /* Added spacing from ExpandButton */
  
  @media (min-width: 769px) {
    /* Desktop alignment - ensures buttons are side-by-side */
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 0.5rem;
    
    button {
      flex: 1;
    }
  }
`

// Helper functions
const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0]
}

const parseTestDetails = (testdetailsString) => {
  try {
    if (typeof testdetailsString === "string") {
      return JSON.parse(testdetailsString)
    } else if (Array.isArray(testdetailsString)) {
      return testdetailsString
    }
    return []
  } catch (error) {
    console.error("Error parsing testdetails:", error)
    return []
  }
}

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)}`;

// PDF Helpers
const addHeader = (doc, pageWidth) => {
  try {
    doc.addImage(headerImage, "PNG", 0, 0, pageWidth, 80);
  } catch (e) {
    console.log("Header error", e);
  }
};

const addFooter = (doc, pageWidth, pageHeight) => {
  try {
    const footerHeight = 60;
    doc.addImage(FooterImage, "PNG", 0, pageHeight - footerHeight, pageWidth, footerHeight);
  } catch (e) {
    console.log("Footer error", e);
  }
};

// Helper: convert number to words (Indian Rupees)
const convertAmountToWords = (amount) => {
  if (amount == null || isNaN(amount)) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const numToWords = (num) => {
    num = Number(num);
    if (num === 0) return "";
    if (num < 20) return ones[num];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    }
    if (num < 1000) {
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " and " + numToWords(num % 100) : "")
      );
    }
    if (num < 100000) {
      return (
        numToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? " " + numToWords(num % 1000) : "")
      );
    }
    if (num < 10000000) {
      return (
        numToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + numToWords(num % 100000) : "")
      );
    }
    return (
      numToWords(Math.floor(num / 10000000)) +
      " Crore" +
      (num % 10000000 ? " " + numToWords(num % 10000000) : "")
    );
  };

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = "";
  if (rupees === 0 && paise === 0) {
    return "Zero Rupees Only";
  }

  if (rupees > 0) {
    words += numToWords(rupees) + " Rupees";
  }

  if (paise > 0) {
    words += (words ? " and " : "") + numToWords(paise) + " Paise";
  }

  return words + " Only";
};

const generatePDFBlob = (item) => {
  const testDetails = parseTestDetails(item.testdetails || "[]");
  const patientName = (item.patient_info?.patientname || "N/A").trim();
  const patientId = item.patient || "N/A";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [221, 231, 255];
  const primaryAccent = [102, 126, 234];
  const secondaryColor = [220, 249, 235];
  const secondaryAccent = [16, 185, 129];
  const textColor = [45, 55, 72];
  const lightGray = [248, 250, 252];

  // Add header
  addHeader(doc, pageWidth);
  let cursorY = 92;

  // Title band
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, cursorY, contentWidth, 34, 4, 4, "F");
  doc.setTextColor(...primaryAccent);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT BILL / INVOICE", pageWidth / 2, cursorY + 22, { align: "center" });

  cursorY += 48;

  // Info boxes
  const boxHeight = 110;
  const leftBoxX = margin;
  const leftBoxWidth = (contentWidth / 2) - 10;
  const rightBoxX = leftBoxX + leftBoxWidth + 20;
  const rightBoxWidth = leftBoxWidth;

  // Left Box - Patient Details
  doc.setFillColor(...lightGray);
  doc.roundedRect(leftBoxX, cursorY, leftBoxWidth, boxHeight, 4, 4, "F");
  doc.setFillColor(...primaryAccent);
  doc.roundedRect(leftBoxX, cursorY, leftBoxWidth, 24, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT DETAILS", leftBoxX + 10, cursorY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  let detailY = cursorY + 38;

  const patientDetails = [
    ["Name", patientName],
    ["Patient ID", patientId],
    ["Phone", item.patient_info?.phoneNumber || "N/A"],
    ["Email", item.patient_info?.email || "N/A"]
  ];

  patientDetails.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", leftBoxX + 10, detailY);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), leftBoxX + 92, detailY);
    detailY += 16;
  });

  // Right Box - Bill Details
  doc.setFillColor(...lightGray);
  doc.roundedRect(rightBoxX, cursorY, rightBoxWidth, boxHeight, 4, 4, "F");
  doc.setFillColor(...primaryAccent);
  doc.roundedRect(rightBoxX, cursorY, rightBoxWidth, 24, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("BILL DETAILS", rightBoxX + 10, cursorY + 16);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  detailY = cursorY + 38;

  const billNo = item.bill_no || item.barcode || "N/A";
  const regDate = item.registrationDate
    ? new Date(item.registrationDate).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
    : "N/A";

  const billDetails = [
    ["Bill No", billNo],
    ["Date", regDate],
    ["Segment", item.segment || "Walk-in"],
    ["Payment", item.paymentMode || "Cash"]
  ];

  billDetails.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", rightBoxX + 10, detailY);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), rightBoxX + 92, detailY);
    detailY += 16;
  });

  cursorY += boxHeight + 18;

  // TEST DETAILS Header
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, cursorY, contentWidth, 28, 4, 4, "F");
  doc.setTextColor(...primaryAccent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TEST DETAILS", margin + 10, cursorY + 18);

  cursorY += 36;

  // Build table
  const tableBody = testDetails.map((test, i) => {
    const status = ['Cancel Requested', 'Cancelled', 'cancelled'].includes(test.status)
      ? 'Cancelled'
      : (test.approve ? 'Approved' : 'Pending');
    return [
      i + 1,
      String(test.test_name || test.testname || "Unnamed Test"),
      Number(test.MRP || 0),
      status
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    head: [["S.No", "Test Name", "Amount"]],
    body: tableBody,
    theme: "grid",
    margin: { left: margin, right: margin, bottom: 100 },
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: textColor,
    },
    headStyles: {
      fillColor: [235, 241, 255],
      textColor: primaryAccent,
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 40, halign: "center", fontStyle: "bold" },
      1: { cellWidth: contentWidth * 0.6, halign: "left" },
      2: { cellWidth: contentWidth * 0.18, halign: "right", fontStyle: "bold" },
      3: { cellWidth: contentWidth * 0.12, halign: "center" },
    },
    didDrawPage: (data) => {
      addHeader(doc, pageWidth);
      addFooter(doc, pageWidth, pageHeight);
      const totalPages = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(`Page ${data.pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 48, { align: "right" });
    },
  });

  // Payment Summary
  const finalY = doc.lastAutoTable.finalY + 12;
  const summaryBoxWidth = 260;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(...secondaryColor);
  doc.roundedRect(summaryBoxX, finalY, summaryBoxWidth, 90, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...secondaryAccent);
  doc.text("PAYMENT SUMMARY", summaryBoxX + 12, finalY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  const subtotal = Number(item.total || 0);
  const discountAmount = Number(item.discountAmount || 0);
  const netPayable = Number(item.netAmount || 0);

  let sy = finalY + 36;
  doc.text("Subtotal", summaryBoxX + 12, sy);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(subtotal), summaryBoxX + summaryBoxWidth - 12, sy, { align: "right" });

  sy += 18;
  doc.setFont("helvetica", "normal");
  doc.text(`Discount (${item.discountPercentage || 0}%)`, summaryBoxX + 12, sy);
  doc.setTextColor(200, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text(`- ${formatCurrency(discountAmount)}`, summaryBoxX + summaryBoxWidth - 12, sy, { align: "right" });

  sy += 24;
  doc.setFillColor(245, 249, 247);
  doc.roundedRect(summaryBoxX, sy - 12, summaryBoxWidth, 34, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text("NET PAYABLE", summaryBoxX + 12, sy + 8);
  doc.text(formatCurrency(netPayable), summaryBoxX + summaryBoxWidth - 12, sy + 8, { align: "right" });

  // 🔹 Amount in words
  const amountInWords = convertAmountToWords(netPayable);
  let wordsY = finalY + 110;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text("Amount in Words:", margin, wordsY);

  doc.setFont("helvetica", "normal");
  const wordsText = doc.splitTextToSize(amountInWords, pageWidth - margin * 2 - 100);
  doc.text(wordsText, margin + 105, wordsY);

  // Footer
  addFooter(doc, pageWidth, pageHeight);

  return doc.output('blob');
};


// Main Component
const PatientList = () => {
  const [startDate, setStartDate] = useState(getCurrentDate())
  const [endDate, setEndDate] = useState(getCurrentDate())
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState("registrationDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const itemsPerPage = 20

  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

  const handleFetch = async () => {
    const franchise_id = localStorage.getItem("franchise_id") || "SHF004"
    if (!franchise_id || !startDate || !endDate) return

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date")
      return
    }

    setLoading(true)
    try {
      const response = await axios.get(`${franchiseurl}registrations/`, {
        params: {
          franchise_id,
          start_date: startDate,
          end_date: endDate,
        },
      })
      setData(response.data)
      setCurrentPage(1)
      setExpandedRows(new Set())
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      handleFetch()
    }
  }, [])

  const handleClearDates = () => {
    const today = getCurrentDate()
    setStartDate(today)
    setEndDate(today)
    setData([])
    setSearchQuery("")
    setCurrentPage(1)
    setExpandedRows(new Set())
  }

  const toggleRow = (item) => {
    const rowKey = `${item.patient_id}-${item.registrationDate}-${item.barcode}`
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey)
      } else {
        newSet.add(rowKey)
      }
      return newSet
    })
  }

  const handleCancelTest = async (item, testId) => {
    try {
      await axios.patch(`${franchiseurl}test-cancel-request/`, {
        patient_id: item.patient_id,
        created_date: item.created_date || item.registrationDate,
        test_ids: [testId],
      })

      const createdDate = item.created_date || item.registrationDate
      setData(prevData =>
        prevData.map(p =>
          p.patient_id === item.patient_id && (p.created_date || p.registrationDate) === createdDate && p.barcode === item.barcode
            ? {
              ...p,
              testdetails: parseTestDetails(p.testdetails).map(t =>
                t.test_id === testId ? { ...t, status: "Cancel Requested" } : t
              ),
            }
            : p
        )
      )
    } catch (error) {
      console.error("Error requesting cancellation:", error)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const query = searchQuery.toLowerCase()
      return (
        item.patient_id?.toLowerCase().includes(query) ||
        item.patient_info?.patientname?.toLowerCase().includes(query) ||
        item.patient_info?.phoneNumber?.includes(query) ||
        item.barcode?.toLowerCase().includes(query)
      )
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === "patientname") {
        aVal = a.patient_info?.patientname || ""
        bVal = b.patient_info?.patientname || ""
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [data, searchQuery, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = {
    totalRegistrations: data.length,
    totalRevenue: data.reduce((sum, item) => sum + (parseFloat(item.netAmount) || 0), 0),
    totalTests: data.reduce((sum, item) => sum + parseTestDetails(item.testdetails).length, 0)
  }

  // Download PDF directly
  const handleDownloadPdf = (item) => {
    setLoading(true);
    const patientName = (item.patient_info?.patientname || "N/A").trim();
    const patientId = item.patient || "N/A";
    const filename = `${patientId}_${patientName.replace(/\s+/g, "_")}_Bill.pdf`;

    try {
      const pdfBlob = generatePDFBlob(item);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
      alert('Failed to generate/download PDF. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Send via WhatsApp
  const handleSendViaWhatsApp = async (item) => {
    try {
      setLoading(true);

      // 1. Generate PDF
      const pdfBlob = generatePDFBlob(item);

      // 2. Upload to GridFS
      const formData = new FormData();
      const patientName = (item.patient_info?.patientname || "N/A").trim();
      const patientId = item.patient || "N/A";
      const filename = `${patientId}_${patientName.replace(/\s+/g, "_")}_Bill.pdf`;

      formData.append('file', pdfBlob, filename);

      const uploadResponse = await axios.post(
        `${franchiseurl}upload-pdf/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!uploadResponse.data.file_url) {
        throw new Error('Failed to upload PDF');
      }

      const pdfUrl = uploadResponse.data.file_url;

      // 3. Prepare WhatsApp data
      const phoneNumber = item.patient_info?.phoneNumber || '';

      if (!phoneNumber) {
        alert('Phone number not available for this patient');
        setLoading(false);
        return;
      }

      // Format phone number (remove spaces, add country code)
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      const contact = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;

      const regDate = item.registrationDate
        ? new Date(item.registrationDate).toLocaleDateString('en-IN')
        : new Date().toLocaleDateString('en-IN');

      const regTime = item.registrationDate
        ? new Date(item.registrationDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      const testDetails = parseTestDetails(item.testdetails || "[]");
      const testNames = testDetails.map(t => t.test_name || t.testname).join(', ');

      // 4. Send WhatsApp message
      const whatsappPayload = {
        contact: contact,
        name: patientName,
        date: regDate,
        time: regTime,
        product: testNames || "Diagnostic Tests",
        amount: item.netAmount || "0",
        link: pdfUrl,
        phone: "6369131631", // Your support phone
        template: "franchise_bill"
      };

      const whatsappResponse = await axios.post(
        `${franchiseurl}send-whatsapp-template/`,
        whatsappPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (whatsappResponse.data.status_code === 200) {
        alert('Bill sent successfully via WhatsApp!');
      } else {
        console.error('WhatsApp API response:', whatsappResponse.data);
        alert('Bill generated but WhatsApp sending failed. Please try again.');
      }

    } catch (error) {
      console.error('Error sending via WhatsApp:', error);
      alert('Failed to send bill via WhatsApp. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container>
      <Header>
        <Title>Patient Test Management</Title>

        <FilterSection>
          <DateRangeGroup>
            <DateInputWrapper>
              <DateLabel>Start Date</DateLabel>
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </DateInputWrapper>
            <DateInputWrapper>
              <DateLabel>End Date</DateLabel>
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </DateInputWrapper>
          </DateRangeGroup>

          <SearchInput
            type="text"
            placeholder="🔍 Search by Patient ID, Name, Phone, Barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ButtonGroup>
            <Button $variant="primary" onClick={handleFetch} disabled={loading}>
              {loading ? "Loading..." : "Fetch Data"}
            </Button>
            <Button onClick={handleClearDates}>
              Clear
            </Button>
          </ButtonGroup>
        </FilterSection>

        {data.length > 0 && (
          <StatsBar>
            <StatCard>
              <StatLabel>Total Registrations</StatLabel>
              <StatValue>{stats.totalRegistrations}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Tests</StatLabel>
              <StatValue>{stats.totalTests}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Revenue</StatLabel>
              <StatValue>₹{stats.totalRevenue.toFixed(2)}</StatValue>
            </StatCard>
          </StatsBar>
        )}
      </Header>

      <TableCard>
        {loading ? (
          <LoadingState>
            <h3>Loading registrations...</h3>
            <p>Please wait while we fetch the data</p>
          </LoadingState>
        ) : filteredAndSortedData.length === 0 ? (
          <EmptyState>
            <h3>No registrations found</h3>
            <p>No registrations were found for the selected criteria</p>
          </EmptyState>
        ) : (
          <>
            {/* Desktop Table View */}
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <TH>Action</TH>
                    <TH $sortable onClick={() => handleSort("patient")}>
                      Patient ID {sortField === "patient" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH $sortable onClick={() => handleSort("patientname")}>
                      Patient Name {sortField === "patientname" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH>Phone</TH>
                    <TH>Barcode</TH>
                    <TH>Segment</TH>
                    <TH $sortable onClick={() => handleSort("registrationDate")}>
                      Reg. Date {sortField === "registrationDate" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH>Tests</TH>
                    <TH>Net Amount</TH>
                  </tr>
                </THead>
                <TBody>
                  {paginatedData.map((item, index) => {
                    const testDetails = parseTestDetails(item.testdetails)
                    const rowKey = `${item.patient_id}-${item.registrationDate}-${item.barcode}`
                    const isExpanded = expandedRows.has(rowKey)

                    return (
                      <React.Fragment key={rowKey}>
                        <TR>
                          <TD>
                            <ExpandButton
                              onClick={() => toggleRow(item)}
                              $expanded={isExpanded}
                            >
                              {isExpanded ? "Hide" : "Show"}
                            </ExpandButton>
                            <ActionButtonGroup>
                              <DownloadButton onClick={() => handleDownloadPdf(item)} title="Download PDF">
                                <Download size={14} />
                                <span>PDF</span>
                              </DownloadButton>
                              <WhatsAppButton
                                onClick={() => handleSendViaWhatsApp(item)}
                                disabled={!item.patient_info?.phoneNumber || loading}
                                title="Send via WhatsApp"
                              >
                                <Share2 size={14} />
                                <span>WhatsApp</span>
                              </WhatsAppButton>
                            </ActionButtonGroup>
                          </TD>
                          <TD><strong>{item.patient}</strong></TD>
                          <TD>{item.patient_info?.patientname || "N/A"}</TD>
                          <TD>{item.patient_info?.phoneNumber || "N/A"}</TD>
                          <TD>
                            <Badge $type="barcode">{item.barcode}</Badge>
                          </TD>
                          <TD>
                            <Badge $type={item.segment === "Home Collection" ? "segment-home" : "segment-walkin"}>
                              {item.segment === "Home Collection" ? "🏠" : "🚶"} {item.segment}
                            </Badge>
                          </TD>
                          <TD>{new Date(item.registrationDate).toLocaleDateString()}</TD>
                          <TD><strong>{testDetails.length}</strong></TD>
                          <TD><strong>₹{item.netAmount}</strong></TD>
                        </TR>
                        {isExpanded && (
                          <ExpandedTR>
                            <TD colSpan="9" style={{ padding: 0 }}>
                              <TestList>
                                {testDetails.length === 0 ? (
                                  <div style={{ textAlign: 'center', color: '#718096', padding: '1rem' }}>
                                    No tests found
                                  </div>
                                ) : (
                                  testDetails.map((test, testIndex) => {
                                    const isCancelled = ["Cancel Requested", "Cancelled", "cancelled"].includes(test.status)

                                    return (
                                      <TestItem key={testIndex} $cancelled={isCancelled}>
                                        <TestName $cancelled={isCancelled}>
                                          {testIndex + 1}. {test.test_name}
                                        </TestName>
                                        <TestPrice $cancelled={isCancelled}>₹{test.MRP}</TestPrice>
                                        {isCancelled ? (
                                          <CancelledBadge>Cancelled</CancelledBadge>
                                        ) : (
                                          <CancelButton onClick={() => handleCancelTest(item, test.test_id)}>
                                            Cancel
                                          </CancelButton>
                                        )}
                                      </TestItem>
                                    )
                                  })
                                )}
                              </TestList>
                            </TD>
                          </ExpandedTR>
                        )}
                      </React.Fragment>
                    )
                  })}
                </TBody>
              </Table>
            </TableWrapper>

            {/* Mobile Card View */}
            <MobileCardContainer>
              {paginatedData.map((item) => {
                const testDetails = parseTestDetails(item.testdetails)
                const rowKey = `${item.patient_id}-${item.registrationDate}-${item.barcode}`
                const isExpanded = expandedRows.has(rowKey)

                return (
                  <MobileCard key={rowKey}>
                    <MobileCardHeader>
                      <MobileCardTitle>
                        <MobilePatientName>{item.patient_info?.patientname || "N/A"}</MobilePatientName>
                        <MobilePatientId>#{item.patient}</MobilePatientId>
                      </MobileCardTitle>
                      <Badge $type={item.segment === "Home Collection" ? "segment-home" : "segment-walkin"}>
                        {item.segment === "Home Collection" ? "🏠" : "🚶"}
                      </Badge>
                    </MobileCardHeader>

                    <MobileCardRow>
                      <MobileCardLabel>Phone:</MobileCardLabel>
                      <MobileCardValue>{item.patient_info?.phoneNumber || "N/A"}</MobileCardValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileCardLabel>Barcode:</MobileCardLabel>
                      <MobileCardValue>
                        <Badge $type="barcode">{item.barcode}</Badge>
                      </MobileCardValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileCardLabel>Date:</MobileCardLabel>
                      <MobileCardValue>{new Date(item.registrationDate).toLocaleDateString()}</MobileCardValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileCardLabel>Tests:</MobileCardLabel>
                      <MobileCardValue><strong>{testDetails.length}</strong></MobileCardValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileCardLabel>Net Amount:</MobileCardLabel>
                      <MobileCardValue><strong>₹{item.netAmount}</strong></MobileCardValue>
                    </MobileCardRow>

                    <ActionButtonGroup>
                      <DownloadButton onClick={() => handleDownloadPdf(item)} title="Download PDF">
                        <Download size={14} />
                        <span>Download Bill PDF</span>
                      </DownloadButton>
                      <WhatsAppButton
                        onClick={() => handleSendViaWhatsApp(item)}
                        disabled={!item.patient_info?.phoneNumber || loading}
                        title="Send via WhatsApp"
                      >
                        <Share2 size={14} />
                        <span>Share on WhatsApp</span>
                      </WhatsAppButton>
                    </ActionButtonGroup>

                    <MobileExpandButton
                      onClick={() => toggleRow(item)}
                      $expanded={isExpanded}
                    >
                      {isExpanded ? "Hide Tests" : "Show Tests"}
                    </MobileExpandButton>


                    {isExpanded && (
                      <MobileTestList>
                        {testDetails.length === 0 ? (
                          <div style={{ textAlign: 'center', color: '#718096', padding: '1rem' }}>
                            No tests found
                          </div>
                        ) : (
                          testDetails.map((test, testIndex) => {
                            const isCancelled = ["Cancel Requested", "Cancelled", "cancelled"].includes(test.status)

                            return (
                              <TestItem key={testIndex} $cancelled={isCancelled}>
                                <TestName $cancelled={isCancelled}>
                                  {testIndex + 1}. {test.test_name}
                                </TestName>
                                <TestPrice $cancelled={isCancelled}>₹{test.MRP}</TestPrice>
                                {isCancelled ? (
                                  <CancelledBadge>Cancelled</CancelledBadge>
                                ) : (
                                  <CancelButton onClick={() => handleCancelTest(item, test.test_id)}>
                                    Cancel
                                  </CancelButton>
                                )}
                              </TestItem>
                            )
                          })
                        )}
                      </MobileTestList>
                    )}
                  </MobileCard>
                )
              })}
            </MobileCardContainer>

            <Pagination>
              <PageInfo>
                Showing **{(currentPage - 1) * itemsPerPage + 1}** to **{Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}** of **{filteredAndSortedData.length}** registrations
              </PageInfo>
              <PageButtons>
                <PageButton
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </PageButton>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </PageButton>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <PageButton
                      key={pageNum}
                      $active={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PageButton>
                  )
                })}
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
                <PageButton
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </PageButton>
              </PageButtons>
            </Pagination>
          </>
        )}
      </TableCard>
    </Container>
  )
}

export default PatientList