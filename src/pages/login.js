import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Spinner import kiya
import axios from "axios";
import { toast } from 'react-toastify';



const Login = ({ show, handleClose, openRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 1. Loading state add ki
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 2. Button click hote hi loading shuru
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      toast.success("Login successful! 🎉");
      
      handleClose();

      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      // 3. Request khatam hone par loading band (taki error aane par button wapas active ho jaye)
      setIsSubmitting(false);
    }
  };

  const goToRegister = (e) => {
    e.preventDefault();
    handleClose();
    if (openRegister) openRegister();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      backdrop="static"
      contentClassName="border-0 shadow-lg rounded-4"
    >
      <Modal.Header 
        closeButton 
        className="text-white border-0 rounded-top-4"
        style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
      >
        <Modal.Title className="fw-bold w-100 text-center">
          🎓 Welcome Back
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h4 className="fw-bold text-dark mb-1">Login to your account</h4>
          <p className="text-muted small">Enter your credentials to continue</p>
        </div>

        <Form onSubmit={handleSubmit}>
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
              placeholder="Enter password"
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          {/* 4. Button update: Loading ke waqt disabled aur spinner show karega */}
          <Button 
            type="submit" 
            className="w-100 fw-bold py-2 rounded-3 border-0 shadow-sm d-flex align-items-center justify-content-center"
            style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
            disabled={isSubmitting} // Disable button while loading
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Verifying...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>

        <p className="text-center mt-4 mb-0 text-muted">
          Don’t have an account?{" "}
          <a 
            href="/register" 
            onClick={goToRegister}
            className="fw-bold text-primary text-decoration-none"
          >
            Register here
          </a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default Login;