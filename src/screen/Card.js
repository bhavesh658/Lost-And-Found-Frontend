import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Card.css";

function ItemCard({ item, getStatusVariant }) {
  const navigate = useNavigate();

  // Backend ka Base URL (Jahan se images aayengi)
  // const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL = "https://lost-and-found-backend-3cak.onrender.com";

  return (
    <Card className="item-card shadow-sm mb-4 h-100 border-0 rounded-4 overflow-hidden transition-hover">
      
      {/* IMAGE CONTAINER */}
      <div className="image-container" style={{ height: "200px", overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={
            item.image 
              ? `${BACKEND_URL}${item.image}` // Backend URL + Image Path
              : "https://via.placeholder.com/300x200?text=No+Image+Available"
          }
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
          alt={item.title}
        />
      </div>

      <Card.Body className="p-3">
        {/* TITLE + TYPE BADGE */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: "70%" }}>
            {item.title}
          </h5>
          <Badge
            pill
            bg={item.type === "lost" ? "danger" : "success"}
            className="text-uppercase px-2 py-1"
            style={{ fontSize: "0.7rem" }}
          >
            {item.type}
          </Badge>
        </div>

        {/* DESCRIPTION */}
        <Card.Text className="text-muted small mb-3">
          {item.description?.length > 60 
            ? `${item.description.slice(0, 60)}...` 
            : item.description}
        </Card.Text>

        {/* INFO SECTION */}
        <div className="item-info small">
          <p className="mb-1 text-dark">
            <span className="me-2">📍</span>{item.location}
          </p>
          <p className="mb-1 text-dark">
            <span className="me-2">👤</span>{item.user?.name || "Student"}
          </p>
          <p className="mb-2 text-muted" style={{ fontSize: "0.8rem" }}>
            <span className="me-2">📅</span>{new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* STATUS BADGE */}
        <div className="mb-3">
          <Badge 
            bg={getStatusVariant ? getStatusVariant(item.status) : "secondary"}
            className="rounded-pill px-3"
          >
            {item.status || "pending"}
          </Badge>
        </div>

        {/* VIEW DETAILS BUTTON */}
        <Button
          variant="outline-primary"
          className="w-100 rounded-pill fw-bold py-2"
          onClick={() => navigate(`/item/${item._id}`)}
        >
          View Full Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ItemCard;