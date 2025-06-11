import { useEffect, useState } from 'react';
import styled from 'styled-components';

const CRTContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: ${({ active, theme }) => (active ? theme.effects.scanlineOpacity : 0)};
  transition: opacity 0.5s ease;
`;

const Scanlines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(10, 13, 18, 0) 50%, 
    rgba(5, 245, 230, 0.03) 50%
  );
  background-size: 100% 4px;
  z-index: 2;
`;

const Glow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(5, 245, 230, 0.01) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 1;
`;

const Flicker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 245, 230, 0.01);
  opacity: 0;
  z-index: 3;
  animation: flicker 0.15s infinite;
  
  @keyframes flicker {
    0% { opacity: 0.01; }
    5% { opacity: 0.008; }
    10% { opacity: 0.003; }
    15% { opacity: 0.016; }
    20% { opacity: 0.002; }
    25% { opacity: 0.018; }
    30% { opacity: 0.016; }
    35% { opacity: 0.006; }
    40% { opacity: 0.012; }
    45% { opacity: 0.014; }
    50% { opacity: 0.018; }
    55% { opacity: 0.016; }
    60% { opacity: 0.02; }
    65% { opacity: 0.022; }
    70% { opacity: 0.012; }
    75% { opacity: 0.01; }
    80% { opacity: 0.018; }
    85% { opacity: 0.02; }
    90% { opacity: 0.022; }
    95% { opacity: 0.006; }
    100% { opacity: 0.01; }
  }
`;

const VignetteBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.8);
  z-index: 3;
`;

const PixelNoise = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  z-index: 2;
`;

const CRTHelp = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.panelDark};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}50;
  padding: 8px;
  font-size: 10px;
  opacity: 0.5;
  transition: opacity 0.3s;
  z-index: 9998;
  pointer-events: all;
  cursor: pointer;
  letter-spacing: 0.5px;
  box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}30;
  
  &:hover {
    opacity: 1;
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}50;
  }
`;

function CRTEffect() {
  const [effectVisible, setEffectVisible] = useState(true);
  const [helpVisible, setHelpVisible] = useState(true);
  
  useEffect(() => {
    // Allow users to toggle the effect with a keyboard shortcut (F2)
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        setEffectVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Hide help after 20 seconds
    const timer = setTimeout(() => {
      setHelpVisible(false);
    }, 20000);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);
  
  const toggleEffect = () => {
    setEffectVisible(prev => !prev);
  };
  
  return (
    <>
      <CRTContainer active={effectVisible ? 1 : 0}>
        <Scanlines />
        <Glow />
        <Flicker />
        <VignetteBorder />
        <PixelNoise />
      </CRTContainer>
      
      {/* {helpVisible && (
        <CRTHelp onClick={toggleEffect}>
          F2: TOGGLE CRT EFFECT
        </CRTHelp>
      )} */}
    </>
  );
}

export default CRTEffect;