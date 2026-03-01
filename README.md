# G.M.T Logistics - Collection & Delivery Order Management System

A modern web application for managing logistics orders with real-time notifications via WhatsApp and Email.

## Features
- User Authentication (Firebase)
- Order Creation & Management
- Real-time WhatsApp & Email Notifications
- Digital Signature Capture
- Location Maps Integration
- Order History Tracking
- PDF Receipt Generation
- Admin Dashboard for Order Confirmation

## Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Maps**: Leaflet & OpenStreetMap
- **Notifications**: EmailJS & WhatsApp API
- **PDF Generation**: jsPDF & html2canvas
- **Styling**: React CSS

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase Account
- EmailJS Account

## Setup
1. Clone the repository
   git clone https://github.com/Gmtransportandlogistics/G.M-Trans-Logistics-.git
   cd G.M-Trans-Logistics-
2. Install dependencies
   npm install
3. Setup Environment Variables
   Create a `.env.local` file from `.env.example` and add your credentials:
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
4. Start the development server
   npm run dev
5. Build for production
   npm run build

## Project Structure
src/
├── components/
│   ├── Navbar.jsx
│   └── ...
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── OrderForm.jsx
│   ├── OrderHistory.jsx
│   └── ...
├── context/
│   └── AuthContext.jsx
├── App.jsx
├── firebase.js
└── index.css

## Key Components
### AuthContext
Context provider for user authentication and state management.
### OrderForm
Complete order creation with signature capture and map integration.
### AdminDashboard
Admin panel for order confirmation and pricing.
### ReceiptGenerator
PDF receipt generation for confirmed orders.

## Firebase Configuration Requirements:
- Firestore Database
- Authentication (Email/Password)
- Cloud Storage (for signatures)
- Firestore Rules for security

## Environmental Services
- **EmailJS**: For email notifications
- **WhatsApp**: For order notifications (via WhatsApp Business API)
- **Maps**: OpenStreetMap tiles via Leaflet

## Usage
1. Sign up or log in
2. Navigate to "Order" page
3. Fill in collection & delivery details
4. Add your signature
5. Submit order
6. Await confirmation from admin
7. Download receipt as PDF

## Team
- **Manager**: Brave
- **Owner**: Godfree
- **Support**: +27 62 121 6131
- **Email**: gmtlogistics@gmail.com

## License
This project is private and proprietary to G.M.T Logistics.

## Notes
- All API keys should be secured and never committed to version control
- Firebase rules should be configured for production
- WhatsApp integration requires WhatsApp Business API setup