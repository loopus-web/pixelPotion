import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.panel};
  border-top: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Copyright = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
`;

const VersionInfo = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.panelDark};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  a, Link {
    color: ${({ theme }) => theme.colors.accent};
    text-transform: uppercase;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

function Footer() {
  const { playSound } = useSoundContext();
  
  const handleLinkHover = () => {
    playSound('hover');
  };
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          &copy; {new Date().getFullYear()} PIXPOTION
        </Copyright>
        
        <VersionInfo>
          AI-POWERED PIXEL ART GENERATOR / VERSION 1.0.0
        </VersionInfo>
        
        <FooterLinks>
          <Link to="/terms" onMouseEnter={handleLinkHover}>Terms</Link>
          <Link to="/privacy" onMouseEnter={handleLinkHover}>Privacy</Link>
          <a href="#" onMouseEnter={handleLinkHover}>Contact</a>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;