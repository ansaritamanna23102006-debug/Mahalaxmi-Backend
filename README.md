# Mahalaxmi Mithaiwala Ecommerce Backend (Since 1982)

This repository contains the complete production-ready MVC backend for **Mahalaxmi Mithaiwala**, a heritage sweets and farsan store based in Kurla, Mumbai.

Built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, it features secure JWT authentication with HTTP-only cookies, Joi input validation, Helmet, CORS, and full Razorpay integration.

---

## 🛠 Tech Stack & Security

- **Core**: Node.js & Express.js (MVC Design Pattern)
- **Database**: MongoDB Atlas using Mongoose ODM
- **Authentication**: Access (Header Bearer JWT) & Refresh Tokens (HTTP-Only Cookie) + Bcrypt password hashing
- **Payment Gateway**: Razorpay (including Signature Verification and Webhook capture handlers)
- **Media Upload**: Cloudinary using Multer file streaming (with a local filesystem mock fallback for offline dev mode)
- **Email Dispatch**: Nodemailer HTML formatting (with a console-logger fallback for offline dev mode)
- **Security Protocols**: Helmet security headers, CORS protection, express-rate-limiting, MongoDB query sanitization, XSS filters, and Joi payload validations.
- **Documentation**: Swagger API Playground at `/api-docs`

---

## 📁 Project Directory Layout

```text
backend/
├── src/
│   ├── config/          # Configurations (Database, Cloudinary, Razorpay, Swagger)
│   ├── controllers/     # Route business handlers (MVC Controller)
│   ├── middleware/      # Guards (JWT authentication, rate limiting, file uploads, errors)
│   ├── models/          # Mongoose collections schemas (MVC Model)
│   ├── routes/          # Express route bindings (MVC View / REST Endpoints)
│   ├── services/        # Integrations (emails, Razorpay checkouts, Cloudinary uploads)
│   ├── utils/           # Shared utility tools & fallback mocks
│   ├── validations/     # Joi validation rules schemas
│   ├── app.js           # Express app setup and middleware configuration
│   └── server.js        # Entrypoint listening on port 5000
├── uploads/             # Temporary folder for local mock image storage
├── .env.example         # Reference template for credentials
├── .env                 # Active local environment variables
├── package.json         # Dependency manifest
└── README.md            # Documentation
```

---

## ⚙️ Quick Start Installation

### 1. Prerequisites
- Install **Node.js** (v16+)
- Install **MongoDB** locally OR set up a free **MongoDB Atlas** cluster.

### 2. Install Dependencies
Run the command below in the backend folder:
```bash
npm install
```

### 3. Setup Environment variables
Copy the `.env.example` file and create a `.env` file:
```bash
cp .env.example .env
```
Fill in the variables inside `.env`. If you run in **Development/Offline Mode** with the default settings:
- **MongoDB** defaults to a local instance: `mongodb://127.0.0.1:27017/mahalaxmi`
- **Cloudinary** and **Razorpay** will fall back to safe simulator mocks.
- **Nodemailer** will fall back to printing generated emails directly in the server console log.

### 4. Running the Server

**To run in Development Mode (includes nodemon auto-restart):**
```bash
npm run dev
```

**To run in Production Mode:**
```bash
npm start
```

Once started:
- The server will run on `http://localhost:5000`
- The Swagger Interactive API Docs can be visited at `http://localhost:5000/api-docs`
