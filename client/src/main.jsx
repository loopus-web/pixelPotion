import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from 'styled-components'
import { AuthProvider } from './context/AuthContext'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'
import { SoundProvider } from './context/SoundContext'
import { UserProvider } from './context/UserContext'
import { MarketplaceProvider } from './context/MarketplaceContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyles />
          <UserProvider>
            <MarketplaceProvider>
              <SoundProvider>
                <App />
                <ToastContainer position="bottom-right" theme="dark" />
              </SoundProvider>
            </MarketplaceProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)