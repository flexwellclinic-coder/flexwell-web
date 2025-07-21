import React from 'react';

const Footer = ({ t }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; 2024 Flex Well Physiotherapy. All rights reserved.</p>
          </div>
          <div className="footer-icons">
            <span className="icon">📧</span>
            <span className="icon">📞</span>
            <span className="icon">📍</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 