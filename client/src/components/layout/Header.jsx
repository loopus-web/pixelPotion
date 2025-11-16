import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';
import { useAuth } from '../../context/AuthContext';
import { useUserContext } from '../../context/UserContext';
import RetroButton from '../ui/RetroButton';
import UserAuthStatus from '../auth/UserAuthStatus';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.panel};
  border-bottom: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.md};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  
  span {
    color: ${({ theme }) => theme.colors.accent};
  }
  
  &:hover {
    text-decoration: none;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.secondary};
  font-size: ${({ theme }) => theme.fonts.sizes.regular};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 4px solid ${({ theme, active }) => 
    active ? theme.colors.primary : 'transparent'};
  text-transform: uppercase;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const fadeChange = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const CreditsDisplay = styled.div`
  background-color: ${({ theme }) => theme.colors.panelDark};
  color: ${({ theme, lowCredits }) => lowCredits ? theme.colors.error : theme.colors.bright.yellow};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme, lowCredits }) => lowCredits ? theme.colors.error : theme.colors.border};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  transition: all 0.3s ease;
  
  &.changing {
    animation: ${pulse} 0.5s ease;
  }
  
  .credit-icon {
    font-size: 16px;
  }
  
  .credits-amount {
    font-weight: bold;
  }
  
  .credits-label {
    opacity: 0.8;
  }
  
  &.low::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid ${({ theme }) => theme.colors.error};
    opacity: 0.6;
    animation: ${fadeChange} 2s infinite;
    pointer-events: none;
  }
`;

const AddCreditsButton = styled(Link)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.bright.green};
  padding: 0 4px;
  margin-left: 4px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PlanBadge = styled.div`
  background-color: ${({ theme, plan }) => {
    switch (plan) {
      case 'pro': return theme.colors.primary;
      case 'ultimate': return theme.colors.accent;
      default: return theme.colors.secondary;
    }
  }};
  color: #000000;
  padding: 4px 8px;
  font-size: ${({ theme, small }) => small ? theme.fonts.sizes.xsmall : theme.fonts.sizes.small};
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 2px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px ${({ theme, plan }) => {
    switch (plan) {
      case 'pro': return `${theme.colors.primary}60`;
      case 'ultimate': return `${theme.colors.accent}60`;
      default: return 'transparent';
    }
  }};
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  
  &:hover {
    filter: ${({ clickable }) => clickable ? 'brightness(1.1)' : 'none'};
  }
`;

const UserDropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserAvatarButton = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.panelDark};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  gap: 8px;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    image-rendering: pixelated;
  }
  
  .username {
    color: ${({ theme }) => theme.colors.text};
    font-weight: bold;
    font-size: ${({ theme }) => theme.fonts.sizes.small};
  }
  
  .chevron {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    transition: transform 0.2s;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 220px;
  background-color: ${({ theme }) => theme.colors.panel};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 10px;
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.panel};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    border-left: 2px solid ${({ theme }) => theme.colors.border};
    transform: rotate(45deg);
  }
`;

const DropdownHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  
  .username {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    font-size: ${({ theme }) => theme.fonts.sizes.medium};
  }
  
  .email {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.fonts.sizes.small};
    margin-top: 4px;
  }
`;

const PlanInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  .plan-label {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text};
    
    .icon {
      margin-right: 10px;
      font-size: 18px;
    }
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: background-color 0.2s;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.panelDark};
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
  
  .icon {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const DropdownLogoutItem = styled.button`
  display: flex;
  align-items: center;
  padding: 12px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: background-color 0.2s;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.panelDark};
  }
  
  .icon {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const SoundToggle = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  background-color: ${({ theme, enabled }) => 
    enabled ? theme.colors.secondary : theme.colors.buttonBg};
  
  &:hover {
    background-color: ${({ theme, enabled }) => 
      enabled ? theme.colors.primary : theme.colors.accent};
  }
`;

function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { user: userCtx } = useUserContext();
  const { playSound, toggleSound, soundEnabled } = useSoundContext();
  const [isCreditsChanging, setIsCreditsChanging] = useState(false);
  const previousCredits = useRef(userCtx?.credits || 0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  
  // Détection de changement des crédits pour animation
  useEffect(() => {
    if (userCtx?.credits !== undefined && previousCredits.current !== userCtx.credits) {
      setIsCreditsChanging(true);
      const timer = setTimeout(() => setIsCreditsChanging(false), 500);
      previousCredits.current = userCtx.credits;
      return () => clearTimeout(timer);
    }
  }, [userCtx?.credits]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Lorsque le chemin change, jouer un son de navigation
  useEffect(() => {
    if (prevPathname !== location.pathname) {
      playSound('click');
      setPrevPathname(location.pathname);
    }
  }, [location.pathname, prevPathname, playSound]);
  
  const handleLinkClick = () => {
    playSound('click');
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    playSound('click');
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleSoundToggle = () => {
    toggleSound();
    playSound('toggle');
  };
  
  // Détermine si l'utilisateur a peu de crédits
  const hasLowCredits = userCtx?.credits !== undefined && userCtx.credits < 15;
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/" onClick={handleLinkClick}>
          <img src="/images/logo.png" alt="PixPotion logo" className="logo" />
          Pix<span>Potion</span>
        </Logo>
        
        <NavContainer style={{ justifyContent: 'flex-end', textAlign: 'right', alignItems: 'right' }}>
          <NavLink 
            to="/" 
            active={location.pathname === '/' ? 1 : 0}
            onClick={handleLinkClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/generator"
            active={location.pathname === '/generator' ? 1 : 0}
            onClick={handleLinkClick}
          >
            Generator
          </NavLink>
          <NavLink
            to="/tools"
            active={location.pathname.startsWith('/tools') ? 1 : 0}
            onClick={handleLinkClick}
          >
            Tools
          </NavLink>
          <NavLink
            to="/marketplace"
            active={location.pathname === '/marketplace' ? 1 : 0}
            onClick={handleLinkClick}
          >
            Marketplace
          </NavLink>
          {user && (
            <NavLink
              to="/gallery"
              active={location.pathname === '/gallery' ? 1 : 0}
              onClick={handleLinkClick}
            >
              Gallery
            </NavLink>
          )}
          {/* <NavLink 
            to="/contact" 
            active={location.pathname === '/contact' ? 1 : 0}
            onClick={handleLinkClick}
          >
            Contact
          </NavLink> */}
        </NavContainer>
        
        <UserInfo>
          {user && userCtx && (
            <>
              <CreditsDisplay 
                className={`${isCreditsChanging ? 'changing' : ''} ${hasLowCredits ? 'low' : ''}`}
                lowCredits={hasLowCredits}
              >
                <span className="credit-icon">💎</span>
                <span className="credits-amount">{userCtx.credits || 0}</span>
                <span className="credits-label">CREDITS</span>
                <AddCreditsButton to="/plans" onClick={handleLinkClick}>+</AddCreditsButton>
              </CreditsDisplay>
              
              <UserDropdownContainer ref={dropdownRef}>
                <UserAvatarButton onClick={toggleDropdown}>
                  <img src={userCtx.avatar || "/images/default-avatar.png"} alt="User Avatar" className="avatar" />
                  <span className="username">{userCtx.username || "User"}</span>
                  <span className="chevron">▼</span>
                </UserAvatarButton>
                
                <DropdownMenu isOpen={isDropdownOpen}>
                  <DropdownHeader>
                    <div className="username">{userCtx.username || "User"}</div>
                    <div className="email">{userCtx.email || "user@example.com"}</div>
                  </DropdownHeader>
                  <PlanInfoItem>
                    <div className="plan-label">
                      <span className="icon">⭐</span>
                      <span>Current Plan</span>
                    </div>
                    <PlanBadge plan={userCtx.plan || 'free'} small>
                      {userCtx.plan ? userCtx.plan.toUpperCase() : 'FREE'}
                    </PlanBadge>
                  </PlanInfoItem>
                  <DropdownItem to="/profile" onClick={handleLinkClick}>
                    <span className="icon">👤</span> My Profile
                  </DropdownItem>
                  <DropdownItem to="/plans" onClick={handleLinkClick}>
                    <span className="icon">💎</span> Subscription Plans
                  </DropdownItem>
                  <DropdownLogoutItem onClick={() => {
                    playSound('click');
                    signOut();
                  }}>
                    <span className="icon">🚪</span> Logout
                  </DropdownLogoutItem>
                </DropdownMenu>
              </UserDropdownContainer>
            </>
          )}
          {user ? null : (
            <RetroButton 
              as={Link} 
              to="/login" 
              onClick={handleLinkClick}
              color="primary"
              small
            >
              LOGIN
            </RetroButton>
          )}
          <SoundToggle 
            onClick={handleSoundToggle} 
            enabled={soundEnabled ? 1 : 0}
            title={soundEnabled ? "Sound On" : "Sound Off"}
          >
            {soundEnabled ? '♪' : '♪̸'}
          </SoundToggle>
          <UserAuthStatus />
        </UserInfo>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;