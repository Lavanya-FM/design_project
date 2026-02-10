# Fit & Flare Studio - Bespoke Blouse Stitching Platform

## Architecture Overview

This project is a full-stack web application designed for a professional bespoke tailoring business.

### Technology Stack
- **Frontend**: React (Vite) for a dynamic, responsive user interface.
- **Styling**: Vanilla CSS (CSS Modules) with a premium design system (variables for colors, typography, spacing). **No TailwindCSS**.
- **Backend**: Node.js + Express for a robust REST API.
- **Database**: PostgreSQL for structured data (users, measurements, designs, orders).
- **Authentication**: JWT (JSON Web Tokens) for secure user sessions.

### Project Structure

```
design_project/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/          # Database & App Configuration
│   │   ├── controllers/     # Request Handlers
│   │   ├── middlewares/     # Auth & Validation Middleware
│   │   ├── routes/          # API Route Definitions
│   │   ├── utils/           # Helper functions
│   │   └── app.js           # App Entry Point
│   ├── .env                 # Environment Variables
│   └── package.json
├── frontend/                # React Application
│   ├── src/
│   │   ├── assets/          # Images & Fonts
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/           # Page Components (Home, Design, etc.)
│   │   ├── services/        # API Service Calls
│   │   ├── styles/          # Global CSS & Variables
│   │   └── App.jsx
│   └── package.json
├── database/                # Database Scripts
│   └── schema.sql           # Database Schema Definition
└── README.md
```

## Core Features
1.  **User Authentication**: Sign up, Login, Profile Management.
2.  **Blouse Design**: Interactive customization (neckline, sleeves, fabric).
3.  **Measurements**: Profile-based measurement storage.
4.  **Order Management**: Order placement, payment integration, status tracking.
5.  **Admin Dashboard**: Manage orders, users, and designs.

## Design Philosophy
- **Aesthetics**: Premium, high-end fashion focus with "Fit & Flare" branding.
- **Simplicity**: Modular code, clear separation of concerns.
