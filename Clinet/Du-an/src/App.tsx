
import "./App.css";





import OrderPage from "./component/Oders/OrderPage";
import OrderCheckout from "./component/Pay/OderCheckOut";
import CinemaSeatSelection from "./component/SeatMap/CinemaSeatSelection";
import Headerticket from "./component/Headerticket/Headerticket";
import Home from "./Page/Client/Home";
import Bookcinematickets from "./Page/Client/Bookcinematickets";
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



function App() {
  return (
    <>
      <Routes>
      <Route index element={<Home/>}/>
      <Route path="/muave" element={<Bookcinematickets/>}/>
      <Route path="/orders" element={<OrderPage/>}/>
      <Route path="/pay" element={<OrderCheckout/>}/>
      <Route path="/seat" element={<CinemaSeatSelection/>}/>
      <Route path="/headerticket" element={<Headerticket/>}/>
      <Route path="/confirm" element={<EmailConfirm/>}/>


      <Route path="/register" element={<RegisterCinema/>}/>
      <Route path="/login" element={<LoginCinema/>}/>

      <Route path="/admin" element={<Dashboard/>}/>
      <Route path="admin/user" element={<User/>}/>
      <Route path="admin/user/add" element={<UserAddManager/>}/>
      <Route path="admin/showtimes" element={<ShowtimesManager/>}/>
      <Route path="admin/orders" element={<OrdersManager/>}/>
      <Route path="admin/tickets" element={<TicketsManager/>}/>
      <Route path="admin/posts" element={<PostsManager/>} />
      <Route path="admin/categories" element={<CategoriesManager/>} />
      <Route path="admin/countries" element={<CountriesManager/>} />
      <Route path="admin/combo" element={<ComboManager/>} />
      <Route path="admin/cinemas" element={<CinemasManager/>} />
      <Route path="admin/movies" element={<MoviesManager/>} />
      <Route path="admin/schedules" element={<SchedulesManager  />} />
      <Route path="admin/revenuebycinema" element={<RevenueByCinemaManager/>} />
      <Route path="admin/revenuebymovie" element={<RevenueByMoviesManager/>} />

      </Routes>

    </>
  );
}

export default App;
