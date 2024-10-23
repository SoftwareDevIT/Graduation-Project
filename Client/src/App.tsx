import "./App.css";

import OrderPage from "./component/Oders/OrderPage";
import OrderCheckout from "./component/Pay/OderCheckOut";
import CinemaSeatSelection from "./component/SeatMap/CinemaSeatSelection";
import Headerticket from "./component/Headerticket/Headerticket";

import RegisterCinema from "./Page/Client/RegisterCinema";
import LoginCinema from "./Page/Client/LoginCinema";
import Dashboard from "./Page/Admin/Dashboard/Dashboard";
import User from "./Page/Admin/User/UserManager";
import ShowtimesManager from "./Page/Admin/Showtimes/ShowtimesManager";
import OrdersManager from "./Page/Admin/Orders/OrdersManager";
import TicketsManager from "./Page/Admin/Tickets/TicketsManager";
import PostsManager from "./Page/Admin/Posts/PostsManager";
import CategoriesManager from "./Page/Admin/Categories/CategoriesManager";
import CountriesManager from "./Page/Admin/Countries/CountriesManager";
import ComboManager from "./Page/Admin/Combo/ComboManager";
import CinemasManager from "./Page/Admin/Cinemas/CinemasManager";
import MoviesManager from "./Page/Admin/Movies/MoviesManager";
import SchedulesManager from "./Page/Admin/Schedules/SchedulesManager";
import RevenueByCinemaManager from "./Page/Admin/RevenueByCinema/RevenueByCinemaManager";
import RevenueByMoviesManager from "./Page/Admin/RevenueByMoviesManager/RevenueByMoviesManager";
import { Route, Routes } from "react-router-dom";
import EmailConfirm from "./component/EmailConfirm/EmailConfirm";
import UserAddManager from "./Page/Admin/User/UserAdd";
import Home from "./Page/Home";
import Bookcinematickets from "./Page/Client/Bookcinematickets";

import CinemasFormManager from "./Page/Admin/Cinemas/CinemasForm";
import ComboFormManager from "./Page/Admin/Combo/ComboForm";
import ShowtimesFormManager from "./Page/Admin/Showtimes/ShowtimesForm";

import MoviesManagerForm from "./Page/Admin/Movies/MoviesForm";
import PaymentCallback from "./component/Pay/PaymentCallback";

import PostsFormManager from "./Page/Admin/Posts/PostForm";

import LichChieu from "./component/MovieDetail/LichChieu";
import DanhGia from "./component/MovieDetail/DanhGia";
import TinTuc from "./component/MovieDetail/TinTuc";

import { ContentMovie } from "./component/MovieDetail/ContentMovie";
import CountriesFormManager from "./Page/Admin/Countries/CountriesForm";
import MoviesAddManager from "./Page/Admin/Movies/MoviesForm";

import CategoriesFormManager from "./Page/Admin/Categories/CategoriesForm";

import MuaVe from "./component/MovieDetail/MuaVe";

import SerachMovies from "./component/SerachMovies/SerachMovies";
import FilmNews from "./component/Film news/FilmNews";

import Personal from "./component/PersonalPage/Personal";
import ChangePassword from "./component/PersonalPage/ChangePassword";
import Profile from "./component/PersonalPage/Profile";



function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/buy-ticket" element={<Bookcinematickets />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/pay" element={<OrderCheckout />} />
        <Route path="/seat" element={<CinemaSeatSelection />} />
        <Route path="/movie-detail/:id" element={<ContentMovie />} />
        <Route path="/schedule/:id" element={<LichChieu />} />
        <Route path="/reviews/:id" element={<DanhGia />} />
        <Route path="/news/:id" element={<TinTuc />} />
        <Route path="/buy-now/:id" element={<MuaVe />} />
        <Route path="/headerticket" element={<Headerticket />} />
        <Route path="/confirm" element={<EmailConfirm />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="/FilmNews" element={<FilmNews/>} />
       

        <Route path="/movie/search/:movie_name" element={<SerachMovies />} />

        <Route path="/profile" element={<Profile/>} />
        <Route path="/Personal" element={<Personal/>} />
        <Route path="/ChangePassword" element={<ChangePassword/>} />
    
        <Route path="/register" element={<RegisterCinema />} />
        <Route path="/login" element={<LoginCinema />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="admin/user" element={<User />} />
        <Route path="admin/user/add" element={<UserAddManager />} />

        <Route path="admin/showtimes" element={<ShowtimesManager />} />
        <Route path="admin/showtimes/add" element={<ShowtimesFormManager />} />
        <Route
          path="admin/showtimes/edit/:id"
          element={<ShowtimesFormManager />}
        />

        <Route path="admin/orders" element={<OrdersManager />} />
        <Route path="admin/tickets" element={<TicketsManager />} />
        <Route path="admin/posts" element={<PostsManager />} />
        <Route path="admin/posts/add" element={<PostsFormManager />} />
        <Route path="admin/posts/edit/:id" element={<PostsFormManager />} />
        <Route path="admin/categories" element={<CategoriesManager />} />
        <Route
          path="admin/categories/add"
          element={<CategoriesFormManager />}
        />
        <Route
          path="admin/categories/edit/:id"
          element={<CategoriesFormManager />}
        />
        <Route path="admin/countries" element={<CountriesManager />} />
        <Route path="admin/countries/add" element={<CountriesFormManager />} />
        <Route
          path="admin/countries/edit/:id"
          element={<CountriesFormManager />}
        />
        <Route path="admin/combo" element={<ComboManager />} />
        <Route path="admin/combo/add" element={<ComboFormManager />} />
        <Route path="admin/combo/edit/:id" element={<ComboFormManager />} />
        <Route path="admin/cinemas" element={<CinemasManager />} />
        <Route path="admin/cinemas/add" element={<CinemasFormManager />} />
        <Route path="admin/cinemas/edit/:id" element={<CinemasFormManager />} />
        <Route path="admin/movies" element={<MoviesManager />} />
        <Route path="admin/movies/add" element={<MoviesManagerForm />} />
        <Route path="admin/movies/add" element={<MoviesAddManager />} />
        <Route path="admin/movies/edit/:id" element={<MoviesAddManager />} />

        <Route path="admin/schedules" element={<SchedulesManager />} />
        <Route
          path="admin/revenuebycinema"
          element={<RevenueByCinemaManager />}
        />
        <Route
          path="admin/revenuebymovie"
          element={<RevenueByMoviesManager />}
        />
      </Routes>
    </>
  );
}

export default App;
