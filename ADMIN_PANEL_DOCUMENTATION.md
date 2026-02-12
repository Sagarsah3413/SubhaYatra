# Admin Panel Documentation

## Overview
Your project includes a comprehensive admin panel with JWT-based authentication, dashboard statistics, and review management capabilities. The admin panel provides secure access to manage user-generated content and monitor platform activity.

---

## 🔐 Authentication System

### JWT Token-Based Authentication
The admin panel uses JSON Web Tokens (JWT) for secure authentication:

- **Access Token**: Valid for 24 hours, used for API requests
- **Refresh Token**: Valid for 30 days, used to get new access tokens
- **Token Blacklist**: Tokens are blacklisted on logout for security
- **Password Hashing**: Uses `pbkdf2:sha256` for secure password storage

### Security Features
- All admin routes are protected with `@admin_required` decorator
- Passwords are automatically upgraded from plain text to hashed on first login
- Token format: `Bearer <token>` in Authorization header
- Role-based access control (admin vs user)

---

## 🚀 Getting Started

### 1. Create Admin User

Run the admin creation script:

```bash
cd client-server
python create_admin.py
```

**Interactive Options:**
- Use default credentials (username: `admin`, password: `admin123`)
- Or create custom credentials

**Example Output:**
```
==================================================
Admin User Creation Script
==================================================

Use custom credentials? (yes/no, default: no): yes
Enter username (default: admin): myadmin
Enter password (default: admin123): MySecurePass123

Creating admin user with:
  Username: myadmin
  Password: MySecurePass123

✅ Admin user created successfully!
   Username: myadmin
   Password: MySecurePass123

==================================================
You can now login to the admin panel at:
http://localhost:5173/admin/login
==================================================
```

### 2. Update Existing Admin Password

If admin already exists, the script will prompt:
```
⚠️  Admin user 'admin' already exists!
Do you want to update the password? (yes/no): yes
✅ Admin password updated successfully!
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "message": "Admin login successful",
  "admin_id": 1,
  "username": "admin",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "login_time": "2026-02-12T10:30:00"
}
```

**Error Responses:**
- `400`: Missing username or password
- `401`: Invalid credentials

#### 2. Refresh Access Token
```http
POST /admin/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

#### 3. Admin Logout
```http
POST /admin/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

#### 4. Register New Admin (Protected)
```http
POST /admin/register
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "newadmin",
  "password": "SecurePass123"
}
```

**Requirements:**
- Must be authenticated as existing admin
- Password must be at least 8 characters
- Username must be unique

**Response (201 Created):**
```json
{
  "message": "Admin registered successfully",
  "admin_id": 2,
  "username": "newadmin"
}
```

---

### Dashboard Endpoints (All Protected)

#### 1. Main Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_places": 1057,
  "total_events": 0,
  "total_hotels": 460,
  "total_restaurants": 194,
  "total_bookings": 15,
  "total_users": 42,
  "new_users_this_month": 8,
  "bookings_by_location": [
    {"location": "Kathmandu", "count": 5},
    {"location": "Pokhara", "count": 3},
    {"location": "Chitwan", "count": 2}
  ]
}
```

#### 2. Total User Count
```http
GET /admin/dashboard/user-count
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "totalUsers": 42
}
```

#### 3. New Users This Month
```http
GET /admin/dashboard/new-users
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "newUsersThisMonth": 8
}
```

#### 4. Total Bookings
```http
GET /admin/dashboard/total-bookings
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "totalBookings": 15
}
```

#### 5. Bookings Per Location
```http
GET /admin/dashboard/bookings-per-location
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {"location": "Kathmandu", "count": 5},
  {"location": "Pokhara", "count": 3},
  {"location": "Chitwan", "count": 2}
]
```

---

### Review Management Endpoints (All Protected)

#### 1. Get All Reviews
```http
GET /admin/reviews?status=pending&page=1&per_page=20
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status`: Filter by status (`pending`, `approved`, `rejected`, `all`)
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20)

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "place": "Kathmandu Durbar Square",
      "visit_date": "2026-01-15",
      "type": "Cultural",
      "rating": 5,
      "review": "Amazing historical site with beautiful architecture...",
      "recommend": "yes",
      "images": ["/uploads/reviews/image1.jpg"],
      "status": "pending",
      "created_at": "2026-02-10T14:30:00",
      "approved_at": null,
      "admin_notes": null
    }
  ],
  "total": 45,
  "page": 1,
  "per_page": 20,
  "total_pages": 3
}
```

