import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';

const Input = styled.input`
  font-family: ${({ theme }) => theme.fonts.main};
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.borderDark};
  border-left-color: ${({ theme }) => theme.colors.borderDark};
  border-right-color: ${({ theme }) => theme.colors.borderLight};
  border-bottom-color: ${({ theme }) => theme.colors.borderLight};
  color: ${({ theme }) => theme.colors.inputText};
  padding: 10px 12px;
  width: 100%;
  font-size: ${({ theme }) => theme.fonts.sizes.regular};
  outline: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary}40, 
                0 0 8px ${({ theme }) => theme.colors.primary}30,
                inset 0 1px 3px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary}60;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
    font-style: italic;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
  
  /* Custom selection */
  &::selection {
    background-color: ${({ theme }) => theme.colors.primary}50;
    color: ${({ theme }) => theme.colors.inputText};
  }
  
  /* Pixel cursor effect */
  &:focus {
    caret-color: ${({ theme }) => theme.colors.primary};
  }
`;

function RetroInput({
  onChange,
  onFocus,
  onBlur,
  name,
  ...props
}) {
  const { playSound } = useSoundContext();
  
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };
  
  const handleFocus = (e) => {
    playSound('click');
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    // Si le champ est width ou height et valeur > 512, on force à 512
    if ((name === 'width' || name === 'height') && Number(e.target.value) > 512) {
      if (onChange) {
        const event = {
          ...e,
          target: { ...e.target, value: '512', name }
        };
        onChange(event);
      }
    }
    if (onBlur) onBlur(e);
  };
  
  const handleKeyPress = () => {
    playSound('hover');
  };
  
  return (
    <Input
      name={name}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      {...props}
    />
  );
}

export default RetroInput;