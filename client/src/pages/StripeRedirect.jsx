import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  box-shadow: ${({ theme }) => theme.shadows.panel};
  text-align: center;
`;

const Loader = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${({ theme }) => theme.spacing.md} 0;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function StripeRedirect() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Redirection en cours...');

  useEffect(() => {
    // Vérifier si nous avons des données de plan enregistrées
    const planId = localStorage.getItem('selectedPlan');
    
    if (planId) {
      setMessage(`Finalisation de votre commande pour le plan ${planId}...`);
      
      // Une petite pause avant de rediriger (pour simuler un traitement)
      const timer = setTimeout(() => {
        navigate('/payment-success');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setMessage('Aucune information de commande trouvée');
      toast.error('Erreur de redirection. Veuillez réessayer.');
      
      // Rediriger vers la page des plans après un certain temps
      const timer = setTimeout(() => {
        navigate('/plans');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <Container>
      <h1>Traitement de votre paiement</h1>
      <Loader />
      <p>{message}</p>
    </Container>
  );
}

export default StripeRedirect; 