import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSoundContext } from '../context/SoundContext';
import { useAuth } from '../context/AuthContext';
import { useUserContext } from '../context/UserContext';
import RetroButton from '../components/ui/RetroButton';
import RetroInput from '../components/ui/RetroInput';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 200px);
`;

const HeroSection = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  text-shadow: 4px 4px 0px ${({ theme }) => theme.colors.panelDark};
  letter-spacing: 2px;
  
  span {
    color: ${({ theme }) => theme.colors.accent};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 3.5rem;
  }
`;

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 800px;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

const PromptContainer = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.strong};
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  animation: pulse 4s infinite ease-in-out;
  
  @keyframes pulse {
    0%, 100% { box-shadow: ${({ theme }) => theme.shadows.strong}; }
    50% { box-shadow: 0 0 30px ${({ theme }) => theme.colors.primary}40; }
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary}00,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary}00
    );
  }
`;

const PromptForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PromptLabel = styled.label`
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: bold;
  text-transform: uppercase;
`;

const PromptInputWrapper = styled.div`
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary}00,
      ${({ theme }) => theme.colors.primary}40,
      ${({ theme }) => theme.colors.primary}00
    );
  }
`;

const GenerateButton = styled(RetroButton)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  h3 {
    color: ${({ theme }) => theme.colors.accent};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-transform: uppercase;
  }
  
  p {
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const DebugLoginButton = styled(RetroButton)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const RandomPromptButton = styled(RetroButton)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
`;

const PromptExamples = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  button {
    background: ${({ theme }) => theme.colors.panelDark};
    color: ${({ theme }) => theme.colors.secondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.sizes.xsmall};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${({ theme }) => theme.colors.panel};
      color: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

function LandingPage() {
  const navigate = useNavigate();
  const { playSound } = useSoundContext();
  const { signInWithEmail } = useAuth();
  const { user } = useAuth();
  const { grantInitialCredits } = useUserContext();
  
  const [prompt, setPrompt] = useState('');
  
  const randomPromptExamples = [
    "A cute pixel art cat sitting on a rainbow",
    "Retro space ship with detailed thrusters",
    "Pixel art forest with a mysterious cabin",
    "8-bit style warrior with flaming sword",
    "Cyberpunk city street with neon signs",
    "Pixel art beach scene with palm trees",
    "Spooky haunted mansion with ghosts",
    "Pixel dragon guarding a treasure",
    "Retro style arcade game character",
    "Underwater scene with colorful fish"
  ];
  
  const handlePromptExample = (example) => {
    playSound('click');
    setPrompt(example);
  };
  
  const handleRandomPrompt = () => {
    playSound('click');
    const randomIndex = Math.floor(Math.random() * randomPromptExamples.length);
    setPrompt(randomPromptExamples[randomIndex]);
  };
  
  const handleGenerateClick = (e) => {
    e.preventDefault();
    playSound('click');
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }
    
    // Store prompt in sessionStorage so we can access it on the generator page
    sessionStorage.setItem('initialPrompt', prompt);
    navigate('/generator');
  };
  
  const handleDebugLogin = async () => {
    playSound('click');
    try {
      await signInWithEmail('test@pixpotion.com', 'test123');
      grantInitialCredits();
      toast.success('Logged in as test user with credits');
    } catch (error) {
      toast.error('Debug login failed');
      console.error(error);
    }
  };
  
  return (
    <PageContainer>
      <DebugLoginButton 
        onClick={handleDebugLogin} 
        color="secondary"
      >
        LOGIN DEBUG
      </DebugLoginButton>
      
      <HeroSection>
        <MainTitle>
          PIX<span>POTION</span>
        </MainTitle>
        <SubTitle>
          CREATE UNIQUE PIXEL ART WITH AI
        </SubTitle>
        
        <PromptContainer>
          <PromptForm onSubmit={handleGenerateClick}>
            <div>
              <PromptLabel>Tell me what pixel art to create for you</PromptLabel>
              <PromptInputWrapper>
                <RetroInput
                  type="text"
                  placeholder="Describe your pixel art in detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={{ fontSize: '1.4rem', padding: '20px', width: '100%' }}
                  autoFocus
                />
                <RandomPromptButton
                  onClick={handleRandomPrompt}
                  type="button"
                  color="secondary"
                  size="small"
                >
                  Random
                </RandomPromptButton>
              </PromptInputWrapper>
            </div>
            
            <PromptExamples>
              {randomPromptExamples.slice(0, 5).map((example, index) => (
                <button 
                  key={index} 
                  type="button" 
                  onClick={() => handlePromptExample(example)}
                >
                  {example.length > 25 ? example.substring(0, 22) + '...' : example}
                </button>
              ))}
            </PromptExamples>
            
            <GenerateButton 
              type="submit" 
              color="primary"
              size="large"
            >
              GENERATE PIXEL ART
            </GenerateButton>
          </PromptForm>
        </PromptContainer>
      </HeroSection>
      
      <FeaturesGrid>
        <FeatureCard>
          <div className="icon">🎮</div>
          <h3>AI-POWERED MAGIC</h3>
          <p>
            Transform your ideas into stunning pixel art with our
            state-of-the-art AI technology. Each creation is uniquely yours.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <div className="icon">⚡</div>
          <h3>INSTANT RESULTS</h3>
          <p>
            See your imagination come to life in seconds with
            our lightning-fast AI generation engine.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <div className="icon">🎨</div>
          <h3>UNLIMITED CREATIVITY</h3>
          <p>
            Discover endless creative possibilities with different
            styles, dimensions, and customization options.
          </p>
        </FeatureCard>
      </FeaturesGrid>
    </PageContainer>
  );
}

export default LandingPage; 