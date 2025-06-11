import React from 'react';
import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';

const SliderContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  position: relative;
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 20px;
  background: ${({ theme }) => theme.colors.panel};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  outline: none;
  opacity: 0.9;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary}80;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    z-index: 2;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 12px ${({ theme }) => theme.colors.primary};
    }
    
    &:active {
      transform: scale(0.95);
    }
  }

  &::-moz-range-thumb {
    width: 28px;
    height: 28px;
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary}80;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 12px ${({ theme }) => theme.colors.primary};
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const SliderTrack = styled.div`
  position: absolute;
  height: 8px;
  background: linear-gradient(to right, 
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary});
  top: 50%;
  transform: translateY(-50%);
  left: 4px;
  right: 4px;
  border-radius: 2px;
  z-index: 1;
  pointer-events: none;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    top: 50%;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.colors.primary}30;
    filter: blur(2px);
  }
`;

// Fills track to current value
const SliderFill = styled.div`
  position: absolute;
  height: 8px;
  background: ${({ theme }) => theme.colors.primary};
  top: 50%;
  transform: translateY(-50%);
  left: 4px;
  width: ${props => props.fillPercentage}%;
  border-radius: 2px;
  z-index: 1;
  pointer-events: none;
  box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}60;
`;

const RetroSlider = ({
  min = 0,
  max = 1,
  step = 0.1,
  value,
  onChange,
  id
}) => {
  const { playSound } = useSoundContext();
  
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };
  
  // Calculate fill percentage for visual feedback
  const fillPercentage = ((value - min) / (max - min)) * 100;

  return (
    <SliderContainer>
      <SliderTrack />
      <SliderFill fillPercentage={fillPercentage} />
      <SliderInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        id={id}
      />
    </SliderContainer>
  );
};

export default RetroSlider;
