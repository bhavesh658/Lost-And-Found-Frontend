import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Form, Button, Card, InputGroup } from "react-bootstrap";

const BACKEND_URL = "https://lost-and-found-backend-3cak.onrender.com";
const socket = io.connect(BACKEND_URL); 

function ChatBox({ itemId, currentUser }) {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  // Local storage se apni ID fetch karna
  const myId = localStorage.getItem("userId");

  useEffect(() => {
    if (itemId) {
      const fetchChatHistory = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/chat/${itemId}`);
          setChatLog(res.data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchChatHistory();
      socket.emit("join_room", itemId);

      socket.on("receive_message", (data) => {
        setChatLog((prev) => [...prev, data]);
      });
    }
    return () => socket.off("receive_message");
  }, [itemId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const messageData = {
        roomId: itemId,
        senderId: myId, // Yahan strictly local ID bhej rahe hain
        sender: currentUser.name,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setChatLog((prev) => [...prev, messageData]); 
      setMessage("");
    }
  };

  return (
    <Card className="shadow-lg border-0 rounded-4 mt-4 overflow-hidden">
      <Card.Header className="bg-primary text-white py-3">
        <h6 className="mb-0 fw-bold">💬 Discussion Room</h6>
      </Card.Header>

      <Card.Body className="chat-body" style={{ height: "400px", overflowY: "auto", background: "#e5ddd5" }}>
        {loading ? (
          <div className="text-center mt-5 text-muted">Loading messages...</div>
        ) : (
          chatLog.map((msg, index) => {
            
            // ⭐ SOLID ALIGNMENT LOGIC: Sirf senderId match karein
            // Agar msg database se aaya hai, to usme senderId hogi
            const isMe = msg.senderId === myId;

            return (
              <div 
                key={index} 
                className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}
              >
                <div 
                  className={`p-2 px-3 shadow-sm ${isMe ? "bg-success text-white" : "bg-white text-dark"}`} 
                  style={{ 
                    maxWidth: "75%", 
                    borderRadius: isMe ? "15px 15px 0 15px" : "15px 15px 15px 0",
                    position: "relative"
                  }}
                >
                  {/* DOOSRE KA NAAM: Sirf tab dikhega jab msg Left side ho (mera na ho) */}
                  {!isMe && (
                    <small className="d-block fw-bold mb-1" style={{ fontSize: "0.7rem", color: "#d63384" }}>
                      {msg.sender}
                    </small>
                  )}
                  
                  <div style={{ wordBreak: "break-word" }}>{msg.text}</div>
                  
                  <small className={`d-block text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`} style={{ fontSize: "0.6rem" }}>
                    {msg.time}
                  </small>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </Card.Body>

      <Card.Footer className="bg-light p-3">
        <Form onSubmit={sendMessage}>
          <InputGroup className="bg-white rounded-pill overflow-hidden border p-1 shadow-sm">
            <Form.Control
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-0 px-3 shadow-none"
            />
            <Button type="submit" variant="primary" className="rounded-pill px-4 fw-bold">
              SEND
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
}

export default ChatBox;