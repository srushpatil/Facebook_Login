import React, { useState } from 'react';
import axios from 'axios';
import './Phpsignupform.css';
import { FaUsers } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { FaRegFileCode } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";

export default function Php_signupform() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    user_name: "", 
    email: "",
    country_code: "",
    phone: ""
    // password: ""
  });

  const [errors, setErrors] = useState({}); // State for error messages

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value }); // Update form data
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the specific field
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.first_name) newErrors.first_name = "First name is required.";
    if (!data.last_name) newErrors.last_name = "Last name is required.";
    if (!data.user_name) newErrors.user_name = "Username is required.";

    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!data.country_code) {
      newErrors.country_code = "Country code is required.";
    }else if(!data.country_code.startsWith('+')){
      newErrors.country_code = "Country code must start with '+'.";
    }

    if (!data.phone){
      newErrors.phone = "Phone number is required.";
    }else if(data.phone.length < 10 || data.phone.length > 10){
      newErrors.phone = "Phone number should contain 10 digits only"
    }
    
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
      phone: data.phone
      // password: data.password
    };
    console.log(sendData);

    axios.post('http://localhost/php-react/insert.php', sendData)
      .then((result) => {
        console.log(result);
        alert(result.data.status + "\n" + result.data.message);
      });
  };

  return (
    <>
      <div className="container">
        <FaUsers className='user-icon' />
        <form className='container w-55 form-container' onSubmit={submitForm}>   

          <div className="form-floating mt-5">
            <input
              type="text"
              name='first_name'
              className="form-control"
              placeholder="Firstname"
              onChange={handleChange}
              value={data.first_name || ""}
            />
            <label><MdOutlineDriveFileRenameOutline className='form-ip-icons'/>First name</label>
            {errors.first_name && <small className="text-danger">{errors.first_name}</small>}
          </div>

          <div className="form-floating mt-3">
            <input
              type="text"
              name='last_name'
              className="form-control"
              placeholder="Lastname"
              onChange={handleChange}
              value={data.last_name || ""}
            />
            <label><MdOutlineDriveFileRenameOutline className='form-ip-icons'/>Last name</label>
            {errors.last_name && <small className="text-danger">{errors.last_name}</small>}
          </div>

          <div className="form-floating mt-3">
            <input
              type="text"
              name='user_name'
              className="form-control"
              placeholder="Username"
              onChange={handleChange}
              value={data.user_name || ""}
            />
            <label><MdOutlineDriveFileRenameOutline className='form-ip-icons'/>User name</label>
            {errors.user_name && <small className="text-danger">{errors.user_name}</small>}
          </div>

          <div className="form-floating mt-3">
            <input
              type="email"
              name='email'
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              value={data.email || ""}
            />
            <label><IoIosMail className='form-ip-icons'/>Email</label>
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="form-floating mt-3">
            <input
              type="text"
              name='country_code'
              className="form-control"
              placeholder="Country code"
              onChange={handleChange}
              value={data.country_code || ""}
            />
            <label><FaRegFileCode className='form-ip-icons' style={{height:'20px'}}/>Country code</label>
            {errors.country_code && <small className="text-danger">{errors.country_code}</small>}
          </div>

          <div className="form-floating mt-3 mb-3">
            <input
              type="tel"
              name='phone'
              className="form-control"
              placeholder="Phone number"
              onChange={handleChange}
              value={data.phone || ""}
            />
            <label><FaPhoneAlt className='form-ip-icons' style={{height:'20px'}}/>Phone number</label>
            {errors.phone && <small className="text-danger">{errors.phone}</small>}
          </div>

          {/* <div className="form-floating mb-3">
            <input
              type="password"
              name='password'
              className="form-control"
              placeholder="password"
              onChange={handleChange}
              value={data.password || ""}
            />
            <label>password</label>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div> */}

          <button type="submit" className="btn btn-primary btn-lg submit">CREATE NEW ACCOUNT</button>
        </form>
      </div>
    </>
  );
}
