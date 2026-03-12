"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import styled, { keyframes } from "styled-components"
import React from 'react'

const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 100%;
  margin: 0 auto;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);


  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(75, 158, 176, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '👥';
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
    gap: 8px;
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
    border-color: #6FB1C4;
    box-shadow: 0 0 0 3px rgba(111, 177, 196, 0.2);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    font-size: 1rem;
    padding: 0.875rem 1rem;
  }
`

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #6FB1C4;
    box-shadow: 0 0 0 3px rgba(111, 177, 196, 0.2);
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    font-size: 1rem;
    padding: 0.875rem 1rem;
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
  
  background: ${props => props.$variant === 'clear'
    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
    : 'linear-gradient(135deg, #6FB1C4, #4B9EB0)'};
  
  box-shadow: 0 4px 15px ${props => props.$variant === 'clear'
    ? 'rgba(245, 158, 11, 0.3)'
    : 'rgba(75, 158, 176, 0.2)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.$variant === 'clear'
    ? 'rgba(245, 158, 11, 0.4)'
    : 'rgba(75, 158, 176, 0.3)'};
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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

const StatCard = styled.div`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(75, 158, 176, 0.2);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`

const StatLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

// Table Components
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
    background: #6FB1C4;
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    max-height: calc(100vh - 500px);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const THead = styled.thead`
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
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
    background: rgba(111, 177, 196, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const TD = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #2d3748;
  vertical-align: middle;
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
    border-color: #6FB1C4;
    box-shadow: 0 6px 20px rgba(75, 158, 176, 0.15);
    transform: translateY(-2px);
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
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
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

const GenderBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
  
  ${props => props.$gender === 'Male' && `
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  `}
  
  ${props => props.$gender === 'Female' && `
    background: linear-gradient(135deg, #ec4899, #be185d);
    color: white;
  `}
  
  ${props => props.$gender === 'Other' && `
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
  `}
`

const IdBadge = styled.span`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`

const EditButton = styled.button`
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(75, 158, 176, 0.3);
  }
  
  @media (min-width: 769px) {
    width: auto;
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
    gap: 1rem;
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
    order: 3;
  }
`

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: ${props => props.$active ? 'linear-gradient(135deg, #6FB1C4, #4B9EB0)' : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? 'linear-gradient(135deg, #6FB1C4, #4B9EB0)' : '#f7fafc'};
    border-color: #6FB1C4;
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

const PageSizeSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6FB1C4;
    box-shadow: 0 0 0 3px rgba(111, 177, 196, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
  }
`

const PageSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
    order: 2;
    flex-direction: column;
    gap: 0.5rem;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  
  &::before {
    content: '👤';
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

// Edit Form Components
const EditFormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(111, 177, 196, 0.1);
  color: #4B9EB0;
  border: 2px solid rgba(111, 177, 196, 0.2);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: rgba(111, 177, 196, 0.2);
    border-color: #4B9EB0;
    transform: translateX(-2px);
  }
  
  &::before {
    content: '←';
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
`

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6FB1C4;
    box-shadow: 0 0 0 3px rgba(111, 177, 196, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
`

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6FB1C4;
    box-shadow: 0 0 0 3px rgba(111, 177, 196, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
`

const UpdateButton = styled.button`
  grid-column: 1 / -1;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6FB1C4 0%, #4B9EB0 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(75, 158, 176, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem 2rem;
    font-size: 1.1rem;
  }
`

export default function PatientEditForm() {
  const [patients, setPatients] = useState([])
  const [currentView, setCurrentView] = useState("list")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("")

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage, setPatientsPerPage] = useState(20)

  // Sort States
  const [sortField, setSortField] = useState("patientname")
  const [sortDirection, setSortDirection] = useState("asc")

  const [formData, setFormData] = useState({
    patientname: "",
    age: "",
    gender: "",
    phoneNumber: "",
    city: "",
    area: "",
    pincode: "",
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const franchiseId = localStorage.getItem("franchise_id")
      const res = await axios.get(`${franchiseurl}allpatients/?franchise_id=${franchiseId}`)
      setPatients(res.data)
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
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

  // Filter and sort data
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber?.includes(searchTerm) ||
        patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesGender = !genderFilter || patient.gender === genderFilter

      return matchesSearch && matchesGender
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField] || ""
      let bVal = b[sortField] || ""

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [patients, searchTerm, genderFilter, sortField, sortDirection])

  const clearFilters = () => {
    setSearchTerm("")
    setGenderFilter("")
  }

  const handleEditClick = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      patientname: patient.patientname,
      age: patient.age,
      gender: patient.gender,
      phoneNumber: patient.phoneNumber || "",
      city: patient.city || "",
      area: patient.area || "",
      pincode: patient.pincode || "",
    })
    setCurrentView("edit")
  }

  const handleBackClick = () => {
    setCurrentView("list")
    setSelectedPatient(null)
  }

  const handleEditFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdatePatient = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${franchiseurl}updatepatient/${selectedPatient.patient_id}/`, formData)
      fetchPatients()
      setCurrentView("list")
      setSelectedPatient(null)
    } catch (error) {
      console.error("Error updating patient:", error)
    }
  }

  // Pagination Logic
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredAndSortedPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredAndSortedPatients.length / patientsPerPage)

  // Stats
  const stats = {
    total: filteredAndSortedPatients.length,
    male: filteredAndSortedPatients.filter(p => p.gender === "Male").length,
    female: filteredAndSortedPatients.filter(p => p.gender === "Female").length,
  }

  // Render Edit Form View
  if (currentView === "edit" && selectedPatient) {
    return (
      <Container>
        <EditFormContainer>
          <BackButton onClick={handleBackClick}>Back to Patients</BackButton>
          <Title>Edit Patient - {selectedPatient.patientname}</Title>
          <Form onSubmit={handleUpdatePatient}>
            <InputGroup>
              <Label>Patient Name</Label>
              <Input
                name="patientname"
                placeholder="Enter patient name"
                value={formData.patientname}
                onChange={handleEditFormChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Age</Label>
              <Input
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleEditFormChange}
                required
                type="number"
              />
            </InputGroup>

            <InputGroup>
              <Label>Gender</Label>
              <Select name="gender" value={formData.gender} onChange={handleEditFormChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleEditFormChange}
              />
            </InputGroup>

            <InputGroup>
              <Label>City</Label>
              <Input name="city" placeholder="Enter city" value={formData.city} onChange={handleEditFormChange} />
            </InputGroup>

            <InputGroup>
              <Label>Area</Label>
              <Input name="area" placeholder="Enter area" value={formData.area} onChange={handleEditFormChange} />
            </InputGroup>

            <InputGroup>
              <Label>Pincode</Label>
              <Input
                name="pincode"
                placeholder="Enter pincode"
                value={formData.pincode}
                onChange={handleEditFormChange}
              />
            </InputGroup>

            <UpdateButton type="submit">Update Patient</UpdateButton>
          </Form>
        </EditFormContainer>
      </Container>
    )
  }

  // Render List View (Table + Mobile Cards)
  return (
    <Container>
      <Header>
        <Title>Patient Management</Title>

        <FilterSection>
          <SearchInput
            type="text"
            placeholder="🔍 Search by name, phone, or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FilterSelect value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </FilterSelect>

          {(searchTerm || genderFilter) && (
            <ButtonGroup>
              <Button $variant="clear" onClick={clearFilters}>
                Clear Filters
              </Button>
            </ButtonGroup>
          )}
        </FilterSection>

        <StatsBar>
          <StatCard>
            <StatLabel>Total Patients</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Male</StatLabel>
            <StatValue>{stats.male}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Female</StatLabel>
            <StatValue>{stats.female}</StatValue>
          </StatCard>
        </StatsBar>
      </Header>

      <TableCard>
        {loading ? (
          <LoadingState>
            <h3>Loading patients...</h3>
            <p>Please wait while we fetch the data</p>
          </LoadingState>
        ) : filteredAndSortedPatients.length === 0 ? (
          <EmptyState>
            <h3>No patients found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </EmptyState>
        ) : (
          <>
            {/* Desktop Table View */}
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <TH $sortable onClick={() => handleSort("patient_id")}>
                      Patient ID {sortField === "patient_id" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH $sortable onClick={() => handleSort("patientname")}>
                      Name {sortField === "patientname" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH $sortable onClick={() => handleSort("age")}>
                      Age {sortField === "age" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH $sortable onClick={() => handleSort("gender")}>
                      Gender {sortField === "gender" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH>Phone</TH>
                    <TH $sortable onClick={() => handleSort("city")}>
                      City {sortField === "city" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TH>
                    <TH>Area</TH>
                    <TH>Action</TH>
                  </tr>
                </THead>
                <TBody>
                  {currentPatients.map((patient) => (
                    <TR key={patient.patient_id}>
                      <TD>
                        <IdBadge>#{patient.patient_id}</IdBadge>
                      </TD>
                      <TD><strong>{patient.patientname}</strong></TD>
                      <TD>{patient.age} years</TD>
                      <TD>
                        <GenderBadge $gender={patient.gender}>{patient.gender}</GenderBadge>
                      </TD>
                      <TD>{patient.phoneNumber || "N/A"}</TD>
                      <TD>{patient.city || "N/A"}</TD>
                      <TD>{patient.area || "N/A"}</TD>
                      <TD>
                        <EditButton onClick={() => handleEditClick(patient)}>
                          Edit
                        </EditButton>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>

            {/* Mobile Card View */}
            <MobileCardContainer>
              {currentPatients.map((patient) => (
                <MobileCard key={patient.patient_id}>
                  <MobileCardHeader>
                    <div>
                      <MobileCardTitle>{patient.patientname}</MobileCardTitle>
                      <IdBadge>#{patient.patient_id}</IdBadge>
                    </div>
                    <GenderBadge $gender={patient.gender}>{patient.gender}</GenderBadge>
                  </MobileCardHeader>

                  <MobileCardRow>
                    <MobileCardLabel>Age:</MobileCardLabel>
                    <MobileCardValue>{patient.age} years</MobileCardValue>
                  </MobileCardRow>

                  <MobileCardRow>
                    <MobileCardLabel>Phone:</MobileCardLabel>
                    <MobileCardValue>{patient.phoneNumber || "N/A"}</MobileCardValue>
                  </MobileCardRow>

                  <MobileCardRow>
                    <MobileCardLabel>City:</MobileCardLabel>
                    <MobileCardValue>{patient.city || "N/A"}</MobileCardValue>
                  </MobileCardRow>

                  <MobileCardRow>
                    <MobileCardLabel>Area:</MobileCardLabel>
                    <MobileCardValue>{patient.area || "N/A"}</MobileCardValue>
                  </MobileCardRow>

                  <div style={{ marginTop: "1rem" }}>
                    <EditButton onClick={() => handleEditClick(patient)}>
                      Edit Patient
                    </EditButton>
                  </div>
                </MobileCard>
              ))}
            </MobileCardContainer>

            <Pagination>
              <PageInfo>
                Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredAndSortedPatients.length)} of {filteredAndSortedPatients.length} patients
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

              <PageSizeWrapper>
                <span style={{ fontSize: "0.875rem", color: "#4a5568" }}>Show:</span>
                <PageSizeSelect
                  value={patientsPerPage}
                  onChange={(e) => {
                    setPatientsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </PageSizeSelect>
              </PageSizeWrapper>
            </Pagination>
          </>
        )}
      </TableCard>
    </Container>
  )
}