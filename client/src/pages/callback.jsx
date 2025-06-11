import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const VisuallyHidden = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

function Callback() {
  const navigate = useNavigate();
  const { checkUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await checkUser();
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, checkUser]);

  return (
    <LoadingContainer>
      <Spinner />
      <VisuallyHidden>Authentification en cours...</VisuallyHidden>
    </LoadingContainer>
  );
}

export default Callback; 