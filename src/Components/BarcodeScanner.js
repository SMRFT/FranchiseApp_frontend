"use client"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { Html5Qrcode } from "html5-qrcode"

// Animations
const scannerFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

const scanLineAnimation = keyframes`
  0% { top: 10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
`

// Styled Components
const ScannerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${scannerFadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`

const ScannerModal = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  border: 1px solid rgba(255, 255, 255, 0.4);
`

const ScannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`

const ScannerTitle = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.025em;

  &::before {
    content: '📷';
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
`

const CloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  color: #64748b;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #ef4444;
    transform: rotate(90deg);
  }
`

const ScannerViewport = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e2e8f0;
  background: #000;

  #reader {
    width: 100%;
    min-height: 250px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    width: 80%;
    height: 3px;
    background: #10b981;
    box-shadow: 0 0 10px #10b981, 0 0 20px #10b981;
    animation: ${scanLineAnimation} 3s infinite linear;
    z-index: 10;
    border-radius: 3px;
    pointer-events: none;
  }
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #ef4444;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`

const ScanResult = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  animation: ${scannerFadeIn} 0.3s ease-out;
`

const ScanResultCode = styled.div`
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #15803d;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
`

// Main Barcode Scanner Component
const BarcodeScanner = ({ onClose, onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const processedBarcodes = useRef(new Set())
  const scannerRef = useRef(null)
  const onScanSuccessRef = useRef(onScanSuccess)

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess
  }, [onScanSuccess])

  useEffect(() => {
    let isMounted = true

    // Initialize with lower-level Html5Qrcode API
    const html5QrCode = new Html5Qrcode("reader")
    scannerRef.current = html5QrCode

    const onScanSuccessHandler = (decodedText, decodedResult) => {
      if (processedBarcodes.current.has(decodedText)) return
      processedBarcodes.current.add(decodedText)

      setScanResult({
        code: decodedText,
        timestamp: new Date().toLocaleTimeString(),
      })

      if (onScanSuccessRef.current) {
        onScanSuccessRef.current(decodedText)
      }
    }

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 350, height: 200 },
          },
          onScanSuccessHandler,
          (errorMessage) => {
            // Ignore frame-level errors
          }
        )
      } catch (err) {
        console.warn("Environment camera failed, trying user camera", err)
        if (!isMounted) return

        try {
          // Fallback to front camera
          await html5QrCode.start(
            { facingMode: "user" },
            { fps: 10, qrbox: { width: 350, height: 200 } },
            onScanSuccessHandler,
            () => { }
          )
        } catch (fallbackErr) {
          console.error("Failed to access any camera", fallbackErr)
          if (isMounted) setErrorMsg("Could not access camera. Please allow camera permissions in your browser settings (Top Left of URL Bar).")
        }
      }
    }

    // Delay start slightly to ensure DOM is ready before injection
    setTimeout(() => {
      if (isMounted) startScanner()
    }, 200)

    // Cleanup
    return () => {
      isMounted = false
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear()
        }).catch(err => console.log("Stop error", err))
      } else {
        html5QrCode.clear()
      }
    }
  }, [])

  return (
    <ScannerOverlay>
      <ScannerModal>
        <ScannerHeader>
          <ScannerTitle>Barcode Scanner</ScannerTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ScannerHeader>

        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

        <ScannerViewport>
          <div id="reader"></div>
        </ScannerViewport>

        {scanResult && (
          <ScanResult>
            <ScanResultCode>{scanResult.code}</ScanResultCode>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "10px", fontWeight: 600 }}>
              Scanned at: {scanResult.timestamp}
            </div>
          </ScanResult>
        )}
      </ScannerModal>
    </ScannerOverlay>
  )
}

export default BarcodeScanner