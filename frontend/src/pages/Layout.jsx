import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";

const Layout = ({
  showAlert = () => {}
}) => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer showAlert={showAlert} />
    </>
  );
};

export default Layout;
