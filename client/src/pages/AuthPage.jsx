import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const AuthCard = styled.div`
  max-width: 480px;
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.normal};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 2rem;
`;

const AuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fonts.sizes.normal};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DisclaimerText = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: 2rem;
`;

const AuthPage = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async () => {
    await login();
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthContainer>
      <AuthCard>
        <Title>PixPotion</Title>
        <Subtitle>
          Connectez-vous pour générer de magnifiques images en pixel art
        </Subtitle>
        
        <AuthButton onClick={handleLogin}>
          Se connecter avec WorkOS
        </AuthButton>
        
        <DisclaimerText>
          En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </DisclaimerText>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage; 