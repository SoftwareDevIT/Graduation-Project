
import Slider from 'react-slick'
import './App.css'
import MovieBanner from './component/Banner/MovieBanner'
import Footer from './component/Footer/Footer'
import Header from './component/Hearder/Hearder'
import NewsContent from './component/NewContent/NewsContent'
import NewsAndReview from './component/NewsAndReview/NewsAndReview'



function App() {
  

  return (
    <>
     <Header/>
     <MovieBanner/>
     <NewsContent/>
     <NewsAndReview/>
    <Footer/>
    </>
  )
}

export default App
