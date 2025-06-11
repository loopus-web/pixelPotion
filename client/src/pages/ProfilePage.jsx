import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUserContext } from '../context/UserContext';
import { useSoundContext } from '../context/SoundContext';
import RetroButton from '../components/ui/RetroButton';
import RetroInput from '../components/ui/RetroInput';
import { toast } from 'react-toastify';
import ContactForm from '../components/ContactForm';

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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const AvatarSection = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  width: 200px;
  height: 200px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
  }
`;

const AvatarChoices = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AvatarChoice = styled.div`
  width: 50px;
  height: 50px;
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ProfileDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ProfileForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
`;

const SubscriptionSection = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-transform: uppercase;
  }
`;

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div`
  background-color: ${({ theme }) => theme.colors.panelDark};
  border: 4px solid ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  h3 {
    color: ${({ theme, type }) => {
      switch (type) {
        case 'free': return theme.colors.secondary;
        case 'pro': return theme.colors.primary;
        case 'ultimate': return theme.colors.accent;
        default: return theme.colors.secondary;
      }
    }};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-transform: uppercase;
  }
  
  .price {
    font-size: ${({ theme }) => theme.fonts.sizes.large};
    color: ${({ theme }) => theme.colors.bright.yellow};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .credits {
    color: ${({ theme }) => theme.colors.bright.cyan};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: left;
    
    li {
      margin-bottom: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.secondary};
      
      &::before {
        content: '>';
        margin-right: ${({ theme }) => theme.spacing.xs};
        color: ${({ theme }) => theme.colors.bright.cyan};
      }
    }
  }
`;

const CreditHistoryContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.panelDark};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.md};
`;

const CreditHistoryTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  .refresh-button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.secondary};
    cursor: pointer;
    font-size: 16px;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: ${({ theme }) => theme.spacing.sm};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  td {
    padding: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}50;
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  tr:hover td {
    background-color: ${({ theme }) => theme.colors.panel};
  }
  
  .credit-amount {
    font-weight: bold;
  }
  
  .credit-added {
    color: ${({ theme }) => theme.colors.success};
    &:before {
      content: '+';
    }
  }
  
  .credit-deducted {
    color: ${({ theme }) => theme.colors.error};
    &:before {
      content: '-';
    }
  }
  
  .transaction-icon {
    font-size: 18px;
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const StatsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.panelDark};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  
  .stat-value {
    font-size: ${({ theme }) => theme.fonts.sizes.xlarge};
    color: ${({ theme, color }) => theme.colors[color] || theme.colors.bright.yellow};
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .stat-label {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.fonts.sizes.small};
    text-transform: uppercase;
  }
  
  .stat-icon {
    display: block;
    font-size: 24px;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

// Prix des crédits : 35 crédits par dollar
const CREDITS_PER_DOLLAR = 35;
const proCredits = Math.ceil(9.99 * CREDITS_PER_DOLLAR);
const ultimateCredits = Math.ceil(19.99 * CREDITS_PER_DOLLAR);

// Avatar choices
const avatarOptions = [
  '/public/images/avatar_1.png',
  '/public/images/avatar_2.png',
  '/public/images/avatar_3.png',
  '/public/images/avatar_4.png',
  '/public/images/avatar_5.png',
  '/public/images/avatar_6.png',
];

// Subscription Plans (Mise à jour: aucun plan illimité, respect du tarif min)
const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    credits: '20 CREDITS',
    features: [
      'Generate up to 5 images',
      'Basic styles only (Simple, Retro)',
      'Maximum 256x256 resolution',
      'Standard export options',
      'Community support',
      'Personal gallery',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    credits: `${proCredits} CREDITS`,
    features: [
      `Generate up to ${proCredits / 5} images (5 credits per image)`,
      'All pixel art styles',
      'Up to 512x512 resolution',
      'Advanced export options',
      'Priority rendering',
      'Personal gallery',
      'Early access to new features',
      'Email support',
    ]
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: '$19.99',
    credits: `${ultimateCredits} CREDITS`,
    features: [
      `Generate up to ${ultimateCredits / 5} images (5 credits per image)`,
      'All pixel art styles',
      'Up to 512x512 resolution',
      'Advanced export options',
      'Priority rendering',
      'Personal gallery',
      'Early access to new features',
      'Email support',
    ]
  }
];

function ProfilePage() {
  const { user, updateUser } = useUserContext();
  const { playSound } = useSoundContext();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || avatarOptions[0]);
  const [transactions, setTransactions] = useState([]);
  
  // Générer un historique fictif des transactions de crédits pour démonstration
  useEffect(() => {
    if (user) {
      // Cette fonction simule un historique de transactions
      // Dans une application réelle, ces données viendraient d'une API ou d'une base de données
      const generateMockTransactions = () => {
        const mockTransactions = [];
        
        // Ajouter la transaction initiale (inscription)
        mockTransactions.push({
          id: 'initial',
          type: 'add',
          amount: 10,
          description: 'Initial credits for new account',
          date: new Date(user.createdAt || Date.now()).toISOString(),
          balance: 10
        });
        
        // Ajouter les transactions basées sur l'historique de génération
        let currentBalance = 10;
        
        if (user.generationHistory && user.generationHistory.length > 0) {
          user.generationHistory.forEach((generation, index) => {
            const cost = generation.creditCost || 5;
            currentBalance -= cost;
            
            mockTransactions.push({
              id: `gen-${generation.id || index}`,
              type: 'deduct',
              amount: cost,
              description: `Generated image: "${generation.prompt?.substring(0, 30)}${generation.prompt?.length > 30 ? '...' : ''}"`,
              date: generation.createdAt || new Date().toISOString(),
              balance: currentBalance
            });
            
            // Simuler des achats aléatoires de crédits pour rendre l'historique plus intéressant
            if (index % 3 === 0 && currentBalance < 20) {
              const purchaseAmount = [35, 70, 350][Math.floor(Math.random() * 3)];
              currentBalance += purchaseAmount;
              
              mockTransactions.push({
                id: `purchase-${Date.now()}-${index}`,
                type: 'add',
                amount: purchaseAmount,
                description: 'Credit purchase',
                date: new Date(new Date(generation.createdAt).getTime() + 1000*60*60).toISOString(),
                balance: currentBalance
              });
            }
          });
        }
        
        // Ajouter une transaction simulée de mise à niveau de plan si l'utilisateur n'a pas le plan gratuit
        if (user.plan && user.plan !== 'free') {
          const bonusAmount = user.plan === 'pro' ? 100 : 200;
          mockTransactions.push({
            id: `plan-upgrade-${user.plan}`,
            type: 'add',
            amount: bonusAmount,
            description: `Bonus credits for ${user.plan.toUpperCase()} plan subscription`,
            date: new Date(Date.now() - 1000*60*60*24*5).toISOString(),
            balance: currentBalance + bonusAmount
          });
        }
        
        // Trier les transactions par date (les plus récentes en premier)
        return mockTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      };
      
      setTransactions(generateMockTransactions());
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAvatarSelect = (avatar) => {
    playSound('click');
    setSelectedAvatar(avatar);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('save');
    
    updateUser({
      ...formData,
      avatar: selectedAvatar
    });
    
    toast.success('Profile updated successfully!');
  };
  
  const handleChangePlan = (planId) => {
    playSound('click');
    
    if (planId !== user.plan) {
      // This would typically redirect to a payment page
      toast.info(`Upgrading to ${planId} plan. This would redirect to payment.`);
    } else {
      toast.info('You are already subscribed to this plan.');
    }
  };
  
  // Fonction pour formatter la date des transactions
  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Fonction pour rafraîchir l'historique des transactions (simulation)
  const refreshTransactions = () => {
    playSound('click');
    toast.info("Rafraîchissement de l'historique des transactions...");
    // Dans une application réelle, cela ferait un appel API
    setTimeout(() => {
      toast.success("Historique des transactions mis à jour");
    }, 1000);
  };
  
  return (
    <PageContainer>
      <PageTitle>Your Profile</PageTitle>
      
      <ProfileGrid>
        <AvatarSection>
          <Avatar>
            <img src={selectedAvatar} alt="User Avatar" />
          </Avatar>
          
          <h3>Change Avatar</h3>
          
          <AvatarChoices>
            {avatarOptions.map((avatar, index) => (
              <AvatarChoice 
                key={index}
                selected={selectedAvatar === avatar ? 1 : 0}
                onClick={() => handleAvatarSelect(avatar)}
              >
                <img src={avatar} alt={`Avatar option ${index}`} />
              </AvatarChoice>
            ))}
          </AvatarChoices>
          
          {/* <div>
            <RetroButton color="primary" onClick={() => playSound('click')}>
              UPLOAD CUSTOM
            </RetroButton>
          </div> */}
        </AvatarSection>
        
        <ProfileDetails>
          <h2>Account Details</h2>
          
          <ProfileForm onSubmit={handleSubmit}>
            <FormField>
              <FormLabel htmlFor="username">Username</FormLabel>
              <RetroInput
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormField>
            
            <FormField>
              <FormLabel htmlFor="email">Email</FormLabel>
              <RetroInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormField>
            
            <FormField>
              <RetroButton type="submit" color="primary">
                SAVE CHANGES
              </RetroButton>
            </FormField>
          </ProfileForm>
          
          <StatsContainer>
            <StatCard color="bright.yellow">
              <span className="stat-icon">💎</span>
              <div className="stat-value">{user?.credits || 0}</div>
              <div className="stat-label">Crédits actuels</div>
            </StatCard>
            
            <StatCard color="bright.cyan">
              <span className="stat-icon">🖼️</span>
              <div className="stat-value">{user?.generationHistory?.length || 0}</div>
              <div className="stat-label">Images générées</div>
            </StatCard>
            
            <StatCard color="bright.green">
              <span className="stat-icon">💾</span>
              <div className="stat-value">{user?.savedImages?.length || 0}</div>
              <div className="stat-label">Images enregistrées</div>
            </StatCard>
            
            <StatCard color="primary">
              <span className="stat-icon">⭐</span>
              <div className="stat-value">{user?.plan?.toUpperCase() || 'FREE'}</div>
              <div className="stat-label">Plan</div>
            </StatCard>
          </StatsContainer>
          
          <CreditHistoryContainer>
            <CreditHistoryTitle>
              Historique des crédits
              <button className="refresh-button" onClick={refreshTransactions} title="Rafraîchir l'historique">⟳</button>
            </CreditHistoryTitle>
            
            {transactions.length > 0 ? (
              <TransactionTable>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Crédits</th>
                    <th>Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{formatTransactionDate(transaction.date)}</td>
                      <td>
                        <span className="transaction-icon">
                          {transaction.type === 'add' ? '⬆️' : '⬇️'}
                        </span>
                        {transaction.description}
                      </td>
                      <td className={`credit-amount credit-${transaction.type === 'add' ? 'added' : 'deducted'}`}>
                        {transaction.amount}
                      </td>
                      <td>{transaction.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </TransactionTable>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Aucune transaction trouvée
              </div>
            )}
          </CreditHistoryContainer>
        </ProfileDetails>
      </ProfileGrid>
      
      {/* <SubscriptionSection>
        <h2>Subscription Plans</h2>
        
        <PlanGrid>
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              active={user?.plan === plan.id ? 1 : 0}
              type={plan.id}
            >
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}</div>
              <div className="credits">{plan.credits}</div>
              
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <RetroButton 
                color={user?.plan === plan.id ? 'secondary' : 'primary'}
                onClick={() => handleChangePlan(plan.id)}
              >
                {user?.plan === plan.id ? 'CURRENT PLAN' : 'UPGRADE'}
              </RetroButton>
            </PlanCard>
          ))}
        </PlanGrid>
      </SubscriptionSection> */}
      
      {/* Contact Form Section */}
      {/* <ContactForm /> */}
    </PageContainer>
  );
}

export default ProfilePage;