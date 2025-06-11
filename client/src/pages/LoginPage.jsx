import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import RetroButton from '../components/ui/RetroButton';
import { useSoundContext } from '../context/SoundContext';
import { useUserContext } from '../context/UserContext';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10, ${({ theme }) => theme.colors.background});
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.strong};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary}00,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary}00
    );
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
  text-transform: uppercase;
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}40;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.panel}ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  color: ${({ theme }) => theme.colors.primary};
  backdrop-filter: blur(3px);
  
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

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fonts.sizes.regular};
  line-height: 1.6;
`;

const GoogleButton = styled(RetroButton)`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  img {
    width: 24px;
    height: 24px;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    
    img {
      transform: scale(1.1);
    }
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormContainer = styled.form`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InputField = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fonts.sizes.regular};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
`;

const ToggleText = styled.button`
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: underline;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function LoginPage() {
  const { user, signInWithProvider, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const { grantInitialCredits } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSound } = useSoundContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleProviderLogin = async (provider, e) => {
    if (e) e.preventDefault();
    playSound('click');
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        grantInitialCredits();
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        {isLoading && <LoadingOverlay>{isSignUp ? 'CREATING ACCOUNT' : 'SIGNING IN'}</LoadingOverlay>}
        <Title>Welcome to PixPotion</Title>
        <Subtitle>
          SIGN IN TO START CREATING AMAZING PIXEL ART WITH AI
        </Subtitle>
        <SocialButtonsContainer>
          <GoogleButton 
            onClick={(e) => handleProviderLogin('google', e)} 
            color="primary" 
            fullWidth
            type="button"
          >
            <img src="/icons/google.svg" alt="Google" style={{ width: 20, marginRight: 8 }} />
            Sign in with Google
          </GoogleButton>
          <GoogleButton 
            onClick={(e) => handleProviderLogin('github', e)} 
            color="secondary" 
            fullWidth
            type="button"
          >
            <img src="/icons/github.svg" alt="GitHub" style={{ width: 20, marginRight: 8 }} />
            Sign in with GitHub
          </GoogleButton>
          <GoogleButton 
            onClick={(e) => handleProviderLogin('discord', e)} 
            color="accent" 
            fullWidth
            type="button"
          >
            <img src="/icons/discord.svg" alt="Discord" style={{ width: 20, marginRight: 8 }} />
            Sign in with Discord
          </GoogleButton>
        </SocialButtonsContainer>
        <RetroButton 
          onClick={() => setShowEmailForm(!showEmailForm)} 
          color={showEmailForm ? "secondary" : "accent"} 
          fullWidth
          style={{ marginBottom: '1rem' }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg" alt="Email Icon" style={{ width: 20, marginRight: 8 }} />
          {showEmailForm ? 'HIDE EMAIL LOGIN' : 'SIGN IN WITH EMAIL'}
        </RetroButton>
        {showEmailForm && (
          <FormContainer onSubmit={handleEmailSubmit}>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <ErrorText>{error}</ErrorText>}
            <RetroButton type="submit" color="primary">
              {isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
            </RetroButton>
            <ToggleText type="button" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </ToggleText>
          </FormContainer>
        )}
      </LoginCard>
    </PageContainer>
  );
}

export default LoginPage;