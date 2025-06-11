import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserContext } from '../context/UserContext';
import { useSoundContext } from '../context/SoundContext';
import { toast } from 'react-toastify';
import RetroButton from '../components/ui/RetroButton';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SuccessMessage = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  p {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.fonts.sizes.medium};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .highlight {
    color: ${({ theme }) => theme.colors.success};
    font-weight: bold;
  }
  
  .credits {
    font-size: ${({ theme }) => theme.fonts.sizes.large};
    color: ${({ theme }) => theme.colors.bright.cyan};
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser, addCredits } = useUserContext();
  const { user: authUser } = useAuth();
  const { playSound } = useSoundContext();
  const [loading, setLoading] = useState(true);

  // Credits par type de plan
  const CREDITS_PER_DOLLAR = 35;
  const proCredits = Math.ceil(9.99 * CREDITS_PER_DOLLAR);
  const ultimateCredits = Math.ceil(19.99 * CREDITS_PER_DOLLAR);

  // Logging pour déboguer les données utilisateur
  useEffect(() => {
    console.log('Données utilisateur dans PaymentSuccessPage:', {
      user,
      authUser,
      userID: user?.id,
      authUserID: authUser?.id
    });
  }, [user, authUser]);

  useEffect(() => {
    const processPayment = async () => {
      // Récupérer le plan choisi et l'ID utilisateur du localStorage
      const planId = localStorage.getItem('selectedPlan');
      const storedUserId = localStorage.getItem('paymentUserId');

      if (!planId) {
        toast.error('Aucun plan sélectionné trouvé. Le processus de paiement a échoué.');
        setLoading(false);
        return;
      }

      if (!authUser && !user) {
        toast.warning('Utilisateur non authentifié. Veuillez vous connecter.');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        // Utiliser l'ID stocké ou l'ID actuel
        const userId = storedUserId || authUser?.id || user?.id;
        if (!userId) {
          throw new Error("ID utilisateur non disponible");
        }

        // Déterminer les crédits en fonction du plan
        let planCredits = 0;
        
        if (planId === 'pro') {
          planCredits = proCredits;
        } else if (planId === 'ultimate') {
          planCredits = ultimateCredits;
        }

        if (planCredits > 0) {
          // Mettre à jour le plan dans Supabase
          await updateUser({ 
            id: userId,
            plan: planId 
          });
          
          // Ajouter les crédits
          await addCredits(planCredits);
          
          // Notification et son
          toast.success(`Plan ${planId} activé avec succès!`);
          playSound('success');
          
          // Nettoyer le localStorage après traitement réussi
          localStorage.removeItem('selectedPlan');
          localStorage.removeItem('paymentUserId');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        toast.error('Erreur lors de l\'activation du plan. Veuillez contacter le support.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [user, authUser, updateUser, addCredits, playSound, navigate]);

  const handleNavigate = (path) => {
    playSound('click');
    navigate(path);
  };

  // Déterminer le nom du plan actuel
  const getPlanName = (planId) => {
    switch (planId) {
      case 'pro': return 'Pro';
      case 'ultimate': return 'Ultimate';
      default: return 'Free';
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageTitle>Traitement du paiement</PageTitle>
        <LoadingContainer>Activation de votre plan</LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Paiement Réussi</PageTitle>
      
      <SuccessMessage>
        <p>Merci pour votre achat ! Votre plan <span className="highlight">{getPlanName(user?.plan)}</span> a été activé avec succès.</p>
        
        <div className="credits">
          {user?.credits} CRÉDITS DISPONIBLES
        </div>
        
        <p>Vous pouvez maintenant profiter de toutes les fonctionnalités de votre plan.</p>
      </SuccessMessage>
      
      <ButtonContainer>
        <RetroButton color="primary" onClick={() => handleNavigate('/generator')}>
          CRÉER DES IMAGES
        </RetroButton>
        <RetroButton color="secondary" onClick={() => handleNavigate('/profile')}>
          MON PROFIL
        </RetroButton>
      </ButtonContainer>
    </PageContainer>
  );
}

export default PaymentSuccessPage; 