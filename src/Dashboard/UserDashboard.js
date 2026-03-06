import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Toastify for notifications
import ItemCard from "../screen/Card";
import Footer from "../screen/Footer";

function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial render

  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    recovered: 0,
    matches: 0,
  });

  useEffect(() => {
    // Initial fetch function
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchStats(), fetchAllItems()]);
      } catch (error) {
        toast.error("Error loading dashboard data!");
      } finally {
        setLoading(false); // Hide spinner after first load
      }
    };

    fetchInitialData();

    // Auto-refresh every 3 seconds (Silent refresh without loader)
    const interval = setInterval(() => {
      fetchStats();
      fetchAllItems();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ================= USER STATS =================
  const fetchStats = async () => {
    // https://lost-and-found-backend-3cak.onrender.com
    try {
      const res = await axios.get("https://lost-and-found-backend-3cak.onrender.com/api/items/user-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= ALL ITEMS =================
  const fetchAllItems = async () => {
    try {
      const res = await axios.get("https://lost-and-found-backend-3cak.onrender.com/api/items/all");
      setAllItems(res.data);
    } catch (error) {
      console.error("Error fetching all items:", error);
    }
  };

  // ================= STATUS COLOR =================
  const getStatusVariant = (status) => {
    if (status === "approved") return "success";
    if (status === "recovered") return "primary";
    if (status === "pending") return "warning";
    return "secondary";
  };

  // Stats Array for easy mapping & styling
  const statCards = [
    { label: "Lost Items", value: stats.lostItems, icon: "🔍", color: "danger" },
    { label: "Found Items", value: stats.foundItems, icon: "🎉", color: "success" },
    { label: "Recovered", value: stats.recovered, icon: "🤝", color: "primary" },
    { label: "Matches", value: stats.matches, icon: "✨", color: "warning" },
  ];

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Spinner animation="grow" variant="primary" />
        <h5 className="mt-3 text-primary fw-bold">Loading your dashboard...</h5>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Container className="py-5 flex-grow-1">
        
        {/* ================= HEADER ================= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">👋 Welcome Back!</h2>
            <p className="text-muted mb-0">Here's a quick overview of your lost & found activities.</p>
          </div>
          
          <div className="d-flex gap-3 mt-3 mt-md-0">
            <Button
              variant="outline-primary"
              className="rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => navigate("/my-items")}
            >
              📦 My Uploads
            </Button>
            <Button
              className="rounded-pill px-4 fw-bold shadow-sm border-0"
              style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
              onClick={() => navigate("/lost-found-form")}
            >
              + Report Item
            </Button>
          </div>
        </div>

        {/* ================= STATS SECTION ================= */}
        <Row className="g-4 mb-5">
          {statCards.map((stat, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="border-0 shadow-sm rounded-4 h-100 text-center py-4 px-2">
                <div className="fs-1 mb-2">{stat.icon}</div>
                <h2 className={`fw-bold text-${stat.color} mb-1`}>{stat.value || 0}</h2>
                <p className="text-muted small mb-0 fw-medium text-uppercase tracking-wider">
                  {stat.label}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ================= ALL ITEMS GRID ================= */}
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h4 className="fw-bold mb-1">🌍 Community Board</h4>
            <p className="text-muted small mb-0">Recently reported items around the campus.</p>
          </div>
        </div>

        <Row className="g-4 mb-5">
          {allItems.length === 0 ? (
            <Col xs={12}>
              <Card className="border-0 shadow-sm rounded-4 text-center py-5 bg-white">
                <div className="fs-1 mb-3">📭</div>
                <h5 className="fw-bold text-dark">No items uploaded yet!</h5>
                <p className="text-muted">Be the first to report a lost or found item.</p>
                <div>
                  <Button 
                    variant="outline-primary" 
                    className="rounded-pill mt-2"
                    onClick={() => navigate("/lost-found-form")}
                  >
                    Report an Item
                  </Button>
                </div>
              </Card>
            </Col>
          ) : (
            allItems.map((item) => (
              <Col md={6} lg={4} key={item._id}>
                {/* Aapka custom ItemCard component yahan render ho raha hai */}
                <ItemCard
                  item={item}
                  getStatusVariant={getStatusVariant}
                />
              </Col>
            ))
          )}
        </Row>

      </Container>
      
      <Footer />
    </div>
  );
}

export default UserDashboard;