
import "./App.css";

import {  Route, Routes } from "react-router-dom";
import Home from "./Page/Home";
import Bookcinematickets from "./Page/Bookcinematickets";

function App() {
  return (
    <>
      <Routes>
      <Route index element={<Home/>}/>
      <Route path="/muave" element={<Bookcinematickets/>}/>
      </Routes>
    </>
  );
}

export default App;
