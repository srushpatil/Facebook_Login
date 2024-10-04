import React, { useState } from "react";
import axios from "axios";
import "./Phpsignupform.css";
import Facebook from "../FacebookLogin/Facebook";
import { PiUserListFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFileCode } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

export default function Phpsignupform() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    country_code: "",
    phone: "",
  });

  const [errors, setErrors] = useState({}); // State for error messages
  const [hasErrors, setHasErrors] = useState(false); // Track whether validation errors exist

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value }); // Update form data
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the specific field
  };

  const validateForm = () => {
    const newErrors = {};
    let hasValidationError = false;

    if (!data.first_name) {
      newErrors.first_name = "First name is required.";
      hasValidationError = true;
    }
    if (!data.last_name) {
      newErrors.last_name = "Last name is required.";
      hasValidationError = true;
    }
    if (!data.user_name) {
      newErrors.user_name = "Username is required.";
      hasValidationError = true;
    }

    if (!data.email) {
      newErrors.email = "Email is required.";
      hasValidationError = true;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid.";
      hasValidationError = true;
    }

    if (!data.country_code) {
      newErrors.country_code = "Country code is required.";
      hasValidationError = true;
    } else if (!data.country_code.startsWith("+")) {
      newErrors.country_code = "Country code must start with '+'.";
      hasValidationError = true;
    }

    if (!data.phone) {
      newErrors.phone = "Phone number is required.";
      hasValidationError = true;
    } else if (data.phone.length < 10 || data.phone.length > 10) {
      newErrors.phone = "Phone number should contain 10 digits only";
      hasValidationError = true;
    }

    // Update state based on validation result
    setHasErrors(hasValidationError);

    return newErrors;
  };

  const submitForm = (e) => {
    e.preventDefault(); // Prevent page refresh

    const validationErrors = validateForm(); // Validate form
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set error messages
      return; // Stop form submission
    }

    const sendData = {
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name,
      email: data.email,
      country_code: data.country_code,
      phone: data.phone,
    };
    console.log(sendData);

axios
  .post("http://localhost/php-react/insert.php", sendData)
  .then((result) => {
    console.log(result);
    if (result.data.status === "Valid") {
      toast.success(result.data.message); // Show success toast
    } else {
      toast.error(result.data.message); // Show error toast
    }
  })
  .catch((error) => {
    toast.error("An error occurred. Please try again.");
  });
  }

  return (
    <>
      <div className="container-fluid">
        {/* Add 'scrollable-form' class conditionally if there are errors */}
        <form
          className={`form-wrapper w-100 ${hasErrors ? "scrollable-form" : ""}`}
        >
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label"><PiUserListFill className="label-icons"/>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  name="first_name"
                  onChange={handleChange}
                  value={data.first_name || ""}
                />
                {errors.first_name && (
                  <small className="text-danger">{errors.first_name}</small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label"><PiUserListFill className="label-icons"/>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  name="last_name"
                  onChange={handleChange}
                  value={data.last_name || ""}
                />
                {errors.last_name && (
                  <small className="text-danger">{errors.last_name}</small>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label"><FaUser className="label-icons" style={{fontSize:'18px'}}/>User Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter user name"
              name="user_name"
              onChange={handleChange}
              value={data.user_name || ""}
            />
            {errors.user_name && (
              <small className="text-danger">{errors.user_name}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label"><MdEmail className="label-icons"/>Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter email"
              name="email"
              onChange={handleChange}
              value={data.email || ""}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label"><FaFileCode className="label-icons" style={{fontSize:'20px'}}/>Country Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter country code"
              name="country_code"
              onChange={handleChange}
              value={data.country_code || ""}
            />
            {errors.country_code && (
              <small className="text-danger">{errors.country_code}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label"><FaPhone className="label-icons" style={{fontSize:'20px'}}/>Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone number"
              name="phone"
              onChange={handleChange}
              value={data.phone || ""}
            />
            {errors.phone && (
              <small className="text-danger">{errors.phone}</small>
            )}
          </div>

          <div className="d-flex justify-content-center submit">
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              onClick={submitForm}>
              Create new Account
            </button>
          </div>
        </form>

        <div className="row ">
            <h4 style={{ textAlign: "center", marginTop:'16px', fontWeight:'bold'}}>OR</h4>
          <div className="col-12 text-center" style={{marginTop:'-35px'}}>
            <Facebook />
          </div>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
}
