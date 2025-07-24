# Flex  Well Physiotherapy - React Web App

A modern, responsive React web application for Flex  Well Physiotherapy clinic in Dublin, Ireland.

## Features

### 🌐 **Bilingual Support**
- **English** and **Albanian** language support
- Dynamic language switching with localStorage persistence
- Complete translation of all content, forms, and navigation

### 📱 **Mobile-First Design**
- Responsive design that works on all devices
- Hamburger menu for mobile navigation
- Language switcher integrated into mobile menu
- Touch-friendly interface

### 🎨 **Modern UI/UX**
- Glassmorphism design elements
- Smooth animations and transitions
- Professional gradient backgrounds
- Modern typography using Inter font

### 🏥 **Complete Website Sections**
- **Home**: Hero section, services preview, call-to-action
- **About**: Team information, FAQ, contact details
- **Services**: Comprehensive treatment options and facilities
- **Appointment**: Online booking form with validation

### 🔧 **Technical Features**
- React 18 with functional components and hooks
- React Router for client-side routing
- Custom language switching hook
- Form validation and handling
- Mobile-responsive CSS with media queries

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Navigation and language switcher
│   ├── Footer.js        # Site footer
│   ├── Home.js          # Home page component
│   ├── About.js         # About page component
│   ├── Services.js      # Services page component
│   └── Appointment.js   # Appointment booking component
├── hooks/
│   └── useLanguage.js   # Language switching logic
├── styles/              # CSS files
│   ├── index.css        # Main styles
│   ├── aboutUs.css      # About page styles
│   ├── gallery.css      # Services page styles
│   └── appointment.css  # Appointment page styles
├── App.js               # Main app component with routing
└── index.js             # React entry point

public/
├── assets/              # Static assets
│   └── logo.jpeg        # Flex  Well logo
└── index.html           # HTML template
```

## Language System

The app uses a custom translation system:

- **Hook**: `useLanguage()` provides translation functions
- **Translation Function**: `t(englishText, albanianText)`
- **Language Storage**: Preferences saved in localStorage
- **Dynamic Updates**: Real-time language switching

## Responsive Design

### Desktop (> 768px)
- Full navigation menu
- Language switcher in header
- Multi-column layouts

### Mobile (≤ 768px)
- Hamburger menu navigation
- Language switcher inside mobile menu
- Single-column layouts
- Touch-optimized interface

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact Information

**Flex  Well Physiotherapy**
- 📍 123 Grafton Street, Dublin 2, Ireland
- 📞 +353 1 234 5678
- 📧 info@flexwellphysio.ie
- 🕒 Mon-Fri: 8AM-7PM | Sat: 9AM-2PM

## License

© 2024 Flex  Well Physiotherapy. All rights reserved. 