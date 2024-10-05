import React, { useState, useEffect, useRef } from "react"; 
import "./Facebook.css"; 
import FacebookLogin from "react-facebook-login"; // Facebook login component
import axios from "axios"; // For making HTTP requests
import { Modal, Button, Form } from "react-bootstrap"; // Bootstrap components for UI
import { useNavigate } from "react-router-dom"; // For navigation
import { toast } from "react-toastify"; // For displaying toast notifications
import { FaUser } from "react-icons/fa";
import { FaFileCode } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

export default function Facebook() {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  const [formData, setFormData] = useState({         // State for form inputs
    country_code: "", 
    phone: "", 
    user_name: "" });

  const [facebookData, setFacebookData] = useState(null); // State to store Facebook user data
  const [errors, setErrors] = useState({}); // State for form validation errors
  const [countries, setCountries] = useState([]); // State to store country data
  const [filteredCountries, setFilteredCountries] = useState([]); // State for filtered country suggestions
  const [activeIndex, setActiveIndex] = useState(-1); // State to track the active suggestion index
  const navigate = useNavigate(); // Hook for navigation
  const suggestionRefs = useRef([]); // Ref to manage focus on suggestion items


  // Effect to fetch country data on component mount
  useEffect(() => {
    axios.get("https://api.silocloud.io/api/v1/public/countries")
      .then((response) => {
        // Map the response to a more usable format
        const countryData = response.data.data.countries.map((country) => ({
          name: country.name, 
          code: `+${country.phonecode}` // Format phone code with '+' sign
        }));
        setCountries(countryData); // Set country data to state
      })
      .catch((error) => console.log("Error fetching country data:", error)); //handles errors
  }, []);


  // Handle input changes and filter country suggestions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data

    // Clear the corresponding error message when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error for the field being modified
    }));

    // Filter countries only when the country_code input is being changed
    if (name === "country_code") {
      const filtered = countries.filter((country) =>
        country.code.startsWith(value) || country.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCountries(filtered); // Update filtered countries
      setActiveIndex(-1); // Reset active index for suggestions
    } else {
      // Reset filtered countries if the username input is being changed
      setFilteredCountries([]); // Clear suggestions if typing in username
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) => (prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : prevIndex)); // Move down
    } 
    else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex)); // Move up
    } 
    else if (e.key === "Enter" && activeIndex >= 0) {
      handleCountrySelect(filteredCountries[activeIndex].code); // Select country on enter
    }
  };


  // Scroll to active suggestion
  useEffect(() => {
    if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex]);


  // Handle country selection from suggestions
  const handleCountrySelect = (code) => {
    setFormData({ ...formData, country_code: code }); // Update country code in form data
    setFilteredCountries([]); // Clear suggestions
  };


  // Handle modal close
  const handleClose = () => setShowModal(false);

  // Handle modal show
  const handleShow = () => setShowModal(true);


  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.country_code) newErrors.country_code = "Country code is required.";
    else if (!formData.country_code.startsWith("+")) newErrors.country_code = "Country code should start with '+'";

    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else if (formData.phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits.";

    if (!formData.user_name) newErrors.user_name = "Username is required.";
    return newErrors; // Return any validation errors
  };

  // Handle form submission
  const handleSubmit = () => {
    const validationErrors = validateForm(); // Validate form inputs
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return;
    }

    // Prepare data to send to the backend
    const nameArr = facebookData.name.split(" ");
    const dataToSend = {
      first_name: nameArr[0] || null,
      last_name: nameArr.length > 1 ? nameArr[1] : null,
      email: facebookData.email,
      user_name: formData.user_name,
      country_code: formData.country_code,
      phone: formData.phone,
    };

    // Store user session data
    sessionStorage.setItem("userSession", JSON.stringify(dataToSend));

    // Send user data to the backend
    axios.post("http://localhost/php-react/insert.php", dataToSend)
      .then((result) => {
        console.log(result.data);
        toast.success("Logged in successfully!!"); // Show success message
        navigate("/data", { state: dataToSend }); // Navigate to data page
      })
      .catch((error) => console.log("Error sending data", error));

    handleClose(); // Close modal after submission
  };

  // Response handler for Facebook login
  const responseFacebook = (response) => {
    if (response.accessToken) {
      setFacebookData(response); // Store Facebook user data
      if (response.email) checkUserExist(response.email); // Check if user exists
      else handleShow(); // Show modal for additional details if email is not available
    } else console.log("Login Failed", response); // Handle login failure
  };

  // Check if user already exists in the database
  const checkUserExist = (email) => {
    const dataToSend = { email };
    axios.post("http://localhost/php-react/check_user.php", dataToSend)
      .then((result) => {
        if (result.data.exists) {
          sessionStorage.setItem("userSession", JSON.stringify(result.data.userData)); // Store user session data
          navigate("/data", { state: result.data.userData }); // Navigate to data page if user exists
        } else handleShow(); // Show modal if user does not exist
      })
      .catch((error) => console.log("Error sending data", error)); // Handle errors
  };

  return (
    <div className="container mt-5">
      {/* Facebook login button */}
      <FacebookLogin
        appId="1937254353445888"
        autoLoad={true}
        fields="name,email"
        callback={responseFacebook}
        icon="fa-facebook"
        cssClass="fb-btn"
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
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="ip-details"
                autoComplete="off"
              />
              {/* Render country suggestions */}
              {filteredCountries.length > 0 && (
                <div className="suggestions-wrapper">
                  <ul className="suggestions-list">
                    {filteredCountries.map((country, index) => (
                      <li
                        key={index}
                        ref={(el) => (suggestionRefs.current[index] = el)}
                        onClick={() => handleCountrySelect(country.code)} // Select country on click
                        className={index === activeIndex ? "active" : ""}
                      >
                        {country.name} ({country.code}) {/* Display country name and code */}
                      </li>
                    ))}
                  </ul>
                  {/* Close suggestions */}
                  <span className="close-suggestions" onClick={() => setFilteredCountries([])}>&times;</span>
                </div>
              )}
            </Form.Group>


            {/* User Name Input */}
            <Form.Group className="mb-3">
              <Form.Label className="label">
                <FaUser className="label-icons" />
                User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user name"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                className="ip-details"
              />
              {errors.user_name && <small className="text-danger">{errors.user_name}</small>} {/* Error message for user name */}
            </Form.Group>


            {/* Phone Number Input */}
            <Form.Group className="mb-3">
              <Form.Label className="label">
                <FaPhone className="label-icons" />
                Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="ip-details"
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>} {/* Error message for phone number */}
            </Form.Group>

            <Button variant="primary" className="submit-btn" onClick={handleSubmit}>Submit</Button> {/* Submit button */}

          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}