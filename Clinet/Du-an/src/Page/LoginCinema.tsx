import React from "react";

import Header from "../component/Header/Hearder";

import Footer from "../component/Footer/Footer";

import Login from "../component/Login/Login";





interface Props {}

const LoginCinema = (props: Props) => {
  return (
    <>
        <Header />
        <Login/>
        <Footer />
    </>
  )
 
};

export default LoginCinema;
