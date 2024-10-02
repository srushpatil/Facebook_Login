import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import "./Facebook.css";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation

export default function Facebook() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    country_code: "",
    phone: "",
    user_name: "",
    // password: ""
  });
  const [facebookData, setFacebookData] = useState(null);
  const [errors, setErrors] = useState({}); // State to track validation errors
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error for specific field on change
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country_code) {
      newErrors.country_code = "Country code is required.";
    } else if (!formData.country_code.startsWith("+")) {
      newErrors.country_code = "Country code should start with '+";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!formData.user_name) newErrors.user_name = "Username is required.";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(); // Validate form
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set error messages
      return; // Stop form submission if there are errors
    }

    // Prepare the data to send to PHP
    const nameArr = facebookData.name.split(" ");
    const firstname = nameArr[0] ? nameArr[0] : null;
    const lastname = nameArr.length > 1 ? nameArr[1] : null;

    const dataToSend = {
      first_name: firstname,
      last_name: lastname,
      email: facebookData.email,
      user_name: formData.user_name,
      country_code: formData.country_code,
      phone: formData.phone,
    };

    // Send data to PHP
    axios
      .post("http://localhost/php-react/insert.php", dataToSend)
      .then((result) => {
        console.log(result.data);
        alert(result.data.status + "\n" + result.data.message);

        // Navigate to the Data component, passing inserted data as state
        navigate("/data", { state: dataToSend });
      })
      .catch((error) => {
        console.log("Error sending data", error);
      });

    handleClose(); // Close the modal after submission
  };

  const responseFacebook = (response) => {
    if (response.accessToken) {
      console.log("Logged in successfully", response);
      setFacebookData(response); // Save Facebook data
      handleShow(); // Show the modal form
    } else {
      console.log("Login Failed");
    }
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

      {/* Modal for input */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="popup-form">
          <Modal.Title>Please Enter Additional Details!</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-form-body">
          <Form className="popup-content">
            <Form.Group className="mb-3 ">
              <Form.Label>Country Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country code"
                name="country_code"
                value={formData.country_code}
                onChange={handleInputChange}
                className="ip-details"
              />
              {errors.country_code && (
                <small className="text-danger">{errors.country_code}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="ip-details"
              />
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user name"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                className="ip-details"
              />
              {errors.user_name && (
                <small className="text-danger">{errors.user_name}</small>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
