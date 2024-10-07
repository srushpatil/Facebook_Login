import React, { useState, useEffect, useRef } from "react"; 
import "./Facebook.css"; 
import FacebookLogin from "react-facebook-login"; 
import axios from "axios"; 
import { Modal, Button, Form } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify"; 
import { FaUser } from "react-icons/fa";
import { FaFileCode } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

export default function Facebook() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    country_code: "", 
    phone: "", 
    user_name: "" 
  });

  const [facebookData, setFacebookData] = useState(null); 
  const [errors, setErrors] = useState({}); 
  const [countries, setCountries] = useState([]); 
  const [filteredCountries, setFilteredCountries] = useState([]); 
  const [activeIndex, setActiveIndex] = useState(-1); 
  const navigate = useNavigate(); 
  const suggestionRefs = useRef([]); 

  useEffect(() => {
    axios.get("https://api.silocloud.io/api/v1/public/countries")
      .then((response) => {
        const countryData = response.data.data.countries.map((country) => ({
          name: country.name, 
          code: `+${country.phonecode}` 
        }));
        setCountries(countryData); 
      })
      .catch((error) => console.log("Error fetching country data:", error)); 
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); 
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));

    if (name === "country_code") {
      const filtered = countries.filter((country) =>
        country.code.startsWith(value) || country.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCountries(filtered); 
      setActiveIndex(-1); 
    } else {
      setFilteredCountries([]); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) => (prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : prevIndex)); 
    } 
    else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex)); 
    } 
    else if (e.key === "Enter" && activeIndex >= 0) {
      handleCountrySelect(filteredCountries[activeIndex].code); 
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex]);

  const handleCountrySelect = (code) => {
    setFormData({ ...formData, country_code: code }); 
    setFilteredCountries([]); 
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const validateForm = () => {
    const newErrors = {};
    const validCountry = countries.find(
      (country) =>
        country.code === formData.country_code || 
        country.name.toLowerCase() === formData.country_code.toLowerCase() 
    );

    if (!formData.country_code) newErrors.country_code = "Country code is required.";
    else if (!validCountry) newErrors.country_code = "Invalid country code or name."; 

    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else if (formData.phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits.";

    if (!formData.user_name) newErrors.user_name = "Username is required.";
    return newErrors; 
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(); 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); 
      return;
    }

    const nameArr = facebookData.name.split(" ");
    const dataToSend = {
      first_name: nameArr[0] || null,
      last_name: nameArr.length > 1 ? nameArr[1] : null,
      email: facebookData.email,
      user_name: formData.user_name,
      country_code: formData.country_code,
      phone: formData.phone,
    };

    sessionStorage.setItem("userSession", JSON.stringify(dataToSend));

    axios.post("http://localhost/php-react/insert.php", dataToSend)
      .then((result) => {
        console.log(result.data);
        toast.success("Logged in successfully!!"); 
        navigate("/data", { state: dataToSend }); 
      })
      .catch((error) => console.log("Error sending data", error));

    handleClose(); 
  };

  const responseFacebook = (response) => {
    if (response.accessToken) {
      setFacebookData(response); 
      if (response.email) checkUserExist(response.email); 
      else handleShow(); 
    } else console.log("Login Failed", response); 
  };

  const checkUserExist = (email) => {
    const dataToSend = { email };
    axios.post("http://localhost/php-react/check_user.php", dataToSend)
      .then((result) => {
        if (result.data.exists) {
          sessionStorage.setItem("userSession", JSON.stringify(result.data.userData)); 
          navigate("/data", { state: result.data.userData }); 
        } else handleShow(); 
      })
      .catch((error) => console.log("Error sending data", error)); 
  };

  return (
    <div className="container mt-5">
      <FacebookLogin
        appId="1937254353445888"
        autoLoad={true}
        fields="name,email"
        callback={responseFacebook}
        icon="fa-facebook"
        cssClass="fb-btn"
      />

      <Modal show={showModal} onHide={handleClose}>

        <Modal.Header closeButton className="popup-form">
          <Modal.Title>Please Enter Additional Details!</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-form-body">
          <Form className="popup-content">

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
              {errors.country_code && <small className="text-danger">{errors.country_code}</small>} 
              {filteredCountries.length > 0 && (
                <div className="suggestions-wrapper">
                  <ul className="suggestions-list">
                    {filteredCountries.map((country, index) => (
                      <li
                        key={index}
                        ref={(el) => (suggestionRefs.current[index] = el)}
                        onClick={() => handleCountrySelect(country.code)} 
                        className={index === activeIndex ? "active" : ""}
                      >
                        {country.name} ({country.code}) 
                      </li>
                    ))}
                  </ul>
                  <span className="close-suggestions" onClick={() => setFilteredCountries([])}>&times;</span>
                </div>
              )}
            </Form.Group>

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
              {errors.user_name && <small className="text-danger">{errors.user_name}</small>} 
            </Form.Group>

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
              {errors.phone && <small className="text-danger">{errors.phone}</small>} 
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit} className="btn-save">
            Save Details
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
