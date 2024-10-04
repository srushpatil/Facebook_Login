import React, { useEffect } from "react";
import {useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import './DisplayData.css';
// import { ToastContainer, toast } from "react-toastify";


export default function DisplayData() {
  // if necessary then only show 
  // useEffect(() => {
  //   // Show toast message when the component mounts
  //   toast.success("Logged in! Welcome.");
  // }, []); // Empty dependency array means this runs once when the component mounts


  const navigate = useNavigate();

  // Fetch user data from sessionStorage or from location state
  const sessionData = JSON.parse(sessionStorage.getItem("userSession"));

  useEffect(() => {
    // If no session data, redirect to home
    if (!sessionData) {
      navigate("/");
    }
  }, [navigate, sessionData]);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("userSession"); // Clear the session
    navigate("/"); // Redirect to home page
  };

  // Render message if no data available
  if (!sessionData) {
    return <h2>No data available! Please log in first.</h2>;
  }
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Data</h2>
        <div className="data-display">
          <div className="data-item"><strong>First Name :</strong> <span>{sessionData.first_name || 'N/A'}</span></div>
          <div className="data-item"><strong>Last Name :</strong> <span>{sessionData.last_name || 'N/A'}</span></div>
          <div className="data-item"><strong>Username :</strong> <span>{sessionData.user_name || 'N/A'}</span></div>
          <div className="data-item"><strong>Country Code :</strong> <span>{sessionData.country_code || 'N/A'}</span></div>
          <div className="data-item"><strong>Phone :</strong> <span>{sessionData.phone || 'N/A'}</span></div>
          <div className="data-item"><strong style={{ marginRight: '110px' }}>Email:</strong> <span>{sessionData.email || 'N/A'}</span></div>
        </div>

        <button className="btn btn-danger btn-lg mt-5" onClick={handleLogout}>Log Out</button>
      </div>
      {/* Include ToastContainer */}
      {/* <ToastContainer /> */}
    </>
  );
}
