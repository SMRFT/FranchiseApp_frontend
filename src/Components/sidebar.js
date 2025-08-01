import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, X, Home, EllipsisVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogOut ,IndianRupee,UserPen,Contact,Diff} from 'lucide-react';
import { Tooltip } from 'react-tooltip'; // Optional: If using external tooltips
import {  Print, Settings, LocalShipping, FolderOpen, Description } from '@mui/icons-material';
// Main layout container
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

// Mobile Toggle Button
const MobileToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #6FB1C4, #4B9EB0);
  border: none;
  color: white;
  z-index: 1000;
  cursor: pointer;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgb(85, 156, 175), rgb(38, 136, 158));
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

// Overlay for mobile
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  opacity: ${props => (props.isOpen ? '1' : '0')};
  transition: opacity 0.3s ease-in-out;

  @media (min-width: 768px) {
    display: none;
  }
`;

const LogoutContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    transform: translateX(5px);
  }

  &:hover span {
    color: #fff;
  }

  @media (min-width: 768px) {
    justify-content: ${props => (props.isCollapsed ? 'center' : 'flex-start')};
  }
`;

const LogoutIcon = styled(LogOut)`
  color: white;
  margin-right: 15px;
`;

const LogoutText = styled.span`
  color: white;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  transition: color 0.3s ease;
`;

// Sidebar Container
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #6FB1C4 0%, #4B9EB0 100%);
  color: white;
  z-index: 999;
  transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: ${props => (props.isOpen ? '2px 0 20px rgba(0, 0, 0, 0.3)' : 'none')};
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    position: fixed;
    transform: translateX(0);
    width: ${props => (props.isCollapsed ? '80px' : '280px')};
    transition: width 0.3s ease-in-out;
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  }
`;

// Main Content Area
const MainContent = styled.main`
  flex: 1;
  min-height: 100vh;
  transition: margin-left 0.3s ease-in-out;
  background-color: white;
  
  @media (min-width: 768px) {
    margin-left: ${props => (props.isCollapsed ? '80px' : '280px')};
  }
  
  @media (max-width: 767px) {
    margin-left: 0;
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const Logo = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Pacifico', cursive;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: ${props => (props.isCollapsed ? '0' : '1')};
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 767px) {
    opacity: 1;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 15px;
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const CollapseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 15px;
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const SidebarNav = styled.nav`
  padding: 20px 0;
  flex: 1;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin: 5px 15px;
  border-radius: 15px;
  font-family: 'Roboto', sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
      border-radius: 0 4px 4px 0;
    }
  }
`;

const NavIcon = styled.div`
  margin-right: ${props => (props.isCollapsed ? '0' : '15px')};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  flex-shrink: 0;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const NavText = styled.span`
  opacity: ${props => (props.isCollapsed ? '0' : '1')};
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 767px) {
    opacity: 1;
  }
`;

// Demo content for the main area
const DemoContent = styled.div`
  padding: 40px;
  
  @media (max-width: 767px) {
    padding: 80px 20px 40px 20px; // Extra top padding for mobile toggle button
  }
`;

const SidebarLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('RegisterDetails');

  const navigate = useNavigate();

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const toggleDesktopSidebar = () => setIsDesktopCollapsed(!isDesktopCollapsed);
  const closeMobileSidebar = () => setIsMobileOpen(false);

const navItems = [
  { name: 'PatientRegisterForm', icon: Home, label: 'Patient Register' },
  { name: 'PatientList', icon: Contact, label: 'Patient List' },
  { name: 'PatientEditForm', icon: UserPen, label: 'Patient Edit' },
  { name: 'PaymentGateway', icon: IndianRupee, label: 'Payment Gateway' },
  { name: 'SampleCollection', icon: LocalShipping, label: 'Sample Collection' },
  { name: 'SampleTransfer', icon: FolderOpen, label: 'Sample Transfer' },
  { name: 'BatchGeneration', icon: Diff, label: 'Batch Generation' },
  { name: 'ReportGeneration', icon: Description, label: 'Report Generation' },
];

const pathMap = {
  PatientRegisterForm: '/PatientRegisterForm',
  PatientList: '/PatientList',
  PatientEditForm: '/PatientEditForm',
  PaymentGateway: '/PaymentGateway',
  SampleCollection: '/SampleCollection',
  SampleTransfer: '/SampleTransfer',
  BatchGeneration: '/BatchGeneration',
  ReportGeneration: '/ReportGeneration',
};


  return (
    <LayoutContainer>
      {/* Mobile Toggle Button */}
      <MobileToggleButton onClick={toggleMobileSidebar}>
        <Menu size={24} />
      </MobileToggleButton>

      {/* Overlay for mobile */}
      <Overlay isOpen={isMobileOpen} onClick={closeMobileSidebar} />

      {/* Sidebar */}
      <SidebarContainer isOpen={isMobileOpen} isCollapsed={isDesktopCollapsed}>
        <SidebarHeader>
          <Logo isCollapsed={isDesktopCollapsed}>
            {isDesktopCollapsed ? 'D' : 'Diagnostics Franchise'}
          </Logo>
          <CloseButton onClick={closeMobileSidebar}>
            <X size={24} />
          </CloseButton>
          <CollapseButton onClick={toggleDesktopSidebar}>
            <EllipsisVertical size={20} />
          </CollapseButton>
        </SidebarHeader>

        <SidebarNav>
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              className={activeItem === item.name ? 'active' : ''}
              onClick={() => {
                setActiveItem(item.name);
                closeMobileSidebar();
                navigate(pathMap[item.name]);
              }}
            >
              <NavIcon isCollapsed={isDesktopCollapsed}>
                <item.icon size={20} />
              </NavIcon>
              <NavText isCollapsed={isDesktopCollapsed}>
                {item.label}
              </NavText>
            </NavItem>
          ))}
        </SidebarNav>

        {/* Logout Button at Bottom */}
        <LogoutContainer
          isCollapsed={isDesktopCollapsed}
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
          }}
          title="Logout"
        >
          <LogoutIcon size={20} />
          {!isDesktopCollapsed && <LogoutText>Logout</LogoutText>}
        </LogoutContainer>
      </SidebarContainer>

      {/* Main Content Area */}
      <MainContent isCollapsed={isDesktopCollapsed}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default SidebarLayout;
