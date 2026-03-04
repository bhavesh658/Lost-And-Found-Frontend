import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function NavbarComponent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // <-- Role check karne ke liye naya state

  // check token & role when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // LocalStorage se role nikal liya
    
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Logout par role bhi delete karein
    setIsLoggedIn(false);
    setUserRole("");
    navigate("/"); 
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container>
        {/* Brand Logo - Click karne par role ke hisaab se redirect karega */}
        <Navbar.Brand 
          as={Link} 
          to={userRole === "admin" ? "/admin-dashboard" : "/user-dashboard"} 
          className="fw-bold text-primary fs-4"
        >
          🎓 Campus Connect {userRole === "admin" && <span className="text-danger fs-6">(Admin)</span>}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {isLoggedIn ? (
              <>
                {/* 🔴 ADMIN LINKS: Agar admin login karega toh ye dikhega */}
                {userRole === "admin" ? (
                  <>
                    <Nav.Link as={Link} to="/admin-dashboard" className="me-lg-3 mb-2 mb-lg-0 fw-bold text-danger">
                      Admin Dashboard
                    </Nav.Link>
                    {/* <Nav.Link as={Link} to="/all-items" className="me-lg-4 mb-2 mb-lg-0 fw-medium">
                      Manage All Items
                    </Nav.Link> */}
                  </>
                ) : (
                  /* 🔵 NORMAL USER LINKS: Agar student login karega toh ye dikhega */
                  <>
                    <Nav.Link as={Link} to="/user-dashboard" className="me-lg-3 mb-2 mb-lg-0 fw-medium">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/my-items" className="me-lg-4 mb-2 mb-lg-0 fw-medium">
                      My Items
                    </Nav.Link>
                  </>
                )}
                
                <Button variant="danger" className="px-4 shadow-sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              /* Agar koi bina login wale URL pe aa jaye */
              <Button variant="primary" className="px-4 shadow-sm" onClick={() => navigate("/")}>
                Go to Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}