import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from 'react-toastify';

const Register = ({ show, handleClose, openLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://lost-and-found-backend-3cak.onrender.com/api/auth/register",
        // "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      toast.success("Registration Successful! 🎉");

      // Register hone ke baad Modal band karein aur Login Modal kholen
      handleClose();
      if (openLogin) openLogin();

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed. Please try again.");
      console.error(error.response?.data);
    }
  };

  const goToLogin = (e) => {
    e.preventDefault();
    handleClose(); // Pehle Register modal band karo
    if (openLogin) openLogin(); // Phir Login modal kholo
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      backdrop="static"
      contentClassName="border-0 shadow-lg rounded-4"
    >
      {/* Themed Header */}
      <Modal.Header 
        closeButton 
        className="text-white border-0 rounded-top-4"
        style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
      >
        <Modal.Title className="fw-bold w-100 text-center">
          📝 Create an Account
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h4 className="fw-bold text-dark mb-1">Join Campus Connect</h4>
          <p className="text-muted small">Fill in the details to get started</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="name@student.edu"
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 fw-bold py-2 rounded-3 border-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
          >
            Register
          </Button>
        </Form>

        <p className="text-center mt-4 mb-0 text-muted">
          Already have an account?{" "}
          <a 
            href="/login" 
            onClick={goToLogin}
            className="fw-bold text-primary text-decoration-none"
          >
            Login here
          </a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default Register;