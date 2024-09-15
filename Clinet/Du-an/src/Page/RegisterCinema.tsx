import React from "react";

import Header from "../component/Header/Hearder";

import Footer from "../component/Footer/Footer";
import Register from "../component/Register/Register";





interface Props {}

const RegisterCinema = (props: Props) => {
  return (
    <>
        <Header />
        <Register/>
        <Footer />
    </>
  )
 
};

export default RegisterCinema;
