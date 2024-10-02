import React from "react";
import { useLocation } from "react-router-dom";

export default function DisplayData() {
  const location = useLocation();  //used the useLocation hook from react-router-dom to access the location object, which contains the state passed during navigation:
  const { state } = location;  // Destructure state from location

  // If no data is passed, display a message
  if (!state || !state.first_name || !state.email) {
    return <h2>No data available! Please ensure you have submitted your information correctly.</h2>;
  }

  return (
    <div className="container mt-5">
      <h2>Inserted Data</h2>
      <ul>
        <li>First Name: {state.first_name || 'N/A'}</li>
        <li>Last Name: {state.last_name || 'N/A'}</li>
        <li>Email: {state.email || 'N/A'}</li>
        <li>Username: {state.user_name || 'N/A'}</li>
        <li>Country Code: {state.country_code || 'N/A'}</li>
        <li>Phone: {state.phone || 'N/A'}</li>
      </ul>
    </div>
  );
}
