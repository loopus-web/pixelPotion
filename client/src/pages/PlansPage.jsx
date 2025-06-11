import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSoundContext } from '../context/SoundContext';
import { useUserContext } from '../context/UserContext';
import RetroButton from '../components/ui/RetroButton';
import { toast } from 'react-toastify';
import ContactForm from '../components/ContactForm';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const PlanCard = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: 8px solid ${({ theme, recommended, isCurrentPlan }) => 
    isCurrentPlan ? theme.colors.bright.green : 
    recommended ? theme.colors.primary : theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  position: relative;
  
  ${({ recommended, theme }) => recommended && `
    &::before {
      content: 'RECOMMENDED';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${theme.colors.primary};
      color: #000000;
      padding: 4px 16px;
      font-size: 14px;
    }
  `}
  
  ${({ isCurrentPlan, theme }) => isCurrentPlan && `
    box-shadow: 0 0 20px ${theme.colors.bright.green};
    &::after {
      content: 'YOUR PLAN';
      position: absolute;
      top: -20px;
      right: 10px;
      background-color: ${theme.colors.bright.green};
      color: #000000;
      padding: 4px 16px;
      font-size: 14px;
    }
  `}
`;

const PlanName = styled.h2`
  color: ${({ theme, color, isCurrentPlan }) => 
    isCurrentPlan ? theme.colors.bright.green : theme.colors[color] || theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fonts.sizes.xlarge};
  ${({ isCurrentPlan }) => isCurrentPlan && `
    text-shadow: 0 0 10px rgba(51, 255, 51, 0.7);
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `}
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  
  .price {
    color: ${({ theme }) => theme.colors.bright.yellow};
  }
  
  .period {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const PlanCredits = styled.div`
  background-color: ${({ theme }) => theme.colors.panelDark};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  
  .amount {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.bright.cyan};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .label {
    color: ${({ theme }) => theme.colors.secondary};
    text-transform: uppercase;
    font-size: 0.9rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-grow: 1;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.secondary};
    display: flex;
    align-items: flex-start;
    
    &::before {
      content: '>';
      margin-right: ${({ theme }) => theme.spacing.sm};
      color: ${({ theme, color }) => theme.colors[color] || theme.colors.secondary};
    }
  }
`;

const ComparisonTable = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: center;
    border: 2px solid ${({ theme }) => theme.colors.border};
  }
  
  th {
    background-color: ${({ theme }) => theme.colors.panelDark};
    color: ${({ theme }) => theme.colors.primary};
    text-transform: uppercase;
  }
  
  td {
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  .feature-name {
    text-align: left;
    color: ${({ theme }) => theme.colors.bright.cyan};
  }
  
  .yes {
    color: ${({ theme }) => theme.colors.success};
  }
  
  .no {
    color: ${({ theme }) => theme.colors.error};
  }
  
  .highlight {
    background-color: rgba(51, 255, 51, 0.1);
  }
`;

// Plans data
const CREDITS_PER_DOLLAR = 35;
const proCredits = Math.ceil(9.99 * CREDITS_PER_DOLLAR);
const ultimateCredits = Math.ceil(19.99 * CREDITS_PER_DOLLAR);

const plans = [
  {
    id: 'free',
    name: 'Free',
    color: 'secondary',
    price: '$0',
    period: 'FOREVER',
    credits: 25,
    features: [
      'Generate up to 5 images',
      'Basic styles only (Simple, Retro)',
      'Maximum 256x256 resolution',
      'Save up to 50 images in gallery',
      'Basic priority in queue'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'Pro',
    color: 'primary',
    price: '$9.99',
    period: 'PER MONTH',
    credits: proCredits,
    features: [
      `Generate up to ${Math.floor(proCredits / 5)} images`,
      'All pixel art styles',
      'Up to 512x512 resolution',
      'Save up to 1000 images in gallery',
      'Email support'
    ],
    recommended: true
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    color: 'accent',
    price: '$19.99',
    period: 'PER MONTH',
    credits: ultimateCredits,
    features: [
      `Generate up to ${Math.floor(ultimateCredits / 5)} images`,
      'All pixel art styles plus exclusives',
      'Up to 512x512 resolution',
      'Save up to 5000 images in gallery',
      'Email support'
    ],
    recommended: false
  }
];

// Features comparison
const featuresComparison = [
  {
    name: 'Credits',
    free: '25',
    pro: `${proCredits}`,
    ultimate: `${ultimateCredits}`
  },
  {
    name: 'Max Resolution',
    free: '256x256',
    pro: '512x512',
    ultimate: 'Custom'
  },
  {
    name: 'Styles Available',
    free: '2',
    pro: '6',
    ultimate: '10+'
  },
  {
    name: 'Export Formats',
    free: 'PNG',
    pro: 'PNG, GIF',
    ultimate: 'PNG, GIF, SVG'
  },
  {
    name: 'Gallery Storage',
    free: '50 Images',
    pro: '1000 Images',
    ultimate: '5000 Images'
  },
  {
    name: 'Priority Support',
    free: 'No',
    pro: 'Email',
    ultimate: 'Email'
  }
];

function PlansPage() {
  const navigate = useNavigate();
  const { playSound } = useSoundContext();
  const { user, updateUser } = useUserContext();
  const { user: authUser } = useAuth();
  const [showContact, setShowContact] = React.useState(false);
  
  // Log pour déboguer les objets utilisateur
  React.useEffect(() => {
    console.log('Détails utilisateur dans PlansPage:', { 
      user, 
      authUser,
      userID: user?.id,
      authUserID: authUser?.id
    });
  }, [user, authUser]);
  
  const handleChoosePlan = (planId) => {
    playSound('click');
    
    if (planId === 'free') {
      updateUser({ plan: 'free' });
      toast.success('You are now on the Free plan!');
    } else {
      // Stocker le plan choisi dans le localStorage
      localStorage.setItem('selectedPlan', planId);
      
      // Récupérer l'ID de l'utilisateur authentifié de manière fiable
      const userId = authUser?.id || user?.id || '';
      
      if (!userId) {
        toast.error('Impossible de récupérer votre identifiant utilisateur. Veuillez vous reconnecter.');
        return;
      }
      
      // Stocker l'ID utilisateur pour utilisation après redirection
      localStorage.setItem('paymentUserId', userId);
      
      // Liens de paiement Stripe - Ces liens DOIVENT être configurés dans le dashboard Stripe 
      // pour rediriger vers https://votre-domaine.com/stripe-redirect après le paiement
      const stripeLinks = {
        pro: 'https://buy.stripe.com/test_aEUeW0blg6Q0fT2eUX', // Configurer avec success_url=https://votre-domaine.com/stripe-redirect
        ultimate: 'https://buy.stripe.com/test_00geW0fBw8Y8ayI148' // Configurer avec success_url=https://votre-domaine.com/stripe-redirect
      //  pro: 'https://buy.stripe.com/3cs4in6O2eIIck88wI',
       // ultimate: 'https://buy.stripe.com/7sIdSXdcq8kkbg48wJ'
      };
      
      if (stripeLinks[planId]) {
        window.location.href = stripeLinks[planId];
      }
    }
  };
  
  const handleContactSales = () => {
    playSound('click');
    setShowContact(true);
  };
  
  return (
    <PageContainer>
      <PageTitle>Subscription Plans</PageTitle>
      
      <PlansGrid>
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            recommended={plan.recommended ? 1 : 0}
            isCurrentPlan={user?.plan === plan.id ? 1 : 0}
          >
            <PlanName color={plan.color} isCurrentPlan={user?.plan === plan.id ? 1 : 0}>
              {plan.name}
            </PlanName>
            <PlanPrice>
              <span className="price">{plan.price}</span>
              <span className="period"> {plan.period}</span>
            </PlanPrice>
            
            <PlanCredits>
              <div className="amount">
                {plan.credits}
              </div>
              <div className="label">
                CREDITS
              </div>
            </PlanCredits>
            
            <FeaturesList>
              {plan.features.map((feature, index) => (
                <li key={index} color={plan.color}>{feature}</li>
              ))}
            </FeaturesList>
            
            <RetroButton 
              color={plan.color} 
              onClick={() => handleChoosePlan(plan.id)}
              disabled={user?.plan === plan.id}
            >
              {user?.plan === plan.id ? 'CURRENT PLAN' : 'CHOOSE PLAN'}
            </RetroButton>
          </PlanCard>
        ))}
      </PlansGrid>
      
      <ComparisonTable>
        <h2>Features Comparison</h2>
        
        <Table>
          <thead>
            <tr>
              <th>Feature</th>
              <th className={user?.plan === 'free' ? 'highlight' : ''}>Free</th>
              <th className={user?.plan === 'pro' ? 'highlight' : ''}>Pro</th>
              <th className={user?.plan === 'ultimate' ? 'highlight' : ''}>Ultimate</th>
            </tr>
          </thead>
          <tbody>
            {featuresComparison.map((feature, index) => (
              <tr key={index}>
                <td className="feature-name">{feature.name}</td>
                <td className={`${user?.plan === 'free' ? 'highlight' : ''} ${feature.free === 'Yes' ? 'yes' : (feature.free === 'No' ? 'no' : '')}`}>
                  {feature.free}
                </td>
                <td className={`${user?.plan === 'pro' ? 'highlight' : ''} ${feature.pro === 'Yes' ? 'yes' : (feature.pro === 'No' ? 'no' : '')}`}>
                  {feature.pro}
                </td>
                <td className={`${user?.plan === 'ultimate' ? 'highlight' : ''} ${feature.ultimate === 'Yes' ? 'yes' : (feature.ultimate === 'No' ? 'no' : '')}`}>
                  {feature.ultimate}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ComparisonTable>
      
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <h3 style={{ marginBottom: '16px' }}>Looking for enterprise solutions?</h3>
        <RetroButton color="secondary" onClick={handleContactSales}>
          CONTACT SALES
        </RetroButton>
        {showContact && <ContactForm />}
      </div>
    </PageContainer>
  );
}

export default PlansPage;