#### 2. Get Review Statistics
```http
GET /admin/dashboard/review-stats
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_reviews": 45,
  "pending_reviews": 12,
  "approved_reviews": 30,
  "rejected_reviews": 3,
  "average_rating": 4.5,
  "recent_reviews": [
    {
      "id": 45,
      "name": "Jane Smith",
      "place": "Pokhara",
      "rating": 5,
      "status": "pending",
      "created_at": "2026-02-12T09:15:00"
    }
  ]
}
```

#### 3. Approve Review
```http
POST /admin/reviews/1/approve
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "admin_notes": "Great review, approved for display"
}
```

**Response (200 OK):**
```json
{
  "message": "Review approved successfully",
  "review_id": 1
}
```

#### 4. Reject Review
```http
POST /admin/reviews/1/reject
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "admin_notes": "Contains inappropriate content"
}
```

**Response (200 OK):**
```json
{
  "message": "Review rejected successfully",
  "review_id": 1
}
```

#### 5. Delete Review
```http
DELETE /admin/reviews/1
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Review deleted successfully"
}
```

**Note:** Deleting a review also removes associated images from the server.

---

## 🗄️ Database Models

### Admin Model
```python
class Admin(Base):
    id: Integer (Primary Key)
    username: String (Unique, Not Null)
    password: String (Hashed, Not Null)
```

### Review Model
```python
class Review(Base):
    id: Integer (Primary Key)
    name: String (Not Null)
    email: String (Not Null)
    place: String (Not Null)
    visit_date: String
    type: String (Not Null)  # Nature, Cultural, Adventure, City, Relaxation
    rating: Integer (Not Null, 1-5)
    review: Text (Not Null)
    recommend: String (Default: "yes")  # yes or no
    images: Text  # JSON string of image paths
    status: String (Default: "pending")  # pending, approved, rejected
    created_at: DateTime
    approved_at: DateTime
    admin_notes: Text
```

### Booking Model
```python
class Booking(Base):
    id: Integer (Primary Key)
    user_id: String (Not Null)
    user_name: String
    user_email: String
    place_name: String (Not Null)
    place_location: String
    booking_date: DateTime
    travel_date: DateTime
    number_of_people: Integer (Default: 1)
    total_price: String
    status: String (Default: "confirmed")  # confirmed, cancelled, completed
    special_requests: Text
    created_at: DateTime
```

---

## 🔧 Configuration

### Environment Variables

Add to `client-server/.env`:

```env
# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production

# Clerk API (for user management)
CLERK_API_KEY=your-clerk-api-key
```

**Important:** Change `JWT_SECRET_KEY` in production to a strong random string!

### Token Expiration Settings

In `client-server/app/auth.py`:

```python
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Access token: 24 hours
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh token: 30 days
```

---

## 🛡️ Security Best Practices

### 1. Password Requirements
- Minimum 8 characters
- Automatically hashed using `pbkdf2:sha256`
- Legacy plain passwords auto-upgraded on login

### 2. Token Management
- Store tokens securely (localStorage or httpOnly cookies)
- Include token in Authorization header: `Bearer <token>`
- Refresh tokens before expiration
- Blacklist tokens on logout

### 3. Admin Registration
- Only existing admins can create new admins
- Prevents unauthorized admin creation
- Use strong passwords for all admin accounts

### 4. Production Recommendations
- Change `JWT_SECRET_KEY` to a strong random value
- Use HTTPS for all API requests
- Implement rate limiting on login endpoint
- Use Redis for token blacklist (instead of in-memory set)
- Enable CORS only for trusted domains
- Add IP whitelisting for admin routes

