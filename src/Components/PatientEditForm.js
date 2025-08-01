"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styled, { keyframes } from "styled-components"

const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0); /* Slightly darker on hover */
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
`

const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '👥';
    font-size: 2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const SearchAndFilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    flex-direction: column;
  }
`

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  
  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`

const FilterSelect = styled.select`
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`

const ClearButton = styled.button`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`

const StatChip = styled.div`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '${(props) => props.icon || "📊"}';
    font-size: 1rem;
  }
`

const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const PatientCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`

const PatientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const PatientName = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
`

const PatientId = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`

const PatientDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const DetailValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d3748;
`

const GenderBadge = styled.span`
  background: ${(props) => (props.gender === "Male" ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : props.gender === "Female" ? "linear-gradient(135deg, #ec4899, #be185d)" : "linear-gradient(135deg, #6b7280, #4b5563)")};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
`

// Pagination Components
const PaginationContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const PaginationInfo = styled.div`
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
`

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 2px solid ${(props) => (props.active ? "#667eea" : "#e2e8f0")};
  background: ${(props) => (props.active ? "linear-gradient(135deg, #667eea, #764ba2)" : "white")};
  color: ${(props) => (props.active ? "white" : "#4a5568")};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: #667eea;
    background: ${(props) => (props.active ? "linear-gradient(135deg, #667eea, #764ba2)" : "#f7fafc")};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const PageSizeSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

// Loading and Empty States
const LoadingCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  height: 200px;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 600px;
  animation: ${shimmer} 1.5s infinite;
`

const EmptyState = styled.div`
  grid-column: 1 / -1;
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
    color: #4a5568;
    margin-bottom: 0.5rem;
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
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
    transform: translateX(-2px);
  }
  
  &::before {
    content: '←';
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
  margin-bottom: 0.25rem;
`

const Input = styled.input`
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  
  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`

const Select = styled.select`
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`

const UpdateButton = styled.button`
  grid-column: 1 / -1;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`

export default function PatientEditForm() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [currentView, setCurrentView] = useState("list")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage, setPatientsPerPage] = useState(12)

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

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm, genderFilter, cityFilter])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, genderFilter, cityFilter])

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

  const filterPatients = () => {
    const filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber?.includes(searchTerm) ||
        patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesGender = !genderFilter || patient.gender === genderFilter
      const matchesCity = !cityFilter || patient.city?.toLowerCase().includes(cityFilter.toLowerCase())

      return matchesSearch && matchesGender && matchesCity
    })

    setFilteredPatients(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setGenderFilter("")
    setCityFilter("")
  }

  const handleCardClick = (patient) => {
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
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Get unique cities for filter
  const uniqueCities = [...new Set(patients.map((p) => p.city).filter(Boolean))]

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

  // Render List View (Default)
  return (
    <Container>
      <Header>
        <Title>Patient Management</Title>

        <SearchAndFilterSection>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search by name, phone, or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FilterSelect value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </FilterSelect>

            {/* <FilterSelect value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </FilterSelect> */}

            {(searchTerm || genderFilter || cityFilter) && (
              <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
            )}
          </SearchContainer>

          <StatsContainer>
            <StatChip icon="👥">{filteredPatients.length} Patients</StatChip>
            <StatChip icon="👨">{filteredPatients.filter((p) => p.gender === "Male").length} Male</StatChip>
            <StatChip icon="👩">{filteredPatients.filter((p) => p.gender === "Female").length} Female</StatChip>
          </StatsContainer>
        </SearchAndFilterSection>
      </Header>

      <PatientGrid>
        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => <LoadingCard key={index} />)
        ) : currentPatients.length === 0 ? (
          <EmptyState>
            <h3>No patients found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </EmptyState>
        ) : (
          currentPatients.map((patient, index) => (
            <PatientCard
              key={patient.patientId}
              onClick={() => handleCardClick(patient)}
              delay={`${0.1 * (index % 12)}s`}
            >
              <PatientHeader>
                <PatientName>{patient.patientname}</PatientName>
                <PatientId>#{patient.patient_id}</PatientId>
              </PatientHeader>

              <PatientDetails>
                <DetailItem>
                  <DetailLabel>Age</DetailLabel>
                  <DetailValue>{patient.age} years</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Gender</DetailLabel>
                  <GenderBadge gender={patient.gender}>{patient.gender}</GenderBadge>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>Phone</DetailLabel>
                  <DetailValue>{patient.phoneNumber || "N/A"}</DetailValue>
                </DetailItem>

                <DetailItem>
                  <DetailLabel>City</DetailLabel>
                  <DetailValue>{patient.city || "N/A"}</DetailValue>
                </DetailItem>
              </PatientDetails>
            </PatientCard>
          ))
        )}
      </PatientGrid>

      {/* Pagination */}
      {filteredPatients.length > 0 && (
        <PaginationContainer>
          <PaginationInfo>
            Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredPatients.length)} of{" "}
            {filteredPatients.length} patients
          </PaginationInfo>

          <PaginationControls>
            <PageButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              ←
            </PageButton>

            {getPageNumbers().map((number, index) => (
              <PageButton
                key={index}
                active={number === currentPage}
                onClick={() => typeof number === "number" && paginate(number)}
                disabled={number === "..."}
              >
                {number}
              </PageButton>
            ))}

            <PageButton onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              →
            </PageButton>
          </PaginationControls>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#4a5568" }}>Show:</span>
            <PageSizeSelect
              value={patientsPerPage}
              onChange={(e) => {
                setPatientsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </PageSizeSelect>
          </div>
        </PaginationContainer>
      )}
    </Container>
  )
}
