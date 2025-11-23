
# 🔗 TinyLink - URL Shortener

A full-stack URL shortener application built with React, Express, and MongoDB. Create custom short links, track click statistics, and manage your URLs efficiently.

## Deployed Link

https://tiny-link-jp.netlify.app

---

## 🌟 Features

✅ **Create Short Links** - Convert long URLs into memorable short codes (6-8 alphanumeric characters)  
✅ **Custom Codes** - Choose your own custom short code  
✅ **Click Tracking** - Real-time analytics with total clicks and last clicked timestamp  
✅ **Link Management** - View, search, sort, and delete links  
✅ **Stats Dashboard** - Detailed statistics for each short link  
✅ **Health Monitoring** - System health check and uptime tracking  
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices  
✅ **Error Handling** - Comprehensive validation and user-friendly error messages  

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling with modern features

---

## 📁 Project Structure

```
tinylink/
├── backend/
│   ├── server.js          
│   ├── package.json       
│   └── .env                
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.jsx    
    │   │   ├── Stats.jsx        
    │   │   └── Health.jsx       
    │   ├── services/
    │   │   └── api.js           
    │   ├── styles/
    │   │   ├── Dashboard.css
    │   │   ├── Stats.css
    │   │   └── Health.css
    │   ├── App.jsx              
    │   ├── App.css              
    │   └── main.jsx             
    ├── public/
    │   └── _redirects           
    ├── index.html               
    ├── vite.config.js           
    ├── package.json             
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git installed

### Backend Setup

1. **Clone and navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file
cp .env

# Edit .env and add MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tinylink
PORT=5000
```

4. **Start the server**
```bash
npm start
# For development with auto-reload:
npm run dev
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file
cp .env

# Edit .env 
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000
```

### Endpoints

#### Health Check
```http
GET /healthz
```
**Response:**
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 12345.67,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Create Link
```http
POST /api/links
Content-Type: application/json

{
  "shortCode": "docs123",
  "targetUrl": "https://example.com/very/long/url"
}
```
**Success Response (201):**
```json
{
  "_id": "...",
  "shortCode": "docs123",
  "targetUrl": "https://example.com/very/long/url",
  "clicks": 0,
  "lastClicked": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Response (409):**
```json
{
  "error": "Short code already exists"
}
```

#### Get All Links
```http
GET /api/links
```
**Response (200):**
```json
[
  {
    "_id": "...",
    "shortCode": "docs123",
    "targetUrl": "https://example.com",
    "clicks": 42,
    "lastClicked": "2024-01-01T12:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Link Stats
```http
GET /api/links/:code
```
**Response (200):**
```json
{
  "_id": "...",
  "shortCode": "docs123",
  "targetUrl": "https://example.com",
  "clicks": 42,
  "lastClicked": "2024-01-01T12:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
**Error Response (404):**
```json
{
  "error": "Link not found"
}
```

#### Delete Link
```http
DELETE /api/links/:code
```
**Response (200):**
```json
{
  "message": "Link deleted successfully"
}
```

#### Redirect
```http
GET /:code
```
**Response:** 302 Redirect to target URL  
Increments click count and updates last clicked timestamp

---

## 🎯 Routes

### Frontend Routes
- `/` - Dashboard (list all links, create new links)
- `/code/:code` - Stats page for individual link
- `/healthz` - System health check page

### Backend Routes
- `GET /healthz` - Health check endpoint
- `POST /api/links` - Create new short link
- `GET /api/links` - Get all links
- `GET /api/links/:code` - Get link statistics
- `DELETE /api/links/:code` - Delete a link
- `GET /:code` - Redirect to target URL (302)

---

## ✅ Validation Rules

### Short Code Requirements
- Length: 6-8 characters
- Characters: Alphanumeric only (A-Z, a-z, 0-9)
- Uniqueness: Globally unique across all users
- Pattern: `/^[A-Za-z0-9]{6,8}$/`

### URL Requirements
- Must be a valid URL format
- Must include protocol (http:// or https://)
- Validated using JavaScript URL constructor

---

## 🎨 UI/UX Features

### States Handled
- ✅ Loading states (skeleton screens)
- ✅ Empty states (helpful messages)
- ✅ Error states (user-friendly error messages)
- ✅ Success states (confirmations)
- ✅ Disabled states (form submission)

### User Experience
- 🔍 **Search/Filter** - Search links by code or URL
- 🔄 **Sorting** - Sort by created date, clicks, or last clicked
- 📋 **Copy to Clipboard** - One-click link copying
- 📱 **Responsive Design** - Mobile-friendly interface
- ⚡ **Inline Validation** - Real-time form validation
- 🎯 **Clear Actions** - Intuitive button placement
- 🌈 **Visual Feedback** - Hover effects and animations

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tinylink
PORT=5000
BASE_URL= https://tinylink-backend-tuoe.onrender.com
```

### Frontend (.env)
```env
VITE_API_URL= https://tinylink-backend-tuoe.onrender.com
```

---

## 📝 Key Design Decisions

1. **MongoDB over PostgreSQL**: Chosen for flexible schema and easy cloud hosting
2. **Vite over CRA**: Faster build times and better development experience
3. **Axios over Fetch**: Better error handling and request/response interceptors
4. **Custom CSS over frameworks**: Complete design control and smaller bundle size
5. **Client-side routing**: Better UX with instant navigation
6. **UUID approach**: Reliable unique identification for links

---

## 🐛 Known Limitations

- No user authentication (all links are public)
- No edit functionality (delete and recreate required)
- No analytics graphs (only raw numbers)
- No QR code generation
- No link expiration
- No rate limiting on API

---

## 🚀 Future Enhancements

- [ ] Analytics dashboard with charts
- [ ] QR code generation
- [ ] Link expiration dates
- [ ] Edit link functionality
- [ ] Bulk operations
- [ ] API rate limiting
- [ ] Link categories/tags
- [ ] Custom domains

---

**⭐ Thank you for reviewing this project!**