---

## 📊 Features Summary

### ✅ Implemented Features

1. **Authentication**
   - JWT-based login/logout
   - Token refresh mechanism
   - Password hashing
   - Role-based access control

2. **Dashboard**
   - Total places, hotels, restaurants, events
   - Total bookings and users
   - New users this month
   - Bookings by location

3. **Review Management**
   - View all reviews with filtering
   - Approve/reject reviews
   - Delete reviews (with image cleanup)
   - Review statistics
   - Admin notes on reviews

4. **User Management**
   - Integration with Clerk API
   - User count tracking
   - New user monitoring

---

## 🧪 Testing the Admin Panel

### 1. Create Admin User
```bash
cd client-server
python create_admin.py
```

### 2. Start Backend Server
```bash
cd client-server
python -m app
```

### 3. Test Login with cURL
```bash
curl -X POST http://localhost:8000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 4. Test Dashboard (with token)
```bash
curl -X GET http://localhost:8000/admin/dashboard \
  -H "Authorization: Bearer <your_access_token>"
```

### 5. Test Review Management
```bash
# Get all pending reviews
curl -X GET "http://localhost:8000/admin/reviews?status=pending" \
  -H "Authorization: Bearer <your_access_token>"

# Approve a review
curl -X POST http://localhost:8000/admin/reviews/1/approve \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{"admin_notes":"Approved"}'
```

---

## 🔍 Troubleshooting

### Issue: "Invalid credentials" on login
- Verify username and password are correct
- Check if admin user exists in database
- Run `create_admin.py` to create/update admin

### Issue: "Invalid or expired token"
- Token may have expired (24 hours for access token)
- Use refresh token to get new access token
- Re-login if refresh token also expired

### Issue: "Admin privileges required"
- Ensure you're using admin token (not user token)
- Check token role in JWT payload
- Verify `@admin_required` decorator is working

### Issue: Clerk API errors
- Verify `CLERK_API_KEY` is set in `.env`
- Check Clerk API key is valid
- User statistics will show 0 if Clerk is not configured

---

## 📝 Frontend Integration

### Example: Admin Login Component

```javascript
const adminLogin = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store tokens
      localStorage.setItem('admin_access_token', data.access_token);
      localStorage.setItem('admin_refresh_token', data.refresh_token);
      
      // Redirect to dashboard
      window.location.href = '/admin/dashboard';
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Example: Protected API Request

```javascript
const fetchDashboard = async () => {
  const token = localStorage.getItem('admin_access_token');

  try {
    const response = await fetch('http://localhost:8000/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token expired, try refresh
      await refreshToken();
      return fetchDashboard(); // Retry
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Dashboard error:', error);
  }
};
```

### Example: Token Refresh

```javascript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('admin_refresh_token');

  try {
    const response = await fetch('http://localhost:8000/admin/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('admin_access_token', data.access_token);
    } else {
      // Refresh token expired, redirect to login
      window.location.href = '/admin/login';
    }
  } catch (error) {
    console.error('Refresh error:', error);
  }
};
```

---

## 📚 Additional Resources

### Files to Reference
- `client-server/app/routes/admin.py` - All admin endpoints
- `client-server/app/auth.py` - Authentication logic
- `client-server/app/models.py` - Database models
- `client-server/create_admin.py` - Admin creation script

### Database Location
- `client-server/app/instance/tourism.db` - Main database

### API Base URL
- Development: `http://localhost:8000`
- Production: Update in frontend configuration

---

## ✨ Summary

Your admin panel provides:
- ✅ Secure JWT authentication
- ✅ Comprehensive dashboard statistics
- ✅ Review moderation system
- ✅ User management integration
- ✅ Booking tracking
- ✅ Protected API endpoints
- ✅ Token refresh mechanism
- ✅ Password hashing and security

The system is production-ready with proper security measures, just remember to update the `JWT_SECRET_KEY` and enable HTTPS in production!
