import React, { useState, useEffect, useRef } from "react"; 
import "./Facebook.css"; 
import FacebookLogin from "react-facebook-login"; 
import axios from "axios"; 
import { Modal, Button, Form } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import { FaUser, FaFileCode, FaPhone } from "react-icons/fa"; // Importing required icons

export default function Facebook() {
  // State variables
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [formData, setFormData] = useState({
    country_code: "", // Stores country code
    phone: "", // Stores phone number
    user_name: "" // Stores username
  });

  const [facebookData, setFacebookData] = useState(null); // Stores data returned from Facebook
  const [errors, setErrors] = useState({}); // Stores form validation errors
  const [countries, setCountries] = useState([]); // Stores list of countries
  const [filteredCountries, setFilteredCountries] = useState([]); // Stores filtered country suggestions
  const [activeIndex, setActiveIndex] = useState(-1); // Active index for keyboard navigation in suggestions
  const navigate = useNavigate(); // Hook to programmatically navigate
  const suggestionRefs = useRef([]); // Ref to store suggestion elements for scrolling

  // Fetching country data on component mount
  useEffect(() => {
    axios.get("https://api.silocloud.io/api/v1/public/countries")
      .then((response) => {
        // Map the API response to extract country name and phone code
        const countryData = response.data.data.countries.map((country) => ({
          name: country.name, 
          code: `+${country.phonecode}` 
        }));
        setCountries(countryData); // Update state with fetched countries
      })
      .catch((error) => console.log("Error fetching country data:", error)); 
  }, []); // Empty dependency array to run only once on mount

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear previous error for the changed field
    }));

    // Filter countries based on the input value for country code
    if (name === "country_code") {
      const filtered = countries.filter((country) =>
        country.code.startsWith(value) || country.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCountries(filtered); // Update filtered countries
      setActiveIndex(-1); // Reset active index for suggestions
    } else {
      setFilteredCountries([]); // Clear suggestions for other inputs
    }
  };

  // Handle keyboard navigation for country selection
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) => (prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : prevIndex)); // Move down in suggestions
    } 
    else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex)); // Move up in suggestions
    } 
    else if (e.key === "Enter" && activeIndex >= 0) {
      handleCountrySelect(filteredCountries[activeIndex].code); // Select country on Enter
    }
  };

  // Scroll to the active suggestion when it changes
  useEffect(() => {
    if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest" }); // Smooth scroll to active suggestion
    }
  }, [activeIndex]);

  // Handle country selection from suggestions
  const handleCountrySelect = (code) => {
    setFormData({ ...formData, country_code: code }); // Update form data with selected country code
    setFilteredCountries([]); // Clear suggestions
  };

  // Modal control functions
  const handleClose = () => setShowModal(false); // Close modal
  const handleShow = () => setShowModal(true); // Show modal

  // Validate the form inputs
  const validateForm = () => {
    const newErrors = {};
    const validCountry = countries.find(
      (country) =>
        country.code === formData.country_code || 
        country.name.toLowerCase() === formData.country_code.toLowerCase() 
    );

    // Check if country code is provided and valid
    if (!formData.country_code) newErrors.country_code = "Country code is required.";
    else if (!validCountry) newErrors.country_code = "Invalid country code or name."; 

    // Check if phone number is provided and valid
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else if (formData.phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits.";

    // Check if username is provided
    if (!formData.user_name) newErrors.user_name = "Username is required.";
    return newErrors; // Return any validation errors found
  };

  // Handle form submission
  const handleSubmit = () => {
    const validationErrors = validateForm(); // Validate form inputs
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors if any
      return; // Prevent submission if errors exist
    }

    // Prepare data to send to the server
    const nameArr = facebookData.name.split(" ");
    const dataToSend = {
      first_name: nameArr[0] || null,
      last_name: nameArr.length > 1 ? nameArr[1] : null,
      email: facebookData.email,
      user_name: formData.user_name,
      country_code: formData.country_code,
      phone: formData.phone,
    };

    sessionStorage.setItem("userSession", JSON.stringify(dataToSend)); // Store user data in session

    // Send user data to the backend
    axios.post("http://localhost/php-react/insert.php", dataToSend)
      .then((result) => {
        console.log(result.data); // Log server response
        toast.success("Logged in successfully!!"); // Show success toast message
        navigate("/data", { state: dataToSend }); // Navigate to data page
      })
      .catch((error) => console.log("Error sending data", error)); // Log any errors

    handleClose(); // Close modal after submission
  };

  // Handle response from Facebook login
  const responseFacebook = (response) => {
    if (response.accessToken) {
      setFacebookData(response); // Store Facebook data in state
      if (response.email) checkUserExist(response.email); // Check if user exists if email is available
      else handleShow(); // Show modal if email is not available
    } else console.log("Login Failed", response); // Log login failure
  };

  // Check if the user already exists in the database
  const checkUserExist = (email) => {
    const dataToSend = { email };
    axios.post("http://localhost/php-react/check_user.php", dataToSend)
      .then((result) => {
        if (result.data.exists) {
          sessionStorage.setItem("userSession", JSON.stringify(result.data.userData)); // Store user data if exists
          navigate("/data", { state: result.data.userData }); // Navigate to data page
        } else handleShow(); // Show modal if user does not exist
      })
      .catch((error) => console.log("Error sending data", error)); // Log any errors
  };

  return (
    <div className="container mt-5">
      <FacebookLogin
        appId="1937254353445888" // Your Facebook App ID
        autoLoad={true} // Automatically load the login dialog
        fields="name,email" // Specify which fields to request
        callback={responseFacebook} // Callback function to handle the response
        icon="fa-facebook" // Facebook icon
        cssClass="fb-btn" // CSS class for styling
      />

      {/* Modal for additional user details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="popup-form">
          <Modal.Title>Please Enter Additional Details!</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-form-body">
          <Form className="popup-content">
            {/* Country Code Input */}
            <Form.Group className="mb-3">
              <Form.Label className="label">
                <FaFileCode className="label-icons"/>
                Country Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country code"
                name="country_code"
                value={formData.country_code}
                onChange={handleInputChange} // Update state on change
                onKeyDown={handleKeyDown} // Handle keyboard navigation
                className="ip-details"
                autoComplete="off"
              />
              {errors.country_code && <small className="text-danger">{errors.country_code}</small>} 
              {filteredCountries.length > 0 && (
                <div className="suggestions-wrapper">
                  {filteredCountries.map((country, index) => (
                    <div
                      key={country.code}
                      className={`suggestion-item ${index === activeIndex ? "active" : ""}`}
                      onClick={() => handleCountrySelect(country.code)} // Handle selection on click
                      ref={(el) => (suggestionRefs.current[index] = el)} // Reference for scrolling
                    >
                      {country.code} {country.name}
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            {/* Phone Number Input */}
            <Form.Group className="mb-3">
              <Form.Label className="label">
                <FaPhone className="label-icons"/>
                Phone Number
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange} // Update state on change
                className="ip-details"
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>} 
            </Form.Group>

            {/* Username Input */}
            <Form.Group className="mb-3">
              <Form.Label className="label">
                <FaUser className="label-icons"/>
                Username
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange} // Update state on change
                className="ip-details"
              />
              {errors.user_name && <small className="text-danger">{errors.user_name}</small>} 
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="popup-form-footer">
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button> {/* Submit button */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
