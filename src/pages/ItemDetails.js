import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Container, Row, Col, Card, Badge, Button, 
    Spinner, ListGroup, Modal, Form 
} from "react-bootstrap";

function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [claimSent, setClaimSent] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [claimMsg, setClaimMsg] = useState("");
    const [proofFile, setProofFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");
    // const BACKEND_URL = "http://localhost:5000";
    const BACKEND_URL = "https://lost-and-found-backend-3cak.onrender.com";

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchItem();
            if (token) await checkClaimStatus();
            setLoading(false);
        };
        loadData();
    }, [id]);

    const fetchItem = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/items/${id}`);
            setItem(res.data);
        } catch (error) {
            toast.error("Failed to load item details");
        }
    };

    const checkClaimStatus = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/claims/my-claims`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const alreadyClaimed = res.data.find((claim) => claim.item?._id === id);
            if (alreadyClaimed) setClaimSent(true);
        } catch (error) {
            console.log("Claim check error:", error);
        }
    };

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.warn("Please login first!");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("itemId", id);
            formData.append("message", claimMsg);
            if (proofFile) {
                formData.append("proofImage", proofFile);
            }

            await axios.post(
                `${BACKEND_URL}/api/claims/create`,
                formData,
                { headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                }}
            );

            toast.success(item.type === "found" ? "Claim request sent! ✅" : "Information sent to owner! ✅");
            setClaimSent(true);
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Action Failed ❌");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (!item) return <Container className="mt-5"><h4>Item not found</h4></Container>;

    return (
        <Container className="py-5">
            <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none mb-4 p-0 text-dark fw-bold">
                ← Back
            </Button>

            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                <Row className="g-0">
                    <Col lg={6} className="bg-light d-flex align-items-center justify-content-center p-4">
                        <img
                            src={item.image ? `${BACKEND_URL}${item.image}` : "https://via.placeholder.com/600x450"}
                            alt={item.title}
                            className="img-fluid rounded-4 shadow-sm"
                            style={{ maxHeight: "500px", objectFit: "cover" }}
                        />
                    </Col>
                    <Col lg={6}>
                        <Card.Body className="p-4 p-md-5">
                            <Badge bg={item.type === "lost" ? "danger" : "success"} className="mb-2 text-uppercase">
                                {item.type}
                            </Badge>
                            <h1 className="fw-bold">{item.title}</h1>
                            <p className="fs-5 text-muted">{item.description}</p>
                            
                            <div className="bg-light p-3 rounded-4 mb-4">
                                <p className="mb-1"><strong>📍 Location:</strong> {item.location}</p>
                                <p className="mb-0"><strong>👤 Reporter:</strong> {item.user?.name}</p>
                            </div>

                            <div className="d-grid gap-3">
                                {/* DYNAMIC BUTTON TEXT */}
                                <Button
                                    size="lg"
                                    className="rounded-pill fw-bold border-0 shadow"
                                    style={{ background: claimSent ? "#6c757d" : "linear-gradient(135deg, #16a34a, #2b6cb0)" }}
                                    disabled={claimSent || item.status === "recovered"}
                                    onClick={() => setShowModal(true)}
                                >
                                    {claimSent 
                                        ? "✓ Request Sent" 
                                        : item.type === "found" 
                                            ? "🙋 Claim This Item" 
                                            : "🔍 I Found This Item"}
                                </Button>
                                
                                <Button variant="outline-dark" className="rounded-pill fw-bold" onClick={() => window.location = `mailto:${item.user?.email}`}>
                                    📩 Contact {item.type === "found" ? "Finder" : "Owner"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>

            {/* DYNAMIC MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">
                        {item.type === "found" ? "Submit Your Claim" : "Found this item?"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <Form onSubmit={handleClaimSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">
                                {item.type === "found" 
                                    ? "Describe how this belongs to you" 
                                    : "Where and when did you find it?"}
                            </Form.Label>
                            <Form.Control 
                                as="textarea" rows={3} required 
                                placeholder={item.type === "found" ? "E.g. It has a sticker of..." : "E.g. I found it near the canteen..."}
                                onChange={(e) => setClaimMsg(e.target.value)}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">
                                Upload Photo {item.type === "found" ? "(Proof of Ownership)" : "(The item you found)"}
                            </Form.Label>
                            <Form.Control 
                                type="file" required accept="image/*"
                                onChange={(e) => setProofFile(e.target.files[0])}
                            />
                        </Form.Group>

                        <Button 
                            type="submit" className="w-100 rounded-pill fw-bold border-0"
                            style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
                            disabled={submitting}
                        >
                            {submitting ? "Sending..." : "Send to Admin for Verification"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ItemDetails;