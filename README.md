# PanditBooking

PanditBooking is a full-stack web application that connects users with verified Pandits and Astrologers for booking rituals, astrology consultations, and Vastu services. It supports real-time chat, secure payments, and AI-powered astrology predictions.

---

## Features

- **User & Pandit Registration/Login** (with OTP email verification)
- **Book Pooja Services** (choose Pandit, pay online, get email confirmation)
- **Astrology Consultation** (browse astrologers, chat in real-time)
- **Vastu Shastra Tips** (learn and copy tips for your home)
- **AI Astrology Prediction** (chat with AI for instant predictions)
- **Real-Time Chat** (Socket.io based chat between user and pandit)
- **Secure Payments** (Razorpay integration)
- **Admin & Profile Management**
- **Responsive Frontend** (React + Tailwind CSS)

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Real-Time:** Socket.io
- **Payments:** Razorpay
- **Email:** Nodemailer (Gmail)
- **AI:** Perplexity API (OpenAI compatible)
- **Authentication:** JWT, OTP via Email

---

## Folder Structure

```
PanditBooking-main/
├── Backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── public/
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Its-bhanu/bookPandit.git
cd PanditBooking-main
```

### 2. Backend Setup

- Install dependencies:

  ```bash
  cd Backend
  npm install
  ```

- Create a `.env` file in `Backend/` with:

  ```
  DB_CONNECT=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  EMAIL_USER=your_gmail_address
  EMAIL_PASS=your_gmail_app_password
  RAZORPAY_KEY_ID=your_razorpay_key_id
  RAZORPAY_KEY_SECRET=your_razorpay_key_secret
  PERPLEXITY_API_KEY=your_perplexity_api_key
  ```

- Start backend server:

  ```bash
  node server.js
  ```

### 3. Frontend Setup

- Install dependencies:

  ```bash
  cd ../frontend
  npm install
  ```

- Start frontend:

  ```bash
  npm start
  ```

### 4. Real-Time Chat (Socket.io)

- The backend should include Socket.io setup in `server.js` to handle chat events.
- Frontend uses `socket.io-client` in `ChatPage.jsx` for real-time messaging.

---

## Key Endpoints

### User

- `POST /api/user/register` — Register user (OTP email)
- `POST /api/user/verify-otp` — Verify OTP
- `POST /api/user/login` — Login
- `GET /api/user/profile` — Get user profile

### Pandit

- `POST /api/pandits/register` — Register pandit (OTP email)
- `POST /api/pandits/verify-otp` — Verify OTP
- `POST /api/pandits/login` — Login
- `GET /api/pandits/AllProfiles` — List all pandits
- `GET /api/pandits/profile` — Get pandit profile

### Booking

- `POST /api/booking/poojaBooks` — Create booking
- `DELETE /api/pandits/poojaBooks/:id` — Delete booking

### Payment

- `POST /api/payment/createOrder` — Create Razorpay order
- `POST /api/payment/verifyPayment` — Verify payment

### Chat

- `GET /api/chat/messages/:userId/:panditId` — Get chat messages

### AI Astrology

- `POST /api/ai/predict` — Get AI astrology prediction

---

## Frontend Pages

- **Home.jsx** — Landing page, services, highlights
- **PanditProfile.jsx** — Browse and book Pandits
- **AstroConsult.jsx** — Browse and chat with Astrologers
- **VastuSastra.jsx** — Vastu tips and guides
- **aiAstrology.jsx** — AI astrology chat
- **ChatPage.jsx** — Real-time chat between user and pandit

---

## Environment Variables

Set these in your `.env` file (Backend):

- `DB_CONNECT` — MongoDB connection string
- `JWT_SECRET` — JWT secret key
- `EMAIL_USER` — Gmail address for sending OTPs
- `EMAIL_PASS` — Gmail app password
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — Razorpay credentials
- `PERPLEXITY_API_KEY` — Perplexity/OpenAI API key

---

## How Real-Time Chat Works

- **Socket.io** is used for real-time communication.
- Users and Pandits join a room (`userId_panditId`).
- Messages are sent and received instantly.
- Chat history is stored in MongoDB (`Message.model.js`).

---

## AI Astrology Prediction

- Uses Perplexity API (OpenAI compatible) for generating astrology answers.
- Users provide birth details and questions.
- AI responds in Hinglish, short and logical format.

---

## License

MIT

---

## Contact

For support or queries, contact:  
**Email:** bhanu772899sharma@gmail.com  
**Phone:** +91 8854072557

---

## Credits

Developed by Bhanu sharma

