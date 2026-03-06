import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Form, Button, Card, InputGroup, Spinner } from "react-bootstrap";

// Live hai toh backend URL, warna localhost
const socket = io.connect("https://lost-and-found-backend-3cak.onrender.com"); 

function ChatBox({ itemId, currentUser }) {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    if (itemId) {
      // 1. Room join karo item ID ke basis par
      socket.emit("join_room", itemId);

      // 2. Pehle se koi message receive karne ka listener
      socket.on("receive_message", (data) => {
        setChatLog((prev) => [...prev, data]);
      });
    }

    // Cleanup taaki multiple listeners na ban jayein
    return () => socket.off("receive_message");
  }, [itemId]);

  // Messages aate hi niche scroll karne ke liye
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const messageData = {
        roomId: itemId,
        sender: currentUser.name,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // 3. Backend ko message bhejna
      await socket.emit("send_message", messageData);
      
      // Khud ki screen par message dikhana
      setChatLog((prev) => [...prev, messageData]); 
      setMessage("");
    }
  };

  return (
    <Card className="shadow-lg border-0 rounded-4 mt-4 overflow-hidden chat-container">
      <Card.Header className="bg-primary text-white py-3 d-flex align-items-center">
        <span className="fs-5 me-2">💬</span>
        <h6 className="mb-0 fw-bold">Item Discussion Group</h6>
      </Card.Header>

      <Card.Body className="chat-body" style={{ height: "350px", overflowY: "auto", background: "#f0f2f5" }}>
        {chatLog.length === 0 && (
          <div className="text-center text-muted mt-5 small">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {chatLog.map((msg, index) => (
          <div 
            key={index} 
            ref={scrollRef} 
            className={`d-flex mb-3 ${msg.sender === currentUser.name ? "justify-content-end" : "justify-content-start"}`}
          >
            <div 
              className={`p-2 px-3 rounded-4 shadow-sm ${
                msg.sender === currentUser.name ? "bg-primary text-white" : "bg-white text-dark"
              }`} 
              style={{ maxWidth: "80%", borderRadius: msg.sender === currentUser.name ? "20px 20px 0 20px" : "20px 20px 20px 0" }}
            >
              <small className="d-block fw-bold opacity-75" style={{ fontSize: "0.65rem" }}>
                {msg.sender === currentUser.name ? "You" : msg.sender}
              </small>
              <div className="message-text">{msg.text}</div>
              <small className="d-block text-end opacity-50" style={{ fontSize: "0.6rem" }}>
                {msg.time}
              </small>
            </div>
          </div>
        ))}
      </Card.Body>

      <Card.Footer className="bg-white border-0 p-3">
        <Form onSubmit={sendMessage}>
          <InputGroup className="shadow-sm rounded-pill overflow-hidden border">
            <Form.Control
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-0 py-2 px-4 shadow-none"
            />
            <Button type="submit" variant="primary" className="px-4 border-0">
              Send
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
}

export default ChatBox;