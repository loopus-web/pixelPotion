import styled, { keyframes, css } from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';

const loadingAnimation = keyframes`
  0% { content: "·"; }
  33% { content: "··"; }
  66% { content: "···"; }
  100% { content: "·"; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(5, 245, 230, 0.2); }
  50% { box-shadow: 0 0 15px rgba(5, 245, 230, 0.4); }
  100% { box-shadow: 0 0 5px rgba(5, 245, 230, 0.2); }
`;

const Button = styled.button`
  font-family: ${({ theme }) => theme.fonts.main};
  padding: ${({ size, small }) => {
    if (small) return '6px 10px';
    switch (size) {
      case 'large': return '14px 28px';
      case 'small': return '6px 10px';
      default: return '10px 18px';
    }
  }};
  font-size: ${({ theme, size, small }) => {
    if (small) return theme.fonts.sizes.small;
    switch (size) {
      case 'large': return theme.fonts.sizes.large;
      case 'small': return theme.fonts.sizes.small;
      default: return theme.fonts.sizes.regular;
    }
  }};
  background-color: ${({ theme, color }) => {
    switch (color) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'accent': return theme.colors.accent;
      default: return theme.colors.buttonBg;
    }
  }};
  color: ${({ theme, color }) => {
    switch (color) {
      case 'primary':
      case 'secondary':
      case 'accent':
        return '#000000';
      default:
        return theme.colors.buttonText;
    }
  }};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.borderLight};
  border-left-color: ${({ theme }) => theme.colors.borderLight};
  border-right-color: ${({ theme }) => theme.colors.borderDark};
  border-bottom-color: ${({ theme }) => theme.colors.borderDark};
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-shadow: ${({ color }) => color ? '0 1px 1px rgba(0,0,0,0.3)' : 'none'};
  
  &:hover:not(:disabled) {
    filter: brightness(1.2);
    transform: translateY(-1px);
    box-shadow: 0 0 8px ${({ theme, color }) => 
      color === 'primary' ? theme.colors.primary + '60' : 
      color === 'secondary' ? theme.colors.secondary + '60' : 
      color === 'accent' ? theme.colors.accent + '60' : 
      'rgba(0,0,0,0.1)'};
  }
  
  &:active:not(:disabled) {
    border-top-color: ${({ theme }) => theme.colors.borderDark};
    border-left-color: ${({ theme }) => theme.colors.borderDark};
    border-right-color: ${({ theme }) => theme.colors.borderLight};
    border-bottom-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(1px);
    filter: brightness(0.95);
    box-shadow: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.5);
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }

  &:active:after {
    opacity: 0.4;
    animation: ripple 0.6s ease-out;
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0) translate(-50%, -50%);
      opacity: 0.4;
    }
    100% {
      transform: scale(20, 20) translate(-50%, -50%);
      opacity: 0;
    }
  }
  
  ${({ loading }) => loading && css`
    &::after {
      content: "·";
      animation: ${loadingAnimation} 1s infinite;
      margin-left: 6px;
    }
  `}

  ${({ color, theme }) => color === 'primary' && css`
    animation: ${glowAnimation} 3s infinite;
  `}

  ${({ size }) => size === 'large' && css`
    letter-spacing: 1px;
    font-weight: bold;
    animation: ${pulseAnimation} 3s infinite;
  `}

  /* Pixel art border effect */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
`;

function RetroButton({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  loading = false,
  color = 'default',
  size = 'medium',
  small = false,
  ...props 
}) {
  const { playSound } = useSoundContext();
  
  const handleClick = (e) => {
    if (!disabled && !loading) {
      playSound('click');
      if (onClick) onClick(e);
    }
  };
  
  const handleMouseEnter = () => {
    if (!disabled && !loading) {
      playSound('hover');
    }
  };
  
  return (
    <Button
      type={type}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled || loading}
      loading={loading}
      color={color}
      size={size}
      small={small}
      {...props}
    >
      {children}
    </Button>
  );
}

export default RetroButton;