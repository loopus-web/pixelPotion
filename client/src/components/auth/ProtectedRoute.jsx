import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &:after {
    content: '...';
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { content: '.'; }
    33% { content: '..'; }
    66% { content: '...'; }
  }
`;

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingContainer>Loading</LoadingContainer>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute