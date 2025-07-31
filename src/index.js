import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/aboutUs.css';
import './styles/gallery.css';
import './styles/appointment.css';
import './styles/admin.css';
import App from './App';

console.log('Flex Well App starting...'); // Debug log

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Flex Well App rendered successfully'); // Debug log
} catch (error) {
  console.error('Error rendering Flex Well App:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; color: white; background: #1f2937;">
      <h1>Flex Well</h1>
      <p>Loading... If this persists, please refresh the page.</p>
      <p>Error: ${error.message}</p>
    </div>
  `;
} 