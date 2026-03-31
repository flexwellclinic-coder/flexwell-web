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
            <a href="mailto:flexwellclinic@gmail.com" className="icon" title="Email us" aria-label="Email">
              📧
            </a>
            <a href="tel:+355693638806" className="icon" title="Call us" aria-label="Phone">
              📞
            </a>
            <a 
              href="https://maps.app.goo.gl/ntPjqr3s97foefo57" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="icon" 
              title="Find us on map" 
              aria-label="Location"
            >
              📍
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
