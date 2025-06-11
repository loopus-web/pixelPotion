import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Amstrad CPC';
    src: url('https://fonts.cdnfonts.com/s/34747/amstrad_cpc464.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.bright.white};
    overflow-x: hidden;
    line-height: 1.6;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
  }

  /* Particle effect background */
  body:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(${({ theme }) => theme.colors.primary}05 1px, transparent 1px),
      radial-gradient(${({ theme }) => theme.colors.primary}05 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
    z-index: -1;
    opacity: 0.1;
    pointer-events: none;
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* CRT Effect */
  .crt-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.08;
  }
  
  /* Scanlines */
  .crt-effect::before {
    content: "";
    position: fixed;
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
  }
  
  /* CRT Flicker */
  .crt-effect::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(5, 245, 230, 0.01);
    opacity: 0;
    z-index: 3;
    animation: flicker 0.15s infinite;
  }
  
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
  
  /* Retro Button */
  button, select, input[type="submit"] {
    font-family: ${({ theme }) => theme.fonts.main};
    padding: 10px 18px;
    border: ${({ theme }) => theme.borders.panel};
    border-top-color: ${({ theme }) => theme.colors.borderLight};
    border-left-color: ${({ theme }) => theme.colors.borderLight};
    border-right-color: ${({ theme }) => theme.colors.borderDark};
    border-bottom-color: ${({ theme }) => theme.colors.borderDark};
    background-color: ${({ theme }) => theme.colors.buttonBg};
    color: ${({ theme }) => theme.colors.buttonText};
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    font-size: ${({ theme }) => theme.fonts.sizes.regular};
    letter-spacing: 1px;
  }

  button:hover, select:hover, input[type="submit"]:hover {
    filter: brightness(1.1);
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}30;
  }

  button:active, select:active, input[type="submit"]:active {
    border-top-color: ${({ theme }) => theme.colors.borderDark};
    border-left-color: ${({ theme }) => theme.colors.borderDark};
    border-right-color: ${({ theme }) => theme.colors.borderLight};
    border-bottom-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(1px);
  }

  /* Click effect */
  button:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(5, 245, 230, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }

  button:active:after {
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

  /* Input Fields */
  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.inputBg};
    border: ${({ theme }) => theme.borders.input};
    border-top-color: ${({ theme }) => theme.colors.borderDark};
    border-left-color: ${({ theme }) => theme.colors.borderDark};
    border-right-color: ${({ theme }) => theme.colors.borderLight};
    border-bottom-color: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.inputText};
    padding: 10px 12px;
    font-size: ${({ theme }) => theme.fonts.sizes.regular};
    outline: none;
    transition: all 0.2s;
    letter-spacing: 0.5px;
  }

  input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary}40, 0 0 5px ${({ theme }) => theme.colors.primary}30;
  }

  /* Container */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.main};
    color: ${({ theme }) => theme.colors.bright.white};
    margin-bottom: 16px;
    line-height: 1.2;
    letter-spacing: 1px;
  }
  
  h1 {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}40;
  }

  h2 {
    position: relative;
    display: inline-block;
  }

  h2:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary}00, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.primary}00
    );
  }
  
  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: all 0.2s;
    position: relative;
    font-weight: bold;
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}20;
  }
  
  a:hover {
    color: ${({ theme }) => theme.colors.bright.white};
    text-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  }

  a:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s;
  }

  a:hover:after {
    width: 100%;
  }

  /* Text selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary}80;
    color: ${({ theme }) => theme.colors.background};
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.panelDark};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderLight};
    border: 2px solid ${({ theme }) => theme.colors.panelDark};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  /* Cursor blink animation for various elements */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  /* Glowing animation */
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 2px ${({ theme }) => theme.colors.primary}50); }
    50% { filter: drop-shadow(0 0 5px ${({ theme }) => theme.colors.primary}80); }
  }

  /* Pixel grid overlay - can be enabled via class */
  .pixel-grid {
    background-image: linear-gradient(rgba(5, 245, 230, 0.05) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(5, 245, 230, 0.05) 1px, transparent 1px);
    background-size: ${({ theme }) => theme.effects.pixelSize} ${({ theme }) => theme.effects.pixelSize};
  }
`