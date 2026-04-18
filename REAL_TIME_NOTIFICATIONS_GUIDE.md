# Real-Time Notifications Guide for BookPandit

## Overview
This guide explains the real-time notification system implemented in the BookPandit application using Socket.io. The system provides instant notifications for:
1. **Booking Requests** - When a user books a pandit
2. **Booking Status Updates** - When a pandit accepts or rejects a booking
3. **Real-Time Chat** - Messages between users and pandits

## Features Implemented

### 1. Real-Time Booking Notifications (Pandit Side)
When a user books a pandit, the pandit receives an instant notification popup.

**Flow:**
```
User Books Pandit
    ↓
API Call: POST /api/booking/poojaBooks
    ↓
Backend emits: io.to(`pandit_${panditId}`).emit("new_booking_notification", bookingData)
    ↓
Pandit's PanditHome page receives notification
    ↓
BookingNotificationPopup component displays
    ↓
Pandit clicks Accept/Decline
    ↓
API updates booking status
    ↓
Backend emits notification to user
```

### 2. Real-Time Booking Status Updates (User Side)
When a pandit accepts or rejects a booking, the user is instantly notified.

**Acceptance Flow:**
```
Pandit clicks "Accept" in popup
    ↓
API: PUT /api/bookings/{id}/status with status="Accepted"
    ↓
Backend emits: io.to(`user_${userId}`).emit("booking_accepted_notification", data)
    ↓
User sees toast notification
    ↓
Booking status updates to "Accepted"
    ↓
User can now proceed to payment
```

**Rejection Flow:**
```
Pandit clicks "Decline" in popup
    ↓
API: PUT /api/bookings/{id}/status with status="Rejected"
    ↓
Backend emits: io.to(`user_${userId}`).emit("booking_rejected_notification", data)
    ↓
User sees error toast
    ↓
After 2 seconds, user navigates to Sorry page
```

### 3. Real-Time Chat
Users and pandits can chat in real-time after booking acceptance.

**Features:**
- Messages are persisted in the database
- Chat is only allowed after booking is accepted
- Message history is loaded on page load
- New messages appear instantly via Socket.io

## Socket Events

### Client to Server Events

#### Pandit Events
- `join_pandit_room` - Pandit joins their notification room
  - Parameters: `{ panditId }`
- `booking_accepted` - Pandit accepts a booking
  - Parameters: `{ bookingId, panditId, userId }`
- `booking_rejected` - Pandit rejects a booking
  - Parameters: `{ bookingId, panditId, userId }`

#### User Events
- `join_user_room` - User joins their notification room
  - Parameters: `{ userId }`

#### Chat Events (Both)
- `join_room` - Join a chat room
  - Parameters: `{ userId, panditId }`
- `send_message` - Send a message
  - Parameters: `{ senderId, receiverId, text, userId, panditId }`

### Server to Client Events

#### Pandit Events
- `new_booking_notification` - New booking received
  - Data: Complete booking object with all details
- `booking_status_updated` - Booking status changed

#### User Events
- `booking_accepted_notification` - Booking was accepted
  - Data: `{ bookingId, panditId, message }`
- `booking_rejected_notification` - Booking was rejected
  - Data: `{ bookingId, panditId, message }`

#### Chat Events (Both)
- `receive_message` - New message received
  - Data: Message object from database
- `chat_error` - Chat not available
  - Data: `{ message }`

## Component Details

### BookingNotificationPopup.jsx
**Location:** `frontend/src/components/BookingNotificationPopup.jsx`

**Features:**
- Displays booking details (client name, pooja type, date, time, etc.)
- Shows countdown timer (3 minutes to respond)
- Accept/Decline buttons
- Disables buttons when time expires
- Shows error messages if applicable

**Props:**
```javascript
{
  booking,     // Booking object from socket event
  onClose,     // Callback when popup closes
  token        // Auth token for API calls
}
```

### NotificationContext.jsx
**Location:** `frontend/src/context/NotificationContext.jsx`

**Purpose:** Global state management for notifications

**Provides:**
```javascript
{
  socket,                // Socket.io instance
  bookingNotification,   // Current notification data
  isNotificationVisible, // Popup visibility state
  dismissNotification,   // Close popup
  emitBookingAccepted,   // Emit acceptance event
  emitBookingRejected,   // Emit rejection event  
  emitJoinPanditRoom,    // Join pandit room
}
```

### Updated PanditHome.jsx
**Key Changes:**
- Initializes Socket.io connection
- Joins pandit room on mount
- Listens for `new_booking_notification` events
- Displays `BookingNotificationPopup` when notification received
- Refreshes bookings list after accepting/declining

### Updated UserBookings.jsx
**Key Changes:**
- Initializes Socket.io connection
- Joins user room on mount
- Listens for `booking_accepted_notification` events
- Listens for `booking_rejected_notification` events
- Shows toast notifications
- Auto-navigates to Sorry page on rejection
- Updates booking status in real-time

