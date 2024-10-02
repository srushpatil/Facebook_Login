import React from "react";
import { useLocation } from "react-router-dom";

export default function DisplayData() {
  const location = useLocation();
  const { state } = location;

  // If no data is passed, display a message
  if (!state) {
    return <h2>No data available!</h2>;
  }

  return (
    <div className="container mt-5">
      <h2>Inserted Data</h2>
      <ul>
        <li>First Name: {state.first_name}</li>
        <li>Last Name: {state.last_name}</li>
        <li>Email: {state.email}</li>
        <li>Username: {state.user_name}</li>
        <li>Country Code: {state.country_code}</li>
        <li>Phone: {state.phone}</li>
      </ul>
    </div>
  );
}
