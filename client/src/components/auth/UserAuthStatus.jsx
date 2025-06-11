import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import RetroButton from '../ui/RetroButton';

const UserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const UserCredits = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacing.sm};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 10;
  min-width: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

function UserAuthStatus() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Utilisateur connecté
  if (user) {
    const initials = user?.email?.substring(0, 2).toUpperCase() || '??';
    
    return (
      <UserContainer>
        <UserAvatar onClick={toggleDropdown}>
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Avatar" />
          ) : (
            initials
          )}
        </UserAvatar>
        
        <UserInfo>
          <UserName>{user.username || user.email.split('@')[0]}</UserName>
          {user.credits !== undefined && (
            <UserCredits>{user.credits} crédits</UserCredits>
          )}
        </UserInfo>
        
        <DropdownMenu isOpen={isDropdownOpen}>
          <DropdownItem onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}>
            Mon profil
          </DropdownItem>
          <DropdownItem onClick={() => { navigate('/gallery'); setIsDropdownOpen(false); }}>
            Ma galerie
          </DropdownItem>
          <DropdownItem onClick={handleLogout}>
            Déconnexion
          </DropdownItem>
        </DropdownMenu>
      </UserContainer>
    );
  }

  // Utilisateur non connecté
  return (
    <RetroButton 
      onClick={handleLogin}
      size="small"
    >
      Connexion
    </RetroButton>
  );
}

export default UserAuthStatus; 