## Backend Implementation

### Updated socket.js
**New Features:**
- Pandit room management (pandit_${panditId})
- User room management (user_${userId})
- Booking notification events
- Maintained chat functionality

### Updated poojaBooks.controller.js

**createBooking() Changes:**
- Emits `new_booking_notification` to pandit's room via Socket.io
- Provides real-time notification when booking is created

**updateBookingStatus() Changes:**
- Emits `booking_accepted_notification` or `booking_rejected_notification` to user's room
- Provides instant status updates to user

**Implementation:**
```javascript
// Get io instance from express app
const io = req.app.get('io');

// Emit notification
io.to(`pandit_${panditId}`).emit("new_booking_notification", bookingData);
```

### Updated server.js
**Changes:**
- Attaches Socket.io instance to app
- Makes io accessible to all routes via `req.app.get('io')`

```javascript
app.set('io', io);
```

## Vercel Deployment Configuration

### Updated vercel.json
**Features:**
- Handles SPA (Single Page Application) routing
- Correctly routes all requests to backend server.js
- Prevents 404 errors on page refresh
- Configures CORS headers properly

**Configuration:**
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "frontend/dist/**", "use": "@vercel/static" }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    },
    {
      "src": "/(.*)",
      "dest": "server.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }
  ]
}
```

## Setup Instructions

### 1. Environment Variables
Ensure `.env` file contains:
```
SOCKET_PORT=your_port
CORS_ORIGIN=your_frontend_url
```

### 2. Frontend Configuration
In `frontend/src/config/api.js`:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://your-api.vercel.app";
const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE_URL || API_BASE;
```

### 3. Dependencies
Ensure these packages are installed:
```bash
# Backend
npm install socket.io

# Frontend
npm install socket.io-client
```

## Testing the Implementation

### Test Pandit Notification
1. Pandit logs in and goes to PanditHome
2. User logs in and books a pandit
3. Pandit should see popup immediately with booking details
4. Pandit clicks Accept/Decline
5. Popup closes after response is submitted

### Test User Notification
1. User books a pandit
2. Goes to UserBookings page
3. Pandit accepts the booking
4. User sees toast notification
5. Booking status updates to "Accepted"
6. Payment button appears

### Test Rejection Flow
1. User books a pandit
2. Pandit rejects the booking
3. User sees error notification
4. User navigates to Sorry page after 2 seconds

### Test Chat
1. Booking is accepted
2. User clicks "Chat Now" in UserBookings
3. Both parties can send/receive messages in real-time

## Troubleshooting

### Notifications Not Received
**Solution:**
1. Check if Socket.io connection is established
2. Verify pandit/user IDs are stored correctly in localStorage
3. Check browser console for socket errors
4. Verify backend logs for emission events

### Chat Not Working
**Solution:**
1. Ensure booking is in "Accepted" state
2. Check if chat endpoints are accessible
3. Verify Socket.io room IDs match (userId_panditId)
4. Check if Message model has proper indexes

### Page Refresh 404 Error
**Solution:**
1. Ensure vercel.json is properly configured
2. Check if all routes point to server.js
3. Clear Vercel cache and redeploy

### Duplicate Key Error on Phone Number
**Problem:** Getting "E11000 duplicate key error" when creating bookings with the same phone number

**Root Cause:**
- MongoDB has a unique index on the phoneNo field that was created previously
- The phoneNo field should NOT be unique because multiple users can book different poojas with the same phone number

**Solution:**
1. **Remove the unique index:**
   -Run the cleanup script: `node Backend/scripts/cleanup-indexes.js`
   - Or use MongoDB Compass to drop the `phoneNo_1` index
   - Or run in MongoDB Shell: `db.poojabooks.dropIndex("phoneNo_1");`

2. **Frontend validation (now implemented):**
   - Phone must be 10 digits
   - Must start with 6, 7, 8, or 9
   - Real-time validation as user types

3. **Backend validation (improved):**
   - Phone format validation (10 digits, starts with 6-9)
   - Checks for existing active bookings per user+pandit+date
   - Better error messages

4. **Database validation:**
   - phoneNo field is NOT unique: `unique: false`
   - Allows same number for different dates/poojas
   - Compound check: userId + panditId + date must be unique

**After Fix:**
- ✅ User can book with same phone number for different poojas/dates
- ✅ User cannot have multiple pending/accepted bookings with same pandit on same date
- ✅ Clear error messages for validation failures

**How to run cleanup script:**
```bash
# Node.js method
node Backend/scripts/cleanup-indexes.js

# Or manually in MongoDB Shell
db.poojabooks.dropIndex("phoneNo_1");
```

## Future Enhancements

### ✅ NEW: Email Notifications with Accept/Reject Links

When a user books a pandit, an automated email is sent to the pandit with **instant accept/reject decision links**.

