import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation
import Navbar from "../Navbar/Navbar";
import './DisplayData.css'

export default function DisplayData() {
  const location = useLocation();  //used the useLocation hook from react-router-dom to access the location object, which contains the state passed during navigation:
  const { state } = location;  // Destructure state from location
  const navigate = useNavigate(); // Initialize useNavigate

  // If no data is passed, display a message
  if (!state || !state.first_name || !state.email) {
    return <h2>No data available! Please ensure you have submitted your information correctly.</h2>;
  }

  const HomePage = () => {
    navigate("/");
  }

  return (
    <>
      <Navbar/>
      <div className="container mt-5">
    
        <h2 className="text-center">Data</h2>

        <div className="data-display">
          <div className="data-item"><strong>First Name :</strong> <span>{state.first_name || 'N/A'}</span></div>
          <div className="data-item"><strong>Last Name :</strong> <span>{state.last_name || 'N/A'}</span></div>
          <div className="data-item"><strong>Username :</strong> <span>{state.user_name || 'N/A'}</span></div>
          <div className="data-item"><strong>Country Code :</strong> <span>{state.country_code || 'N/A'}</span></div>
          <div className="data-item"><strong>Phone :</strong> <span>{state.phone || 'N/A'}</span></div>
          <div className="data-item"><strong  style={{marginRight:'110px'}}>Email:</strong> <span>{state.email || 'N/A'}</span></div>
        </div>
        
        <button className="btn btn-danger btn-lg mt-5" onClick={HomePage}>Log Out</button>
      </div>
    </>
  );
}
