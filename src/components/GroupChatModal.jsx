import React, { useState, useEffect } from "react";
import { Modal, List, Input, Button, message as AntMessage } from "antd";
import axios from "axios";
import axiosPrivate from "../axiosInterceptors/axiosPrivate";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const ChatModal = ({ groupId, selectedChat, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Fetch messages when the modal opens
    if (selectedChat === groupId) {
      fetchMessages();
    }
  }, [groupId, selectedChat === groupId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/api/v1/groupchats/${groupId}/chat/`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      AntMessage.error("Could not load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axiosPrivate.post(
        `/api/v1/groupchats/${groupId}/chat/`,
        {
          message: message,
        }
      );
      setMessages([...messages, response.data]); // Add new message to the state
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      AntMessage.error("Could not send message. Please try again.");
    }
  };

  return (
    <Modal
      title="Group Chat"
      open={selectedChat == groupId}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length > 0 ? (
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: user.id === msg.user ? "flex-end" : "flex-start",
                padding: "10px 0",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {msg.username}
              </div>
              <div>{msg.message}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                {new Date(msg.created_at).toLocaleString()}
              </div>
            </List.Item>
          )}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        />
      ) : (
        <p>No messages yet. Start the conversation!</p>
      )}

      {/* Message Input */}
      <div style={{ marginTop: "20px" }}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          rows={2}
        />
        <Button
          type="primary"
          onClick={handleSendMessage}
          style={{ marginTop: "10px", width: "100%" }}
        >
          Send
        </Button>
      </div>
    </Modal>
  );
};

export default ChatModal;
