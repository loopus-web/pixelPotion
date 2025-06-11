import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';

const Select = styled.select`
  appearance: none;
  font-family: ${({ theme }) => theme.fonts.main};
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.borderDark};
  border-left-color: ${({ theme }) => theme.colors.borderDark};
  border-right-color: ${({ theme }) => theme.colors.borderLight};
  border-bottom-color: ${({ theme }) => theme.colors.borderLight};
  color: ${({ theme }) => theme.colors.inputText};
  padding: 10px 36px 10px 12px;
  width: 100%;
  font-size: ${({ theme }) => theme.fonts.sizes.regular};
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2305f5e6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 20px;
  
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary}40, 
                0 0 8px ${({ theme }) => theme.colors.primary}30,
                inset 0 1px 3px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary}60;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderLight};
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}20;
  }
  
  /* Arrow glow on hover */
  &:hover {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2305f5e6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
  }
`;

const Option = styled.option`
  background-color: ${({ theme }) => theme.colors.panelDark};
  color: ${({ theme }) => theme.colors.inputText};
  padding: 10px;
`;

function RetroSelect({
  onChange,
  options = [],
  ...props
}) {
  const { playSound } = useSoundContext();
  
  const handleChange = (e) => {
    playSound('click');
    if (onChange) onChange(e);
  };
  
  const handleFocus = () => {
    playSound('click');
  };
  
  return (
    <Select
      onChange={handleChange}
      onFocus={handleFocus}
      {...props}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}

export default RetroSelect;