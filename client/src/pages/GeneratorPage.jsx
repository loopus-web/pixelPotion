import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GeneratorForm from '../components/generator/GeneratorForm';
import ImagePreview from '../components/generator/ImagePreview';
import { useUserContext } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import RetroButton from '../components/ui/RetroButton';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
  text-shadow: 3px 3px 0px ${({ theme }) => theme.colors.panelDark};
`;

const GeneratorLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CreditWarning = styled.div`
  background-color: ${({ theme }) => theme.colors.panelDark};
  border: 2px solid ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: pulse 2s infinite ease-in-out;
  
  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }
`;

const LoginBanner = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}20,
    ${({ theme }) => theme.colors.accent}20
  );
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  backdrop-filter: blur(5px);
  box-shadow: ${({ theme }) => theme.shadows.medium};
  animation: fadeIn 0.5s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  h3 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fonts.sizes.xlarge};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    text-transform: uppercase;
  }
  
  p {
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fonts.sizes.medium};
    max-width: 600px;
    line-height: 1.6;
  }
  
  .buttons {
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      flex-direction: column;
    }
  }
`;

const HistorySection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const HistoryTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.sizes.xlarge};
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const HistoryItem = styled.div`
  background: ${({ theme }) => theme.colors.panelDark};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  img {
    width: 100%;
    height: 100px;
    object-fit: contain;
    background: #111;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .style {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.fonts.sizes.xsmall};
    text-align: center;
    margin-top: ${({ theme }) => theme.spacing.xs};
    text-transform: uppercase;
  }
`;

const PromptInfo = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .prompt-text {
    font-style: italic;
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  .prompt-label {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

function GeneratorPage() {
  const { user } = useUserContext();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [showLoginBanner, setShowLoginBanner] = useState(false);
  const [attemptedGeneration, setAttemptedGeneration] = useState(false);
  
  // Check for initialPrompt in sessionStorage when component mounts
  useEffect(() => {
    const savedPrompt = sessionStorage.getItem('initialPrompt');
    if (savedPrompt) {
      setInitialPrompt(savedPrompt);
      sessionStorage.removeItem('initialPrompt'); // Clear it after retrieving
    }
  }, []);
  
  // Determine if we should show login banner
  useEffect(() => {
    // Show login banner if user attempted generation but isn't logged in
    if (attemptedGeneration && !authUser) {
      setShowLoginBanner(true);
    } else {
      setShowLoginBanner(false);
    }
  }, [attemptedGeneration, authUser]);
  
  const handleGenerate = (image) => {
    setGeneratedImage(image);
    if (image && image.url) {
      setHistory(prev => [image, ...prev]);
    }
  };
  
  const handleLoginRedirect = () => {
    // Save current path to redirect back after login
    navigate('/login', { state: { from: { pathname: '/generator' } } });
  };
  
  const handleAuthRequired = () => {
    // Mark that the user attempted to generate
    setAttemptedGeneration(true);
    // Rediriger directement vers la page de login sans demander confirmation
    handleLoginRedirect();
  };
  
  return (
    <PageContainer>
      <PageTitle>Pixel Art Generator</PageTitle>
      
      {initialPrompt && (
        <PromptInfo>
          <div>
            <span className="prompt-label">Your prompt:</span>
            <span className="prompt-text">"{initialPrompt}"</span>
          </div>
          {!authUser && (
            <RetroButton onClick={() => setShowLoginBanner(true)} color="secondary" size="small">
              Login to Generate
            </RetroButton>
          )}
        </PromptInfo>
      )}
      
      {/* Show login banner for non-logged in users who attempted generation */}
      {showLoginBanner && !authUser && (
        <LoginBanner>
          <h3>Ready to Create Your Pixel Art!</h3>
          <p>
            Log in or create an account to generate and save your pixel art.
            You'll get free credits to start creating right away!
          </p>
          <div className="buttons">
            <RetroButton onClick={handleLoginRedirect} color="primary" size="large">
              LOGIN TO CONTINUE
            </RetroButton>
            <RetroButton 
              onClick={() => navigate('/auth', { state: { from: { pathname: '/generator' } } })} 
              color="secondary"
              size="large"
            >
              CREATE ACCOUNT
            </RetroButton>
          </div>
        </LoginBanner>
      )}
      
      {/* Credit warning for logged in users with low credits */}
      {user && user.credits < 10 && (
        <CreditWarning>
          WARNING: YOU HAVE ONLY {user.credits} CREDITS LEFT. EACH GENERATION COSTS 5 CREDITS.
        </CreditWarning>
      )}
      
      <GeneratorLayout>
        <GeneratorForm 
          onGenerate={handleGenerate} 
          initialPrompt={initialPrompt}
          requiresAuth={true}
          onAuthRequired={handleAuthRequired}
        />
        <ImagePreview image={generatedImage} />
        
        {history.length > 0 && (
          <HistorySection>
            <HistoryTitle>Generation History</HistoryTitle>
            <HistoryGrid>
              {history.map((img, idx) => (
                <HistoryItem key={idx} onClick={() => setGeneratedImage(img)}>
                  <img src={img.url} alt={img.prompt || ''} />
                  <div className="style">{img.style ? img.style.toUpperCase() : ''}</div>
                </HistoryItem>
              ))}
            </HistoryGrid>
          </HistorySection>
        )}
      </GeneratorLayout>
    </PageContainer>
  );
}

export default GeneratorPage;