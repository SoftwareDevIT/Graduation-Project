
import "./App.css";

import {  Route, Routes } from "react-router-dom";
import Home from "./Page/Home";
import Bookcinematickets from "./Page/Bookcinematickets";
import OrderPage from "./component/Oders/OrderPage";
import OrderCheckout from "./component/Pay/OderCheckOut";
import CinemaSeatSelection from "./component/SeatMap/CinemaSeatSelection";
import Headerticket from "./component/Headerticket/Headerticket";
import RegisterCinema from "./Page/RegisterCinema";
import LoginCinema from "./Page/LoginCinema";










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

      <Route path="/register" element={<RegisterCinema/>}/>
      <Route path="/login" element={<LoginCinema/>}/>
      </Routes>
    </>
  );
}

export default App;
