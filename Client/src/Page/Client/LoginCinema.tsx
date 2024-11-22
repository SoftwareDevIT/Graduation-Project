import React from "react";
import Header from "../../component/Header/Hearder";
import Login from "../../component/Login/Login";
import Footer from "../../component/Footer/Footer";
import { Helmet } from "react-helmet";







interface Props {}

const LoginCinema = (props: Props) => {
  return (
    <> 
     <Helmet>
                <meta charSet="utf-8" />
                <title>Login</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
        <Header />
        <Login/>
        <Footer />
    </>
  )
 
};

export default LoginCinema;
