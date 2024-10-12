import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'


import 'bootstrap/dist/css/bootstrap.min.css';
import { CinemaProvider } from './Context/CinemasContext.tsx'
import { ComboProvider } from './Context/ComboContext.tsx'



import { CountryProvider } from './Context/CountriesContext.tsx'
import { CategoryProvider } from './Context/CategoriesContext.tsx'

import { MovieProvider } from './Context/MoviesContext.tsx'
import { PostProvider } from './Context/PostContext.tsx'









createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <CinemaProvider>
      <ComboProvider>
      <MovieProvider>
     <PostProvider>
          <CountryProvider>
            <CategoryProvider>
           
    <App />
  
    </CategoryProvider>
    </CountryProvider>
    </PostProvider>
    </MovieProvider>
    </ComboProvider>
    </CinemaProvider>
    </BrowserRouter>
  </StrictMode>,
)
