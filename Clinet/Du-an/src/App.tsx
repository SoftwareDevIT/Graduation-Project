
import "./App.css";

import {  Route, Routes } from "react-router-dom";
import Home from "./Page/Home";
import Bookcinematickets from "./Page/Bookcinematickets";
import RegisterCinema from "./Page/RegisterCinema";
import LoginCinema from "./Page/LoginCinema";










function App() {
  return (
    <>
      <Routes>
      <Route index element={<Home/>}/>
      <Route path="/muave" element={<Bookcinematickets/>}/>
      <Route path="/register" element={<RegisterCinema/>}/>
      <Route path="/login" element={<LoginCinema/>}/>
      </Routes>
    </>
  );
}

export default App;
