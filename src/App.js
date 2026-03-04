import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Iski CSS import karna zaroori hai

import { Routes, Route, Outlet } from "react-router-dom";
import Landing from "./Landing";
import UserDashboard from "./Dashboard/UserDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";
import Navbar from "./screen/Navbar";
import LostFoundForm from "./pages/LostFoundForm";
import MyItems from "./pages/MyItems";
import ItemDetails from "./pages/ItemDetails"; 

// Dusre middlewares ke sath ye line add karein

const NavbarWrapper = () => {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
};

function App() {
  return (
    <>
      <Routes>
        {/* Sabse pehle Navbar wala group */}
        <Route element={<NavbarWrapper />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/lost-found-form" element={<LostFoundForm />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/item/:id" element={<ItemDetails />} />
        </Route>

        <Route path="/" element={<Landing />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </>
  );
}

export default App;