import React, { useState } from "react"; // 1. Added useState here
import { Container, Navbar, Nav, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register"; // 2. Added Login import here

function Landing() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false); // 3. Added state to control modal
  const [showRegister, setShowRegister] = useState(false);
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* 1. Navigation */}
      <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
        <Container>
          <Navbar.Brand className="fw-bold text-primary fs-4">
            🎓 Campus Connect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <Nav.Link href="#how-it-works" className="me-lg-4 mb-2 mb-lg-0 fw-medium">
                How It Works
              </Nav.Link>
              <Button
                variant="outline-primary"
                className="me-2 px-4 mb-2 mb-lg-0"
                onClick={() => setShowLogin(true)} // 4. Changed this to open modal
              >
                Login
              </Button>
              <Button
                variant="primary"
                className="px-4 shadow-sm"
                onClick={() => setShowRegister(true)}
              >
                Sign Up
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Hero Section */}
      <Container className="mt-5 mb-5 flex-grow-1">
        <div className="p-4 p-md-5 rounded-4 shadow-lg text-white"
          style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="d-inline-block bg-white text-dark px-3 py-1 rounded-pill mb-3 fw-bold shadow-sm" style={{ fontSize: '0.85rem' }}>
                ✨ CAMPUS LOST & FOUND
              </div>
              <h1 className="display-4 fw-bold">Find What You've Lost, Return What You've Found.</h1>
              <p className="lead mt-4 mb-4 opacity-75">
                The quickest way to connect with fellow students to recover lost items or help return found belongings on campus.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-3">
                <Button variant="light" size="lg" className="fw-bold text-primary shadow-sm" onClick={() => setShowLogin(true)}> {/* 5. Changed this to open modal */}
                  Report a Lost Item
                </Button>
                <Button variant="outline-light" size="lg" className="fw-bold" onClick={() => setShowLogin(true)}> {/* 5. Changed this to open modal too */}
                  I Found Something
                </Button>
              </div>
            </Col>

            {/* Visual Placeholder for Desktop */}
            <Col lg={5} className="d-none d-lg-block text-center mt-4 mt-lg-0">
              <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '300px', height: '300px' }}>
                <span style={{ fontSize: '100px' }} role="img" aria-label="search">🔍</span>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* 3. How It Works Section */}
      <div id="how-it-works" className="bg-light py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">How It Works</h2>
            <p className="text-muted">Three simple steps to reunite with your belongings.</p>
          </div>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                <Card.Body>
                  <div className="display-4 mb-3">📝</div>
                  <Card.Title className="fw-bold">1. Report</Card.Title>
                  <Card.Text className="text-muted">
                    Quickly post details and photos of the item you lost or found on campus.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                <Card.Body>
                  <div className="display-4 mb-3">🤝</div>
                  <Card.Title className="fw-bold">2. Connect</Card.Title>
                  <Card.Text className="text-muted">
                    Our system helps match descriptions, allowing you to securely message the finder or owner.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                <Card.Body>
                  <div className="display-4 mb-3">✅</div>
                  <Card.Title className="fw-bold">3. Reunite</Card.Title>
                  <Card.Text className="text-muted">
                    Meet up safely on campus to hand over the item and make someone's day!
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* 4. Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <Container className="text-center">
          <p className="mb-0 text-white-50">
            &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
          </p>
        </Container>
      </footer>

      {/* 6. Added the Login Component Modal here */}
      {/* <Login show={showLogin} handleClose={() => setShowLogin(false)} /> */}
      <Login
  show={showLogin}
  handleClose={() => setShowLogin(false)}
  openRegister={() => setShowRegister(true)}
/>
      <Register
        show={showRegister}
        handleClose={() => setShowRegister(false)}
        openLogin={() => setShowLogin(true)}
      />
    </div>
  );
}

export default Landing;