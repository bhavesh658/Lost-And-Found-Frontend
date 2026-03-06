import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Container, Row, Col, Card, Badge, Button, 
    Spinner, Modal, Form 
} from "react-bootstrap";
import ChatBox from "../pages/ChatBox"; // ChatBox import kiya

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
    const currentUserId = localStorage.getItem("userId"); // Logic ke liye userId
    const userName = localStorage.getItem("userName") || "Student"; 

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
            if (proofFile) formData.append("proofImage", proofFile);

            await axios.post(`${BACKEND_URL}/api/claims/create`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                }
            });

            toast.success(item.type === "found" ? "Claim request sent! ✅" : "Information sent! ✅");
            setClaimSent(true);
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Action Failed ❌");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Container className="text-center mt-5 py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading Item Details...</p>
        </Container>
    );

    if (!item) return <Container className="mt-5 text-center"><h4>Item not found 😕</h4></Container>;

    const isOwner = item.user?._id === currentUserId;

    return (
        <Container className="py-5">
            <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none mb-4 p-0 text-dark fw-bold">
                ← Back to List
            </Button>

            <Row className="g-4">
                {/* LEFT COLUMN: ITEM DETAILS */}
                <Col lg={8}>
                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden mb-4">
                        <Row className="g-0">
                            <Col md={5} className="bg-light d-flex align-items-center justify-content-center p-3">
                                <img
                                    src={item.image ? `${BACKEND_URL}${item.image}` : "https://via.placeholder.com/600x450"}
                                    alt={item.title}
                                    className="img-fluid rounded-4 shadow-sm w-100"
                                    style={{ maxHeight: "400px", objectFit: "cover" }}
                                />
                            </Col>
                            <Col md={7}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Badge bg={item.type === "lost" ? "danger" : "success"} className="text-uppercase px-3 py-2">
                                            {item.type}
                                        </Badge>
                                        <small className="text-muted">Status: <b>{item.status}</b></small>
                                    </div>
                                    <h2 className="fw-bold text-dark">{item.title}</h2>
                                    <p className="text-muted">{item.description}</p>
                                    <hr />
                                    <div className="small mb-4">
                                        <p className="mb-1"><strong>📍 Location:</strong> {item.location}</p>
                                        <p className="mb-1"><strong>👤 Reported By:</strong> {item.user?.name}</p>
                                        <p className="mb-0"><strong>📅 Date:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="d-grid gap-2">
                                        {isOwner ? (
                                            <div className="alert alert-info border-0 rounded-pill text-center fw-bold py-2 mb-0">
                                                📢 This is your report
                                            </div>
                                        ) : (
                                            <>
                                                <Button
                                                    size="lg"
                                                    className="rounded-pill fw-bold border-0 shadow-sm"
                                                    style={{ background: claimSent ? "#6c757d" : "linear-gradient(135deg, #16a34a, #2b6cb0)" }}
                                                    disabled={claimSent || item.status === "recovered"}
                                                    onClick={() => setShowModal(true)}
                                                >
                                                    {claimSent 
                                                        ? "✓ Request Sent" 
                                                        : item.type === "found" ? "🙋 Claim This Item" : "🔍 I Found This Item"}
                                                </Button>
                                                <Button variant="outline-dark" className="rounded-pill fw-bold" onClick={() => window.location = `mailto:${item.user?.email}`}>
                                                    📩 Contact Reporter
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>

                    {/* CHAT SECTION INTEGRATED HERE */}
                    <ChatBox itemId={id} currentUser={{ name: userName }} />
                </Col>

                {/* RIGHT COLUMN: QUICK INFO / TIPS */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-light">
                        <h5 className="fw-bold mb-3">💡 Safety Tips</h5>
                        <ul className="small text-muted ps-3">
                            <li className="mb-2">Always meet in a public campus area for item exchange.</li>
                            <li className="mb-2">Do not share sensitive personal information in chat.</li>
                            <li className="mb-0">Verify the item thoroughly before concluding the claim.</li>
                        </ul>
                    </Card>
                </Col>
            </Row>

            {/* DYNAMIC MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered shadow>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">
                        {item.type === "found" ? "Submit Your Claim" : "Found this item?"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <Form onSubmit={handleClaimSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">
                                {item.type === "found" ? "Describe how this belongs to you" : "Where did you find it?"}
                            </Form.Label>
                            <Form.Control 
                                as="textarea" rows={3} required 
                                placeholder={item.type === "found" ? "E.g. It has a blue keychain..." : "E.g. Found near Library Gate..."}
                                onChange={(e) => setClaimMsg(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Upload Photo Proof</Form.Label>
                            <Form.Control type="file" required accept="image/*" onChange={(e) => setProofFile(e.target.files[0])} />
                        </Form.Group>
                        <Button 
                            type="submit" className="w-100 rounded-pill fw-bold border-0 shadow"
                            style={{ background: "linear-gradient(135deg, #2b6cb0, #16a34a)" }}
                            disabled={submitting}
                        >
                            {submitting ? "Sending..." : "Submit for Verification"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ItemDetails;