**Features:**
- Beautiful HTML email template with booking details
- One-click accept/reject links (no login required)
- Secure token-based decision validation (24-hour expiry)
- Real-time notification to user after pandit's decision
- No rate limiting for email links
- Mobile-friendly email design

**Email Flow:**
```
User Books Pandit
    ↓
API: POST /api/booking/poojaBooks
    ↓
1. Generate decision token (32-byte hex, 24h validity)
2. Send beautiful HTML email to pandit with:
   - Booking details (client name, phone, pooja type, date, time, address)
   - ✅ Accept Booking button (with secure token link)
   - ❌ Decline Booking button (with secure token link)
    ↓
Pandit receives email
    ↓
Pandit clicks Accept or Decline link
    ↓
Backend validates token:
   - Check if token matches booking
   - Check if token hasn't expired
   - Check if booking is still Pending
    ↓
Update booking status
    ↓
Emit real-time notification to user via Socket.io
    ↓
Display confirmation page to pandit
```

**Implementation Details:**

**Backend:**

1. **Email Service Enhancement** (`Backend/services/email.service.js`):
```javascript
// Supports both plain text and HTML emails
sendEmail(to, subject, message, isHtml = false)

// New function with beautiful HTML template
sendBookingNotificationEmail(panditEmail, booking, acceptLink, rejectLink)
```

2. **PoojaBooks Model** (`Backend/models/poojaBooks.model.js`):
```javascript
decisionToken: String,      // Secure token for email links
tokenExpiresAt: Date        // 24-hour expiration
```

3. **Controller** (`Backend/controllers/poojaBooks.controller.js`):
```javascript
// In createBooking():
const decisionToken = generateDecisionToken(); // 32-byte hex
const tokenExpiresAt = new Date(Date.now() + 24*60*60*1000);

// Send email with links
await sendBookingNotificationEmail(panditEmail, booking, 
    `${baseUrl}/api/bookings/${id}/decision/accept?token=${decisionToken}`,
    `${baseUrl}/api/bookings/${id}/decision/reject?token=${decisionToken}`
);

// New endpoint handles link clicks
handleBookingDecisionFromEmail(bookingId, decision, token)
  - Validates token and expiration
  - Updates booking status
  - Emits real-time Socket.io notification to user
  - Returns HTML confirmation page
```

4. **Routes** (`Backend/routes/poojaBooks.routes.js`):
```javascript
// No authentication needed - token is in URL
router.get('/:bookingId/decision/:decision', 
    poojaBooksController.handleBookingDecisionFromEmail);
```

**Email Template Features:**
- Gradient header with custom branding
- Organized booking details table
- Large, color-coded action buttons
- Mobile-responsive design
- Professional footer with branding

**Security:**
- Tokens are cryptographically random (32 bytes)
- Tokens expire after 24 hours
- Token is cleared after first use
- Token must match booking's stored token
- Booking status verified (must be Pending)

**Environment Variables (in `.env`):**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://bookpandit.com (for email links)
```

**Testing Email Notifications:**
1. Create a new booking as user
2. Check pandit's email inbox
3. Verify email contains proper formatting and links
4. Click accept/reject button in email
5. Verify pandit sees confirmation page
6. Verify user receives real-time notification
7. Verify booking status updated correctly

**Email Link Example:**
```
https://bookpandit.com/api/bookings/507f1f77bcf86cd799439011/decision/accept?token=a1b2c3d4e5f6...
```

**Response Page:**
When pandit clicks link, they see:
- ✅ Success message if accepted
- ❌ Declined message if rejected
- ⚠️ Error message if token expired
- Link back to BookPandit

---

## Future Enhancements

1. **Notifications Persistence** - Store unread notifications in database
2. **Notification Center** - Centralized notification history page
3. **Typing Indicators** - Show when someone is typing in chat
4. **Read Receipts** - Show if message was read
5. **Voice/Video Call** - Integrate WebRTC for calls
6. **File Sharing** - Allow image/document sharing in chat
7. **Group Chat** - Support multiple participants

## Security Considerations

1. **Authentication** - All Socket.io events verify user identity
2. **Authorization** - Chat is only allowed for accepted bookings
3. **Validation** - All booking data is validated on backend
4. **CORS** - Properly configured to prevent unauthorized access
5. **Rate Limiting** - Consider adding rate limits for bookings

## Performance Optimization

1. **Connection Pooling** - Reuse Socket.io connections
2. **Message Pagination** - Load chat history in chunks
3. **Notification Debouncing** - Prevent duplicate notifications
4. **Image Optimization** - Compress profile images
5. **Database Indexes** - Index frequently queried fields

## Support

For issues or questions, contact the development team or refer to:
- Socket.io Documentation: https://socket.io/docs/
- Express Documentation: https://expressjs.com/
- React Documentation: https://react.dev/
