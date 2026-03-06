import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const api = axios.create({
  // baseURL: "https://lost-and-found-backend-3cak.onrender.com/api",
  baseURL: "http://localhost:5000/api"
});

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const BACKEND_URL = "https://lost-and-found-backend-3cak.onrender.com";
  // const BACKEND_URL = "http://localhost:5000";

  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Image zoom karne ke liye modal state
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, itemsRes, claimsRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/items/all"),
        api.get("/claims/all"),
      ]);
      setStats(statsRes.data);
      setItems(itemsRes.data);
      setClaims(claimsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data!");
    } finally {
      setLoading(false);
    }
  };

  const openImage = (src) => {
    setModalImg(src);
    setShowModal(true);
  };

  const updateClaimStatus = async (id, status) => {
    try {
      await api.put(`/claims/${id}`, { status });
      toast.success(`Claim ${status} successfully!`);
      loadDashboard();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container fluid className="py-5 px-md-5 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">🛠 Admin Control Panel</h2>

      {/* ITEMS TABLE WITH IMAGES */}
      <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
        <Card.Header className="bg-white p-4 border-0"><h5 className="fw-bold mb-0">📦 All Items</h5></Card.Header>
        <Table responsive hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Type</th>
              <th>Posted By</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <img 
                    src={item.image ? `${BACKEND_URL}${item.image}` : "https://via.placeholder.com/50"} 
                    alt="item" 
                    className="rounded shadow-sm cursor-pointer"
                    style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => openImage(`${BACKEND_URL}${item.image}`)}
                  />
                </td>
                <td className="fw-bold">{item.title}</td>
                <td><Badge bg={item.type === "lost" ? "danger" : "success"}>{item.type.toUpperCase()}</Badge></td>
                <td>{item.user?.name}</td>
                <td className="text-end">
                  <Button variant="outline-danger" size="sm" onClick={() => api.delete(`/items/admin/${item._id}`).then(loadDashboard)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* CLAIMS TABLE WITH PROOF IMAGES */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white p-4 border-0"><h5 className="fw-bold mb-0">🙋 Claim Requests</h5></Card.Header>
        <Table responsive hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Item</th>
              <th>Proof Image</th>
              <th>Claimant</th>
              <th>Message</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td className="small fw-bold">{claim.item?.title}</td>
                <td>
                  {claim.proofImage ? (
                    <img 
                      src={`${BACKEND_URL}${claim.proofImage}`} 
                      alt="proof" 
                      className="rounded"
                      style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer", border: "2px solid #2b6cb0" }}
                      onClick={() => openImage(`${BACKEND_URL}${claim.proofImage}`)}
                    />
                  ) : <span className="text-muted small">No Proof</span>}
                </td>
                <td>{claim.user?.name}</td>
                <td className="text-muted small" style={{ maxWidth: "150px" }}>{claim.message}</td>
                <td><Badge bg={claim.status === "pending" ? "warning" : "success"}>{claim.status}</Badge></td>
                <td className="text-end">
                  <Button variant="success" size="sm" className="me-2" disabled={claim.status !== "pending"} onClick={() => updateClaimStatus(claim._id, "approved")}>Approve</Button>
                  <Button variant="danger" size="sm" disabled={claim.status !== "pending"} onClick={() => updateClaimStatus(claim._id, "rejected")}>Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* IMAGE VIEWER MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-transparent border-0">
            <img src={modalImg} alt="Preview" className="img-fluid rounded shadow-lg w-100" />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;