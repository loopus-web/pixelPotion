import { useState } from 'react';
import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 28px;
  background-color: ${({ theme, checked }) => 
    checked ? theme.colors.primary + '80' : theme.colors.panelDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.borderDark};
  border-left-color: ${({ theme }) => theme.colors.borderDark};
  border-right-color: ${({ theme }) => theme.colors.borderLight};
  border-bottom-color: ${({ theme }) => theme.colors.borderLight};
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  border-radius: 2px;

  &:hover {
    filter: brightness(1.1);
    box-shadow: ${({ theme, checked }) => 
      checked ? `0 0 8px ${theme.colors.primary}50` : 'none'};
  }
  
  /* Pixel art style toggle track */
  &:before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    height: 1px;
    background-color: ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'};
    box-shadow: 0 2px 0 ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'}, 
    0 4px 0 ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'}, 
    0 6px 0 ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'}, 
    0 8px 0 ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'}, 
    0 10px 0 ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'}, 
    0 12px 0 ${({ theme, checked }) => 
    checked ? theme.colors.primary : 'rgba(255,255,255,0.1)'};
    opacity: 0.2;
  }
`;

const ToggleKnob = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ checked }) => checked ? 'calc(100% - 22px)' : '6px'};
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: ${({ theme, checked }) => 
    checked ? theme.colors.primary : theme.colors.bright.white + '50'};
  transition: left 0.2s, background-color 0.2s, box-shadow 0.2s;
  box-shadow: ${({ checked, theme }) => 
    checked ? `0 0 8px ${theme.colors.primary}80` : 'none'};
    
  /* Pixel art style toggle knob */
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 2px;
    height: 2px;
    background-color: rgba(255,255,255,0.8);
    box-shadow: 4px 0 0 rgba(255,255,255,0.3),
                0 4px 0 rgba(255,255,255,0.3),
                4px 4px 0 rgba(255,255,255,0.2),
                8px 0 0 rgba(0,0,0,0.1),
                0 8px 0 rgba(0,0,0,0.1),
                8px 8px 0 rgba(0,0,0,0.1);
    opacity: ${({ checked }) => checked ? 0.7 : 0.3};
  }
`;

const ToggleLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme, checked }) => 
    checked ? theme.colors.primary : theme.colors.bright.white + '60'};
  transition: color 0.2s, text-shadow 0.2s;
  text-shadow: ${({ checked, theme }) => 
    checked ? `0 0 5px ${theme.colors.primary}30` : 'none'};
  letter-spacing: 0.5px;
`;

function RetroToggle({
  checked = false,
  onChange,
  name,
  label
}) {
  const { playSound } = useSoundContext();
  const [isChecked, setIsChecked] = useState(checked);
  
  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    playSound('toggle');
    if (onChange) onChange(newValue);
  };
  
  return (
    <ToggleContainer>
      <ToggleSwitch checked={isChecked} onClick={handleToggle}>
        <ToggleKnob checked={isChecked} />
      </ToggleSwitch>
      {label && (
        <ToggleLabel checked={isChecked}>{label}</ToggleLabel>
      )}
    </ToggleContainer>
  );
}

export default RetroToggle;