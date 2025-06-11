export const theme = {
  colors: {
    // Modern dark theme with teal accents
    background: '#0B1117',     // Rich dark background
    primary: '#00E5CC',        // Vibrant teal for primary elements
    secondary: '#00B4A2',      // Muted teal for secondary elements
    accent: '#3CEFFF',         // Bright cyan for accents
    accentHover: '#66F4FF',    // Lighter cyan for hover states
    buttonBg: '#151a21',       // Dark charcoal for buttons
    buttonText: '#e0e6eb',     // Off-white for text
    inputBg: '#0f1318',        // Slightly lighter than background
    inputText: '#d8e0e6',      // Light gray for input text
    success: '#00E5A0',        // Bright teal success
    warning: '#f5b70a',        // Amber warning
    error: '#ff4a5f',          // Soft red error
    border: '#1e2530',         // Dark border
    borderLight: '#2a3342',    // Lighter border for depth
    borderDark: '#101520',     // Darker border for depth
    panel: '#131B23',          // Refined panel background
    panelDark: '#0D1419',      // Darker panel sections
    // Additional colors
    bright: {
      black: '#000000',
      white: '#e6e9ed',        // Slightly off-white
      cyan: '#00E5CC',         // Main teal
      magenta: '#FF4AEA',      // Vibrant magenta
      yellow: '#e9d054',       // Soft yellow
      orange: '#ff8e4a'        // Soft orange
    }
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  fonts: {
    main: "'Amstrad CPC', monospace",
    sizes: {
      small: '14px',
      regular: '16px',
      large: '20px',
      xlarge: '24px',
      xxlarge: '32px'
    }
  },
  borders: {
    radius: '0px',        // Square corners for pixel art aesthetic
    panel: '1px solid #1e2530',  // Thinner border for elegance
    input: '1px solid #1e2530'   // Thinner border for elegance
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px'
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.3)',
    strong: '0 8px 16px rgba(0, 0, 0, 0.4)',
    glow: '0 0 8px rgba(5, 245, 230, 0.4)'    // Turquoise glow
  },
  transitions: {
    fast: '0.1s',
    normal: '0.2s',
    slow: '0.4s'
  },
  effects: {
    scanlineOpacity: 0.03,      // More subtle scanlines
    glowIntensity: 0.3,         // Refined glow
    hoverScale: 1.02,           // Slight hover scale
    particleDensity: 20,        // For particle effects
    pixelSize: '1px'            // Size of pixel effects
  }
}