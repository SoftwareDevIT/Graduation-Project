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
import { ShowtimeProvider } from './Context/ShowtimesContext.tsx'
import { NewsProvider } from './Context/NewsContext.tsx'
import { UserProvider } from './Context/UserContext.tsx'










createRoot(document.getElementById('root')!).render(
  

    <BrowserRouter>
    <CinemaProvider>
      <ComboProvider>
      <MovieProvider>
     <PostProvider>
          
            <CategoryProvider>
              <ShowtimeProvider>
              <NewsProvider>
         
                <CountryProvider>
                <UserProvider>
    <App />
    </UserProvider>
    </CountryProvider>
    </NewsProvider>
    </ShowtimeProvider>
    </CategoryProvider>
   
    </PostProvider>
    </MovieProvider>
    </ComboProvider>
    </CinemaProvider>
    </BrowserRouter>
  // </StrictMode>,
)
