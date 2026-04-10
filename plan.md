# 📿 PanditBook – Update Plan (LLD + Feature Enhancements)

## 🧩 Overview

This document defines required changes in the existing PanditBook project.
**Important Rule:** No existing file or folder will be deleted. Only modifications and additions will be made.

---

## ⚠️ Constraints

* Do NOT delete any existing files or folders
* Only update or extend current code
* Maintain backward compatibility
* Follow clean and secure coding practices

---

## 🔐 Authentication (Secure Format)

### Changes Required

* Password must be hashed using bcrypt
* Use JWT-based authentication
* Store only minimal data in JWT

### JWT Payload

* userId
* role (user / pandit)

### Flow

1. Signup → hash password → store in DB
2. Login → verify password → generate JWT
3. Middleware → verify JWT → protect routes

### Security Enhancements

* Use `.env` for JWT_SECRET
* Token expiry (e.g., 1 day)
* Protect all private APIs

---

## 📍 Booking System Enhancement

### New Booking Flow

1. User selects pandit and creates booking
2. Booking status = Pending
3. 3-minute timer starts
4. Pandit can Accept or Decline

---

## ⏱️ Timer Logic

* Timer duration: 3 minutes (180 seconds)

### Conditions

* If pandit accepts → proceed to payment
* If pandit rejects → booking cancelled
* If no response → booking auto Expired

---

## 🧘 Pandit Home Page Changes

### Add Features

#### Booking Request Section

* Show user name
* Booking date/time
* Countdown timer

#### Action Buttons

* Accept Booking
* Decline Booking

---

## 🔄 Booking Status Values

* Pending
* Accepted
* Rejected
* Expired

---

## 🔌 API Updates

### Update Booking Status

PUT /api/bookings/:id/status

Request Body:

* status = Accepted / Rejected

---

## 💳 Payment Flow

### Rule

Payment allowed only after booking is accepted

### Flow

1. Booking created → Pending
2. Pandit accepts
3. Show Pay ₹21 button
4. Payment via Razorpay
5. Booking confirmed

---

## 💬 Real-Time Chat (Astrotalk-like)

### Features

* Chat enabled only after booking accepted
* Real-time messaging using Socket.IO
* Store chat history

### Chat Data

* senderId
* receiverId
* message
* timestamp

---

## 🧾 Pandit Dashboard

### Sections

#### Booking Requests

* Show all pending bookings
* Display timer

#### Accept / Decline

* Action buttons per booking

#### Upcoming Bookings

* Show accepted bookings

#### Upcoming Chats

* Show users with accepted bookings
* Chat Now option

---

## 🧠 Database Updates

### Booking Model

* userId
* panditId
* date
* status (Pending / Accepted / Rejected / Expired)
* paymentStatus
* createdAt

---

## ⏳ Timer Backend Logic

* Store booking creation time
* If currentTime > createdAt + 3 min → mark Expired
* Can be handled using:

  * Cron job
  * API validation check

---

## 🛠️ Frontend Changes

### User Side

* Show booking status
* Show payment button after acceptance
* Show chat option

### Pandit Side

* Booking list with timer
* Accept/Decline buttons
* Chat interface

---

## ☁️ Image Upload

* Use Cloudinary
* Store image URL in DB
* Validate file type

---

## 🛡️ Best Practices

* Validate all inputs
* Use try-catch in controllers
* Secure API routes
* Do not expose secrets
* Role-based access control

---

## 🚀 Final Flow

1. User logs in
2. Books pandit
3. Booking → Pending (3 min timer starts)
4. Pandit accepts/rejects
5. If accepted → user pays ₹21
6. Chat enabled
7. Service completed

---

## ✅ Expected Outcome

* Working booking system with timer
* Secure authentication
* Controlled payment flow
* Real-time chat system
* Scalable architecture
