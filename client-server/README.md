# Tourism Recommendation System - Backend

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Server
```bash
python run_server.py
```

Server will start at: `http://localhost:8000`

---

## 🔐 Admin Panel Access

### Create Admin User
```bash
python fix_admin_login.py
```

This will create an admin user with:
- **Username:** `admin`
- **Password:** `admin123`

### Login
Go to: `http://localhost:5173/admin/login`

---

## 📁 Essential Files

- **`run_server.py`** - Start the backend server
- **`fix_admin_login.py`** - Create/reset admin user
- **`load_csv_data.py`** - Load initial data from CSV
- **`requirements.txt`** - Python dependencies
- **`app/`** - Main application code
- **`datasets/`** - Images and data files
- **`instance/`** - Database files

---

## 🗄️ Database

- **Location:** `instance/tourism.db`
- **Type:** SQLite
- **Tables:** places, hotels, restaurants, admin, users, etc.

---

## 📸 Uploaded Images

User-submitted place images are stored in:
```
datasets/uploads/
```

---

## 🛠️ Troubleshooting

### Server won't start
- Check if port 8000 is available
- Install dependencies: `pip install -r requirements.txt`

### Can't login to admin
- Run: `python fix_admin_login.py`
- Use credentials: `admin` / `admin123`

### No data showing
- Run: `python load_csv_data.py`
- Check database exists: `instance/tourism.db`

---

## 📞 API Endpoints

- `GET /api/places` - Get all places
- `POST /api/places` - Create new place
- `GET /api/hotels` - Get all hotels
- `GET /api/restaurants` - Get all restaurants
- `GET /api/search` - Search places/hotels/restaurants
- `POST /admin/login` - Admin login

---

**Backend is ready! Start with `python run_server.py`** 🚀
