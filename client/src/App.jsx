import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSoundContext } from './context/SoundContext'
import styled from 'styled-components'
import { useAuth } from './context/AuthContext'

// Pages
import LoginPage from './pages/LoginPage'
import AuthPage from './pages/AuthPage'
import GeneratorPage from './pages/GeneratorPage'
import ProfilePage from './pages/ProfilePage'
import GalleryPage from './pages/GalleryPage'
import PlansPage from './pages/PlansPage'
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import MarketplacePage from './pages/MarketplacePage';
import ContactPage from './pages/ContactPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import StripeRedirect from './pages/StripeRedirect';
import LandingPage from './pages/LandingPage';

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CRTEffect from './components/effects/CRTEffect'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
`

function App() {
  const { playSound } = useSoundContext();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Simulate startup/boot sequence
  useEffect(() => {
    playSound('startup');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      playSound('ready');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [playSound]);

  if (isLoading) {
    return <BootScreen />;
  }

  return (
    <AppContainer>
      <CRTEffect />
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Unprotected generator route for direct access */}
          <Route path="/generator" element={<GeneratorPage />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          } />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="/stripe-redirect" element={
            <StripeRedirect />
          } />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  )
}

// Boot screen component
const BootScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.main};
  
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
    text-transform: uppercase;
  }
  
  .boot-text {
    font-size: ${({ theme }) => theme.fonts.sizes.regular};
    text-align: left;
    max-width: 600px;
    line-height: 1.6;
  }
  
  .cursor {
    display: inline-block;
    width: 12px;
    height: 20px;
    background: ${({ theme }) => theme.colors.primary};
    margin-left: 4px;
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
`

function BootScreen() {
  const [bootText, setBootText] = useState('');
  const fullText = `
Welcome to PIXPOTION!

Create, edit, and share pixel art inspired by retro graphics, directly from your browser. Dive into a fun and intuitive experience, perfect for enthusiasts and newcomers alike.
`;
  
  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setBootText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BootScreenContainer>
      <img src="/images/logo.png" alt="PixPotion logo" className="logo" />
      <h1>PIXPOTION</h1>
      <div className="boot-text">
        {bootText.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <span className="cursor"></span>
      </div>
    </BootScreenContainer>
  );
}

export default App