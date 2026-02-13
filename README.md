# 🏔️ Tourism Recommendation System - Project Structure

Complete documentation of the client (frontend) and client-server (backend) architecture.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Client (Frontend)](#client-frontend)
3. [Client-Server (Backend)](#client-server-backend)
4. [Database Structure](#database-structure)
5. [API Endpoints](#api-endpoints)
6. [Setup & Installation](#setup--installation)
7. [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

**Project Name:** Roamio Wanderly - Tourism Recommendation System for Nepal

**Tech Stack:**
- **Frontend:** React.js + Vite + TailwindCSS
- **Backend:** Python Flask + SQLAlchemy
- **Database:** SQLite
- **Authentication:** Clerk
- **Email:** Gmail SMTP
- **Maps:** Leaflet (OpenStreetMap)

**Purpose:** An AI-powered tourism recommendation platform for Nepal featuring personalized travel suggestions, itinerary planning, place discovery, and comprehensive travel information.

---

## 🎨 Client (Frontend)

**Location:** `client/`

**Port:** `http://localhost:5173`

### 📁 Directory Structure

```
client/
├── public/                    # Static assets
│   ├── Team/                 # Team member photos
│   └── IMG_8851.MP4          # Video assets
├── src/
│   ├── assets/               # Images and media
│   │   ├── festivals/        # Festival SVG icons
│   │   ├── months/           # Month SVG icons
│   │   ├── Fspots/          # Famous spots images
│   │   ├── Nature/          # Nature places images
│   │   └── team/            # Team photos
│   ├── components/          # Reusable components
│   │   ├── header/          # Header & Navigation
│   │   │   ├── Header.jsx   # Main header with search, features
│   │   │   ├── NepaliCalendar.jsx
│   │   │   └── Sidebar.jsx  # Mobile sidebar menu
│   │   ├── footer/          # Footer component
│   │   ├── AIInsights.jsx   # AI recommendations
│   │   ├── CategoryFilter.jsx
│   │   ├── ChartComponent.jsx
│   │   ├── ChatInput.jsx    # Chat interface
│   │   ├── ChatMessage.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── FestivalImage.jsx
│   │   ├── HotelSection.jsx
│   │   ├── ImageGallery.jsx
│   │   ├── RestaurantSection.jsx
│   │   └── SearchDropdownList.jsx
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.jsx # Dark/Light mode
│   ├── pages/               # Main pages
│   │   ├── admin/           # Admin panel
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── AllNatureDetail.jsx      # Nature places listing
│   │   ├── AllPlacesDetail.jsx      # All places listing
│   │   ├── AllSpotsDetail.jsx       # Famous spots listing
│   │   ├── Contact.jsx              # Contact page with map
│   │   ├── ExploreNepal.jsx         # Province exploration
│   │   ├── ExploreSection.jsx       # Explore section
│   │   ├── FamousSpots.jsx          # Famous tourist spots
│   │   ├── Gallery.jsx              # Image gallery
│   │   ├── Home.jsx                 # Homepage
│   │   ├── Itinerary.jsx            # Trip planning
│   │   ├── NaturePlaces.jsx         # Nature destinations
│   │   ├── NewsletterArchive.jsx    # Newsletter archive
│   │   ├── PlaceDetailView.jsx      # Individual place details
│   │   ├── RecommendationPage.jsx   # Recommendation form
│   │   ├── RecommendationResults.jsx # Recommendation results
│   │   ├── SearchResultPageNew.jsx  # Search results
│   │   └── Wishlist.jsx             # User wishlist
│   ├── services/            # API service layer
│   │   ├── recommendationService.js
│   │   └── wishlistService.js
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # TailwindCSS config
```

### 🎯 Key Features

#### 1. **Homepage**
- Hero section with video background
- Famous tourist spots carousel
- Nature places showcase
- Explore Nepal by provinces
- Newsletter subscription

#### 2. **Search & Discovery**
- Global search with modal interface
- Category filters (Places, Hotels, Restaurants)
- Advanced filtering options
- Real-time search results

#### 3. **Recommendation System**
- AI-powered personalized recommendations
- User preference form (age, travelers, duration, trip type)
- Travel month selection
- Customized place suggestions

#### 4. **Place Details**
- Comprehensive place information
- Image galleries
- Nearby hotels and restaurants
- User reviews and ratings
- "Plan Your Visit" integration

#### 5. **Itinerary Planning**
- Multi-day trip planning
- Destination selection
- Activity scheduling
- Budget estimation
- Downloadable itinerary

#### 6. **User Features**
- Wishlist management
- User authentication (Clerk)
- Profile management
- Review submission

#### 7. **Admin Panel**
- Secure login (JWT authentication)
- Dashboard analytics
- Content management
- User management

#### 8. **Contact Page**
- Contact form with email integration
- Interactive map (Leaflet/OpenStreetMap)
- Office information
- FAQs section

### 🎨 Design Features

- **Dark/Light Mode:** Full theme switching support
- **Responsive Design:** Mobile-first approach
- **Animations:** Smooth transitions and hover effects
- **Icons:** React Icons library
- **Maps:** Leaflet with CartoDB tiles
- **Internationalization:** Multi-language support ready

### 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "vite": "^5.x",
  "tailwindcss": "^3.x",
  "@clerk/clerk-react": "Authentication",
  "leaflet": "Maps",
  "react-leaflet": "React map components",
  "axios": "HTTP client",
  "react-icons": "Icon library"
}
```

---

## 🖥️ Client-Server (Backend)

**Location:** `client-server/`

**Port:** `http://localhost:8000`

### 📁 Directory Structure

```
client-server/
├── app/                      # Main application
│   ├── routes/              # API route handlers
│   │   ├── admin.py         # Admin authentication & dashboard
│   │   ├── chat_routes.py   # AI chatbot
│   │   ├── contact.py       # Contact form emails
│   │   ├── hotels.py        # Hotel data
│   │   ├── images.py        # Image management
│   │   ├── places.py        # Places & events
│   │   ├── recommendations.py # AI recommendations
│   │   ├── restaurants.py   # Restaurant data
│   │   ├── reviews.py       # User reviews
│   │   ├── rooms.py         # Room management
│   │   ├── search.py        # Search functionality
│   │   ├── similar_places.py # Similar place recommendations
│   │   ├── users.py         # User management
│   │   └── wishlist.py      # Wishlist operations
│   ├── __init__.py          # App initialization
│   ├── app.py               # Flask app factory
│   ├── ai.py                # AI/ML logic
│   ├── auth.py              # JWT authentication
│   ├── crud.py              # Database CRUD operations
│   ├── database.py          # Database configuration
│   ├── email_service.py     # Email sending
│   └── models.py            # SQLAlchemy models
├── datasets/                # Dataset files
│   ├── events.csv
│   ├── hotels.csv
│   ├── places.csv
│   └── restaurants.csv
├── Gmail/                   # Email configuration
│   └── setup_gmail.py
├── maintenance/             # Utility scripts
│   ├── create_admin.py      # Create admin users
│   ├── load_dataset_simple.py # Load dataset
│   ├── migrate_database.py  # Database migrations
│   └── README.md            # Maintenance docs
├── uploads/                 # User uploads
│   └── reviews/            # Review images
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
└── tourism.db              # SQLite database
```

### 🔧 Core Components

#### 1. **Flask Application (`app.py`)**
- App factory pattern
- CORS configuration
- Blueprint registration
- Database initialization

#### 2. **Database Models (`models.py`)**
```python
- Place          # Tourist destinations
- Hotel          # Accommodation
- Restaurant     # Dining options
- Event          # Festivals & events
- Review         # User reviews
- Wishlist       # User wishlists
- Recommendation # AI recommendations
- Admin          # Admin users
- ChatHistory    # Chat conversations
```

#### 3. **Authentication (`auth.py`)**
- JWT token generation
- Password hashing (bcrypt)
- Token verification
- Admin authentication

#### 4. **Email Service (`email_service.py`)**
- Gmail SMTP integration
- Contact form emails
- Newsletter emails
- HTML email templates

#### 5. **AI/ML (`ai.py`)**
- Recommendation algorithm
- User preference matching
- Content-based filtering
- Collaborative filtering

### 🛣️ API Routes

#### **Places**
```
GET    /api/places                    # Get all places
GET    /api/places/<id>               # Get place details
GET    /api/places/<id>/events        # Get place events
POST   /api/places                    # Create place (admin)
PUT    /api/places/<id>               # Update place (admin)
DELETE /api/places/<id>               # Delete place (admin)
```

#### **Hotels**
```
GET    /api/hotels                    # Get all hotels
GET    /api/hotels/<id>               # Get hotel details
GET    /api/hotels/place/<place_id>  # Hotels by place
```

#### **Restaurants**
```
GET    /api/restaurants               # Get all restaurants
GET    /api/restaurants/<id>          # Get restaurant details
GET    /api/restaurants/place/<place_id> # Restaurants by place
```

#### **Search**
```
GET    /api/search?query=<term>       # Search places/hotels/restaurants
GET    /api/search/suggestions        # Search suggestions
```

#### **Recommendations**
```
POST   /api/recommendations           # Get AI recommendations
GET    /api/recommendations/<id>      # Get saved recommendation
GET    /api/recommendations/user/<user_id> # User's recommendations
```

#### **Similar Places**
```
GET    /api/similar-places/<place_id> # Get similar places
```

#### **Reviews**
```
GET    /api/reviews/place/<place_id>  # Get place reviews
POST   /api/reviews                   # Submit review
PUT    /api/reviews/<id>              # Update review
DELETE /api/reviews/<id>              # Delete review
```

#### **Wishlist**
```
GET    /api/wishlist/<user_id>        # Get user wishlist
POST   /api/wishlist                  # Add to wishlist
DELETE /api/wishlist/<id>             # Remove from wishlist
GET    /api/wishlist/check            # Check if in wishlist
```

#### **Contact**
```
POST   /api/contact                   # Send contact form email
```

#### **Admin**
```
POST   /admin/login                   # Admin login
GET    /admin/dashboard               # Dashboard data
GET    /admin/places                  # Manage places
GET    /admin/reviews                 # Manage reviews
GET    /admin/users                   # Manage users
```

#### **Chat**
```
POST   /api/chat                      # Send chat message
GET    /api/chat/history/<user_id>   # Get chat history
```

### 🔐 Authentication

#### **Admin Authentication**
- JWT-based authentication
- Access token + Refresh token
- Token expiry: 1 hour (access), 7 days (refresh)
- Password hashing with bcrypt

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

#### **User Authentication**
- Handled by Clerk (frontend)
- User ID passed to backend APIs
- No password storage in backend

### 📧 Email Configuration

**Service:** Gmail SMTP

**Configuration:**
```python
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL = "wanderlyroamio@gmail.com"
```

**Features:**
- Contact form submissions
- Newsletter subscriptions
- HTML email templates
- Attachment support

### 🗄️ Database Schema

#### **Places Table**
```sql
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- category (TEXT)
- location (TEXT)
- image_url (TEXT)
- rating (REAL)
- latitude (REAL)
- longitude (REAL)
- source (TEXT) # 'dataset' or 'user_submission'
- status (TEXT) # 'approved' or 'pending'
```

#### **Hotels Table**
```sql
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- place_id (INTEGER, FOREIGN KEY)
- description (TEXT)
- price_range (TEXT)
- rating (REAL)
- amenities (TEXT)
- contact (TEXT)
```

#### **Restaurants Table**
```sql
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- place_id (INTEGER, FOREIGN KEY)
- cuisine_type (TEXT)
- price_range (TEXT)
- rating (REAL)
- specialties (TEXT)
```

#### **Reviews Table**
```sql
- id (INTEGER, PRIMARY KEY)
- place_id (INTEGER, FOREIGN KEY)
- user_id (TEXT)
- user_name (TEXT)
- rating (INTEGER)
- comment (TEXT)
- images (TEXT) # JSON array
- created_at (DATETIME)
```

#### **Recommendations Table**
```sql
- id (INTEGER, PRIMARY KEY)
- user_id (TEXT)
- name (TEXT)
- age (INTEGER)
- phone (TEXT)
- travellers (INTEGER)
- trip_duration (TEXT)
- trip_type (TEXT) # JSON array
- travel_month (TEXT)
- recommended_places (TEXT) # JSON array of place IDs
- created_at (DATETIME)
```

#### **Wishlist Table**
```sql
- id (INTEGER, PRIMARY KEY)
- user_id (TEXT)
- place_id (INTEGER, FOREIGN KEY)
- created_at (DATETIME)
```

### 📦 Key Dependencies

```txt
Flask==3.0.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.1.1
SQLAlchemy==2.0.23
python-dotenv==1.0.0
PyJWT==2.8.0
bcrypt==4.1.2
numpy==2.0.2
google-generativeai==0.3.1
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- npm or yarn
- pip

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to client-server directory
cd client-server

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m app.app
```

### Database Setup

```bash
# Load initial dataset
cd client-server/maintenance
python load_dataset_simple.py

# Create admin user
python create_admin.py
```

---

## 🔑 Environment Variables

### Frontend (`.env` in `client/`)

```env
# Weather API
VITE_WEATHER_API_KEY=your_openweathermap_key

# Currency API
VITE_CURRENCY_API_KEY=your_exchangerate_key

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Cohere AI
VITE_COHERE_API_KEY=your_cohere_key

# Social Media
VITE_FACEBOOK_URL=https://facebook.com/roamiowanderly
VITE_INSTAGRAM_URL=https://instagram.com/roamiowanderly
```

### Backend (`.env` in `client-server/`)

```env
# Clerk API
CLERK_API_KEY=your_clerk_secret_key

# Gmail SMTP
GMAIL_USER=wanderlyroamio@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Cohere AI (optional - used by backend if needed)
COHERE_API_KEY=your_cohere_key

# JWT Secret
JWT_SECRET_KEY=your_secret_key
```

---
## 🎯 Key Features Summary

### Frontend Features
✅ Dark/Light theme switching
✅ Responsive design (mobile-first)
✅ Search with modal interface
✅ AI-powered recommendations
✅ Interactive maps (Leaflet)
✅ User authentication (Clerk)
✅ Wishlist management
✅ Review system with images
✅ Itinerary planning
✅ Newsletter subscription
✅ Multi-language support ready
✅ Admin panel

### Backend Features
✅ RESTful API architecture
✅ JWT authentication
✅ Email integration (Gmail)
✅ AI recommendation engine
✅ Image upload handling
✅ Database migrations
✅ CORS enabled
✅ Error handling
✅ Logging system
✅ Admin dashboard API
✅ Search functionality
✅ Similar places algorithm

---

## 📊 Data Flow

```
User Request → Frontend (React)
    ↓
API Call (Axios)
    ↓
Backend (Flask) → Route Handler
    ↓
Database Query (SQLAlchemy)
    ↓
SQLite Database
    ↓
Response (JSON)
    ↓
Frontend Update (React State)
    ↓
UI Render
```

---

## 🔒 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection
- Input validation
- Secure file uploads
- Environment variable protection

---

## 📝 Development Notes

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd client-server
python -m app.app
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:5173/admin/login

---

## 🐛 Troubleshooting

### Common Issues

**1. Module Not Found (Backend)**
```bash
pip install -r requirements.txt
```

**2. Database Locked**
```bash
# Close all connections and restart server
```

**3. CORS Errors**
- Check backend CORS configuration
- Verify frontend is running on port 5173

**4. Email Not Sending**
- Verify Gmail app password
- Check .env configuration
- Enable "Less secure app access" in Gmail

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)

---

## 👥 Team

**Roamio Wanderly Development Team**

---

## 📄 License

All rights reserved © 2026 Roamio Wanderly

---

**Last Updated:** February 11, 2026
