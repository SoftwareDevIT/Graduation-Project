
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
import AddMovie from "./component/Admin/MoviesDashboard/MovieAdd";
import MoviesManagerForm from "./Page/Admin/Movies/MoviesForm";
import PaymentCallback from "./component/Pay/PaymentCallback";
import PostsFormManager from "./Page/Admin/Posts/PostForm";
import { ContentMovie } from "./component/MovieDetail/ContentMovie";
import LichChieu from "./component/MovieDetail/LichChieu";
import DanhGia from "./component/MovieDetail/DanhGia";
import TinTuc from "./component/MovieDetail/TinTuc";
import MuaVe from "./component/MovieDetail/MuaVe";
import Profile from "./component/PersonalPage/Profile";
import ChangePassword from "./component/PersonalPage/ChangePassword";
import Deponsit from "./component/PersonalPage/Deposit";
import Credits from "./component/PersonalPage/Credits";
import Transaction from "./component/PersonalPage/Transaction";
import Personal from "./component/PersonalPage/Personal";



function App() {
  return (
    <>
      <Routes>
      <Route index element={<Home/>}/>
      <Route path="/muave" element={<Bookcinematickets/>}/>
      <Route path="/orders" element={<OrderPage/>}/>
      <Route path="/pay" element={<OrderCheckout/>}/>
      <Route path="/seat" element={<CinemaSeatSelection/>}/>
      <Route path="/moviedetail" element={<ContentMovie/>}/>
      <Route path="/lich-chieu" element={<LichChieu/>}/>
      <Route path="/danh-gia" element={<DanhGia/>}/>
      <Route path="/tin-tuc" element={<TinTuc/>}/>
      <Route path="/mua-ve" element={<MuaVe/>}/>
      <Route path="/headerticket" element={<Headerticket/>}/>
      <Route path="/confirm" element={<EmailConfirm/>}/>
      <Route path="/payment-callback" element={<PaymentCallback />} />

      <Route path="/profile" element={<Profile/>} />
      <Route path="/changepassword" element={<ChangePassword/>} />
      <Route path="/deponsit" element={<Deponsit/>} />
      <Route path="/credits" element={<Credits/>} />
      <Route path="/transaction" element={<Transaction/>} />
      <Route path="/personal" element={<Personal/>} />

      

      <Route path="/register" element={<RegisterCinema/>}/>
      <Route path="/login" element={<LoginCinema/>}/>
      <Route path="/admin" element={<Dashboard/>}/>
      <Route path="admin/user" element={<User/>}/>
      <Route path="admin/user/add" element={<UserAddManager/>}/>

      <Route path="admin/showtimes" element={<ShowtimesManager/>}/>

      <Route path="admin/showtimes" element={<ShowtimesManager/>}/>      
      <Route path="admin/showtimes/add" element={<ShowtimesFormManager/>}/>      
      <Route path="admin/showtimes/edit/:id" element={<ShowtimesFormManager/>}/>      


      <Route path="admin/orders" element={<OrdersManager/>}/>
      <Route path="admin/tickets" element={<TicketsManager/>}/>
      <Route path="admin/posts" element={<PostsManager/>} />
      <Route path="admin/posts/add" element={<PostsFormManager/>} />
      <Route path="admin/posts/edit/:id" element={<PostsFormManager/>} />
      <Route path="admin/categories" element={<CategoriesManager/>} />
      <Route path="admin/countries" element={<CountriesManager/>} />
      <Route path="admin/combo" element={<ComboManager/>} />
      <Route path="admin/combo/add" element={<ComboFormManager/>} />
      <Route path="admin/combo/edit/:id" element={<ComboFormManager/>} />
      <Route path="admin/cinemas" element={<CinemasManager/>} />
      <Route path="admin/cinemas/add" element={<CinemasFormManager/>} />
      <Route path="admin/cinemas/edit/:id" element={<CinemasFormManager/>} />
      <Route path="admin/movies" element={<MoviesManager/>} />
      <Route path="admin/movies/add" element={<MoviesManagerForm/>} />
      <Route path="admin/schedules" element={<SchedulesManager  />} />
      <Route path="admin/revenuebycinema" element={<RevenueByCinemaManager/>} />
      <Route path="admin/revenuebymovie" element={<RevenueByMoviesManager/>} />

      </Routes>

    </>
  );
}

export default App;
