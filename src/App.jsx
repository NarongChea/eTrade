import React from "react";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AppRouter from "./router/AppRouter";
import ScrollTop from "./Components/ScrollTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <ScrollTop>
      <Navbar />
      <AppRouter />
      <Footer />
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
  closeOnClick= {true}
  pauseOnHover= {true}
  draggable= {true}
  progress= {undefined}
        theme="colored"
      />
    </ScrollTop>
  );
};
export default App;
