# VORTREXYN — Premium Car Rental System

A full-stack multi-page web application for a premium car rental service. Users can browse vehicles, make reservations, and pay online. An admin dashboard allows staff to manage bookings, fleet stock, and custom vehicles with AI-generated images.

---

## Screenshots

### Login
![Login](screenshots/01-login.png)

### Sign Up
![Sign Up](screenshots/02-signup.png)

### Forgot Password
![Forgot Password](screenshots/03-forgot-password.png)

### Home — Fleet Browse
![Home](screenshots/04-home.png)

### Reservations — Booking Form
![Reservations](screenshots/05-reservations.png)

### Order Confirmation
![Order Confirmation](screenshots/06-order-confirmation.png)

### My Reservations
![My Reservations](screenshots/07-my-reservations.png)

### Profile
![Profile](screenshots/08-profile.png)

### Admin — Overview
![Admin Overview](screenshots/09-admin-overview.png)

### Admin — All Bookings
![Admin Bookings](screenshots/10-admin-bookings.png)

### Admin — Fleet Inventory
![Admin Fleet](screenshots/11-admin-fleet.png)

### Admin — All Users
![Admin Users](screenshots/12-admin-users.png)

### Admin — Revenue Stats
![Admin Revenue](screenshots/13-admin-revenue.png)

### Admin — Add Vehicle (AI)
![Admin Add Vehicle](screenshots/14-admin-add-vehicle.png)

---

## Features

### User-Facing
- **Browse & Search** — filter 625+ vehicles by brand, type, price range, and availability across 25+ luxury and performance marques
- **Reservations** — multi-field booking form auto-populated from the user's saved profile (name, contact, license number)
- **Order Confirmation** — real-time booking written to Firestore with stock decrement and instant EmailJS confirmation email
- **PayPal Payments** — live PayPal SDK integration (AUD); payment only unlocks after admin approval
- **My Reservations** — full booking history with status tracking (pending → approved → paid / cancelled)
- **Cancellation Flow** — one-click cancel restores fleet stock and triggers automated cancellation email
- **User Profile** — editable profile with base64 photo upload, stored in Firestore

### Authentication
- Email/password registration and login via Firebase Auth
- Google OAuth sign-in
- Password reset via email link
- Protected routes — all pages redirect to login if unauthenticated

### Admin Dashboard
- **Overview** — live stats: total bookings, revenue, active users, fleet utilisation
- **Booking Management** — view all reservations, approve or cancel with one click, full booking details
- **Fleet Inventory** — real-time stock control across the full 625-car catalog with per-VIN count overrides
- **User Management** — view all registered users and their booking history
- **Revenue Analytics** — earnings breakdown by date range and vehicle category
- **Add Custom Vehicle** — add vehicles outside the standard catalog with AI-generated image (DALL-E 3) and AI-written description (GPT-4o-mini)

### AI & Automation
- **DALL-E 3 Image Generation** — admin inputs make/model/year, OpenAI returns a photorealistic studio render
- **GPT-4o-mini Descriptions** — auto-generates marketing copy for custom vehicles
- **EmailJS Automation** — transactional emails for booking approvals and cancellations with booking details

### Platform & Infrastructure
- Netlify serverless functions proxy all OpenAI API calls (key never exposed to the browser)
- Firestore security rules enforce role-based access (admin vs. user document isolation)
- `serve.json` and Netlify redirects provide clean URLs matching the Express dev-server behaviour
- Fully responsive dark/gold premium UI across all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | Tailwind CSS (CDN) |
| Auth | Firebase Authentication (email/password + Google OAuth) |
| Database | Cloud Firestore |
| Payments | PayPal Live SDK (AUD) |
| AI — Images | OpenAI DALL-E 3 |
| AI — Descriptions | OpenAI GPT-4o-mini |
| Email | EmailJS |
| Backend | Node.js + Express |
| Serverless | Netlify Functions |
| Data | JSON catalog (`data/cars.json`) |
| Version Control | Git + GitHub |

## Project Structure

```
/
├── index.html                        # Entry point — Login page
├── server.js                         # Express server (static serving + DALL-E proxy)
├── firestore.rules                   # Firestore security rules
├── netlify.toml                      # Netlify build config, function routing, redirects
├── serve.json                        # Clean URL config for static serving
├── .env.example                      # Environment variable template
├── package.json
│
├── netlify/
│   └── functions/
│       ├── generate-car-image.js     # Serverless proxy — OpenAI DALL-E 3
│       └── generate-car-description.js # Serverless proxy — OpenAI GPT-4o-mini
│
├── public/
│   ├── home.html                     # Car listing / search dashboard
│   ├── reservations.html             # Car detail + booking form
│   ├── orderConfirmation.html        # Booking confirmation (writes to Firestore)
│   ├── myReservations.html           # User reservation history + PayPal payment
│   ├── profile.html                  # User profile (photo stored as base64)
│   ├── admin.html                    # Admin dashboard (bookings, fleet, users, revenue)
│   ├── signup.html                   # Registration
│   ├── forgot.html                   # Password reset
│   ├── favicon.ico                   # Favicon assets
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png                  # PWA icons
│   └── icon-512.png
│
├── src/
│   ├── css/style.css                 # Global styles
│   └── js/app.js                     # Shared JS utilities
│
├── assets/
│   ├── cars/                         # Vehicle type images (coupe, sedan, SUV, etc.)
│   │   └── models/                   # Individual model images (290+ vehicles)
│   ├── portfolio-screenshots/        # Marketing screenshots
│   ├── bg.png … bg4.png              # Page background images
│   └── vortrexyn-logo.png            # Brand logo
│
├── data/
│   └── cars.json                     # 625-car catalog
│
└── screenshots/                      # README documentation screenshots
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for DALL-E 3 image generation |

## Firebase Configuration

- **Project:** `vortrexyn-car-rental-system`
- **Admin account:** `vortrexyn.madmax@gmail.com`
- Auth type: email/password

## EmailJS Configuration

- **Service:** `service_29gwayk`
- **Approval template:** `template_p5tesbb`
- **Cancellation template:** `template_ho59umh`
- **Public key:** `T_E3Q6Fu5wJ5OmOMd`

## Quick Start

```bash
git clone https://github.com/FarhanHossen/VORTREXYN-Premium-Car-Rental.git
cd VORTREXYN-Premium-Car-Rental
npm install          # install dependencies
npm start            # serves on http://localhost:5000
```

## Development

```bash
# Install dependencies
npm install

# Start local dev server (port 5000)
npm start

# Deploy to Netlify (via GitHub — push triggers auto-deploy)
git add .
git commit -m "your message"
git push origin main

# Publish updated Firestore security rules
# → Firebase Console → Firestore → Rules → paste firestore.rules → Publish
```

## Website

The platform is hosted on **Netlify**, connected to GitHub for continuous deployment.

| Property | Value |
|---|---|
| Source | repo root (`/`) |
| Build command | `npm install` |
| Publish directory | `.` |
| Functions directory | `netlify/functions` |
| Live URL | https://vortrexyn-premium-car-rental-system.com |

## Links

- Live Site: https://vortrexyn-premium-car-rental-system.com
- GitHub: https://github.com/FarhanHossen/VORTREXYN-Premium-Car-Rental
