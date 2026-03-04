import { Container, Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyItems() {
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  // const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL = "https://lost-and-found-backend-3cak.onrender.com";


  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/items/myitems`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(res.data);
    } catch (error) {
      toast.error("Failed to fetch your items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted successfully!");
      fetchMyItems(); // List refresh karein
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved": return "success";
      case "recovered": return "primary";
      case "pending": return "warning text-dark";
      case "rejected": return "danger";
      default: return "secondary";
    }
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">📦 My Uploaded Items</h2>
          <p className="text-muted">Manage the items you have reported on campus.</p>
        </div>
        <Button 
          variant="primary" 
          className="rounded-pill px-4 fw-bold"
          onClick={() => navigate("/lost-found-form")}
        >
          + Report New Item
        </Button>
      </div>

      <Row className="g-4">
        {myItems.length === 0 ? (
          <Col xs={12} className="text-center py-5">
            <div className="fs-1 mb-3">📁</div>
            <h4 className="text-muted">You haven't uploaded any items yet.</h4>
            <Button variant="link" onClick={() => navigate("/lost-found-form")}>Start reporting now</Button>
          </Col>
        ) : (
          myItems.map((item) => (
            <Col md={6} lg={4} key={item._id}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                {/* Image Section */}
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={item.image ? `${BACKEND_URL}${item.image}` : "https://via.placeholder.com/300x180?text=No+Image"}
                    style={{ objectFit: "cover", height: "100%" }}
                  />
                </div>

                {/* Type Badge (Floating) */}
                <Badge 
                  bg={item.type === "lost" ? "danger" : "success"}
                  className="position-absolute top-0 end-0 m-3 px-3 py-2 text-uppercase shadow-sm"
                >
                  {item.type}
                </Badge>

                <Card.Body className="p-4">
                  <h5 className="fw-bold text-dark text-truncate">{item.title}</h5>
                  <p className="text-muted small mb-3" style={{ height: "40px", overflow: "hidden" }}>
                    {item.description}
                  </p>

                  <div className="small mb-3">
                    <div className="mb-1 text-dark">📍 <strong>Location:</strong> {item.location}</div>
                    <div className="text-muted">📅 <strong>Posted:</strong> {new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg={getStatusVariant(item.status)} className="px-3 py-2 rounded-pill">
                      {item.status?.toUpperCase() || "PENDING"}
                    </Badge>
                    
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="rounded-circle"
                        title="View Details"
                        onClick={() => navigate(`/item/${item._id}`)}
                      >
                        👁️
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="rounded-circle"
                        title="Delete Item"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default MyItems;