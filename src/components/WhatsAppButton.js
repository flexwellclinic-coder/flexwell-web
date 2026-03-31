import React from "react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/355693638806"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9999,
        textDecoration: "none",
      }}
    >
      <span style={{ color: "white", fontSize: "28px" }}>💬</span>
    </a>
  );
};

export default WhatsAppButton;
