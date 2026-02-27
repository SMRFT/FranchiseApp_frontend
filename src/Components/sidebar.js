import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, X, Home, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, IndianRupee, UserPen, Contact, Diff, TrendingUp, Activity } from 'lucide-react';
import { Print, Settings, LocalShipping, FolderOpen, Description } from '@mui/icons-material';

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
  margin-right: ${props => (props.isCollapsed ? '0' : '15px')};
  
  @media (max-width: 767px) {
    margin-right: 15px;
  }
`;

const LogoutText = styled.span`
  color: white;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  opacity: ${props => (props.isCollapsed ? '0' : '1')};
  width: ${props => (props.isCollapsed ? '0' : 'auto')};
  overflow: hidden;
  white-space: nowrap;
  
  @media (max-width: 767px) {
    opacity: 1;
    width: auto;
  }
`;

// Sidebar Container
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => (props.isCollapsed ? '80px' : '280px')};
  background: linear-gradient(180deg, #6FB1C4 0%, #4B9EB0 100%);
  color: white;
  z-index: 999;
  transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  transition: all 0.3s ease-in-out;
  box-shadow: ${props => (props.isOpen ? '2px 0 20px rgba(0, 0, 0, 0.3)' : 'none')};
  overflow-y: ${props => (props.isCollapsed ? 'visible' : 'auto')};
  overflow-x: ${props => (props.isCollapsed ? 'visible' : 'hidden')};
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    transform: translateX(0);
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 767px) {
    width: 280px;
    overflow-y: auto;
    overflow-x: hidden;
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
  display: flex;
  align-items: center;
  justify-content: center;

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
  
  @media (min-width: 768px) {
    justify-content: ${props => (props.isCollapsed ? 'center' : 'flex-start')};
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
  
  @media (max-width: 767px) {
    margin-right: 15px;
  }
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
  width: ${props => (props.isCollapsed ? '0' : 'auto')};

  @media (max-width: 767px) {
    opacity: 1;
    width: auto;
  }
`;

// Tooltip for collapsed state
const Tooltip = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  ${NavItem}:hover & {
    opacity: ${props => (props.show ? '1' : '0')};
  }
  
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.9);
  }
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const SidebarLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // Default expanded

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const toggleDesktopSidebar = () => setIsDesktopCollapsed(!isDesktopCollapsed);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const navGroups = [
    {
      title: 'Patient Management',
      items: [
        { name: 'PatientRegisterForm', icon: Home, label: 'Register Patient' },
        { name: 'PatientList', icon: Contact, label: 'Patient List' },
        { name: 'PatientEditForm', icon: UserPen, label: 'Edit Patient' },
        { name: 'DuePatients', icon: Print, label: 'Due Patients' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'SampleCollection', icon: LocalShipping, label: 'Sample Collection' },
        { name: 'SampleTransfer', icon: FolderOpen, label: 'Sample Transfer' },
        { name: 'BatchGeneration', icon: Diff, label: 'Batch Generation' },
      ]
    },
    {
      title: 'Finance & Reports',
      items: [
        { name: 'PaymentGateway', icon: IndianRupee, label: 'Payment Gateway' },
        { name: 'Accounts', icon: TrendingUp, label: 'Accounts Revenue' },
        { name: 'ReportGeneration', icon: Description, label: 'Reports Dashboard' },
        { name: 'ReferralReport', icon: Description, label: 'Referral Report' },
        { name: 'CashTally', icon: Activity, label: 'Daily Cash Tally' },
      ]
    },
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
    DuePatients: '/DuePatients',
    Accounts: '/Accounts',
    ReferralReport: '/ReferralReport',
    CashTally: '/CashTally',
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
            {isDesktopCollapsed ? 'DF' : 'Diagnostics Franchise'}
          </Logo>
          <CloseButton onClick={closeMobileSidebar}>
            <X size={24} />
          </CloseButton>
          <CollapseButton onClick={toggleDesktopSidebar}>
            {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </CollapseButton>
        </SidebarHeader>

        <SidebarNav>
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {!isDesktopCollapsed && (
                <div style={{
                  padding: '10px 20px 5px',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}>
                  {group.title}
                </div>
              )}
              {group.items.map((item) => (
                <NavItem
                  key={item.name}
                  className={location.pathname === pathMap[item.name] ? 'active' : ''}
                  isCollapsed={isDesktopCollapsed}
                  onClick={() => {
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
                  {isDesktopCollapsed && (
                    <Tooltip show={isDesktopCollapsed}>
                      {item.label}
                    </Tooltip>
                  )}
                </NavItem>
              ))}
              {!isDesktopCollapsed && <div style={{ height: '10px' }} />}
            </div>
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
          <LogoutIcon size={20} isCollapsed={isDesktopCollapsed} />
          <LogoutText isCollapsed={isDesktopCollapsed}>Logout</LogoutText>
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
