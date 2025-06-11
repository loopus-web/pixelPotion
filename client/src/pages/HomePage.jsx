import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSoundContext } from '../context/SoundContext';
import RetroButton from '../components/ui/RetroButton';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const HeroSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  text-shadow: 4px 4px 0px ${({ theme }) => theme.colors.panelDark};
  letter-spacing: 2px;
  
  span {
    color: ${({ theme }) => theme.colors.accent};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
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
  border-top-color: ${({ theme }) => theme.colors.borderLight};
  border-left-color: ${({ theme }) => theme.colors.borderLight};
  border-right-color: ${({ theme }) => theme.colors.borderDark};
  border-bottom-color: ${({ theme }) => theme.colors.borderDark};
  padding: ${({ theme }) => theme.spacing.lg};
  
  h3 {
    color: ${({ theme }) => theme.colors.accent};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-transform: uppercase;
  }
  
  p {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DemoImage = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border: ${({ theme }) => theme.borders.panel};
  max-width: 512px;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  img {
    width: 100%;
    height: auto;
    image-rendering: pixelated;
  }
`;

function HomePage() {
  const navigate = useNavigate();
  const { playSound } = useSoundContext();
  
  const handleGetStarted = () => {
    playSound('click');
    navigate('/generator');
  };
  
  return (
    <PageContainer>
      <HeroSection>
        <MainTitle>
          PIX<span>POTION</span>
        </MainTitle>
        <SubTitle>
          UNLEASH THE MAGIC OF AI-POWERED PIXEL ART GENERATION
        </SubTitle>
        
        <ButtonGroup>
          <RetroButton 
            onClick={handleGetStarted} 
            color="primary"
            size="large"
          >
            START GENERATING
          </RetroButton>
          <RetroButton 
            onClick={() => navigate('/plans')}
            color="secondary"
            size="large"
          >
            VIEW PLANS
          </RetroButton>
        </ButtonGroup>
        
        <DemoImage>
          <img 
            src="/images/dystopian.png" 
            alt="Demo Pixel Art" 
          />
        </DemoImage>
      </HeroSection>
      
      <FeaturesSection>
        <FeatureCard>
          <h3>AI-POWERED MAGIC</h3>
          <p>
            TRANSFORM YOUR IDEAS INTO STUNNING PIXEL ART WITH OUR
            STATE-OF-THE-ART AI TECHNOLOGY. EACH CREATION IS UNIQUELY YOURS.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>UNMATCHED QUALITY</h3>
          <p>
            ACHIEVE PIXEL-PERFECT PRECISION WITH ADVANCED ALGORITHMS
            THAT DELIVER EXCEPTIONAL DETAIL AND STUNNING CLARITY.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>COMPLETE CONTROL</h3>
          <p>
            MASTER YOUR CREATIONS WITH PRECISE CONTROLS OVER
            DIMENSIONS, STYLES, AND EVERY ARTISTIC DETAIL.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>INSTANT MAGIC</h3>
          <p>
            SEE YOUR IMAGINATION COME TO LIFE IN SECONDS WITH
            OUR LIGHTNING-FAST AI GENERATION ENGINE.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>INFINITE POSSIBILITIES</h3>
          <p>
            DISCOVER ENDLESS CREATIVE POSSIBILITIES WITH ADVANCED
            STYLE MIXING AND UNIQUE GENERATION OPTIONS.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <h3>PREMIUM QUALITY</h3>
          <p>
            CREATE HIGH-RESOLUTION MASTERPIECES UP TO 512×512
            WITH PROFESSIONAL QUALITY AND STUNNING DETAIL.
          </p>
        </FeatureCard>
      </FeaturesSection>
    </PageContainer>
  );
}

export default HomePage;