import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CinemaProvider } from './Context/CinemasContext.tsx'
import { ComboProvider } from './Context/ComboContext.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <CinemaProvider>
      <ComboProvider>
        
    <App />
    
    </ComboProvider>
    </CinemaProvider>
    </BrowserRouter>
  </StrictMode>,
)
