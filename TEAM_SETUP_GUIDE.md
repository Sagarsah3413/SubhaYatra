# Team Setup Guide - Tourism Recommendation System

## 🚀 Quick Start for Team Members

This guide will help you set up the project on your local machine without destroying the database or backend.

---

## ⚠️ IMPORTANT: What NOT to Do

**DO NOT:**
- ❌ Delete the `.gitignore` file
- ❌ Commit `.env` files
- ❌ Commit `tourism.db` database file
- ❌ Commit `node_modules/` folders
- ❌ Commit `__pycache__/` folders
- ❌ Use `git pull` without reading this guide first

---

## 📋 Prerequisites

Make sure you have these installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)

---

## 🔧 Step-by-Step Setup

### Step 1: Clone or Pull the Repository

#### If you're setting up for the FIRST TIME:
```bash
git clone https://github.com/Sakshi17-singh/Tourism_Recommendation_System.git
cd Tourism_Recommendation_System
```

#### If you ALREADY have the project:
```bash
cd Tourism_Recommendation_System

# Save your local changes (if any)
git stash

# Pull the latest changes
git pull origin main

# Restore your local changes (if needed)
git stash pop
```

---

### Step 2: Set Up Environment Variables

#### Frontend (.env file)

1. Go to `client/` folder
2. Copy the example file:
   ```bash
   cd client
   cp .env.example .env
   ```
3. Open `client/.env` and add your Clerk keys:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   VITE_API_URL=http://localhost:8000
   ```

**Where to get Clerk keys:**
- Go to [Clerk Dashboard](https://dashboard.clerk.com/)
- Select your project (or create one)
- Go to "API Keys"
- Copy the "Publishable Key"

#### Backend (.env file)

1. Go to `client-server/` folder
2. Copy the example file:
   ```bash
   cd ../client-server
   cp .env.example .env
   ```
3. Open `client-server/.env` and add your keys:
   ```
   CLERK_API_KEY=sk_test_your_actual_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**Where to get keys:**
- **Clerk Secret Key:** [Clerk Dashboard](https://dashboard.clerk.com/) → API Keys → Secret Keys
- **Cloudinary:** [Cloudinary Console](https://cloudinary.com/console) → Dashboard

---

### Step 3: Install Dependencies

#### Frontend Dependencies
```bash
cd client
npm install
```

#### Backend Dependencies
```bash
cd ../client-server

# Create virtual environment (recommended)
python -m venv env

# Activate virtual environment
# On Windows:
env\Scripts\activate
# On Mac/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### Step 4: Set Up the Database

The database will be created automatically when you first run the backend!

**IMPORTANT:** Each team member will have their own local database. This is NORMAL and CORRECT.

#### Create Initial Admin User
```bash
cd client-server
python create_admin.py
```

Follow the prompts to create your admin account.

---

### Step 5: Run the Application

#### Terminal 1 - Backend Server
```bash
cd client-server

# Activate virtual environment (if not already active)
env\Scripts\activate  # Windows
# source env/bin/activate  # Mac/Linux

# Run the server
python -m app
```

You should see:
```
🚀 Starting Tourism Recommendation System Backend Server...
📍 Server running at: http://localhost:8000
```

#### Terminal 2 - Frontend Server
```bash
cd client

# Run the development server
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🔄 Daily Workflow (Pulling Updates)

### Before You Start Working:

```bash
# 1. Make sure you're on the main branch
git checkout main

# 2. Save any uncommitted changes
git stash

# 3. Pull the latest changes
git pull origin main

# 4. Restore your changes (if you had any)
git stash pop

# 5. Update dependencies (if package.json or requirements.txt changed)
cd client && npm install
cd ../client-server && pip install -r requirements.txt
```

### After You Finish Working:

```bash
# 1. Check what files changed
git status

# 2. Add your changes (NEVER add .env or .db files!)
git add .

# 3. Commit with a clear message
git commit -m "feat: describe what you did"

# 4. Push to GitHub
git push origin main
```

---

## 🛡️ Protecting Your Database

### Why the database keeps getting deleted:

The database file (`tourism.db`) is **NOT tracked by Git** (it's in `.gitignore`). This is CORRECT because:
- Each team member should have their own local database
- Database files can be large and cause conflicts
- Sensitive data shouldn't be in Git

### Solution:

**Each team member maintains their own local database:**
1. When you first set up, the database is created automatically
2. You add your own test data
3. You create your own admin account
4. Your database stays on YOUR computer only

**To share database structure (not data):**
- We use migration scripts (already in the repo)
- These scripts create the tables and structure
- Each person runs them on their own database

---

## 🐛 Common Issues and Solutions

### Issue 1: "Module not found" errors
**Solution:**
```bash
# Frontend
cd client
npm install

# Backend
cd client-server
pip install -r requirements.txt
```

### Issue 2: "Port already in use"
**Solution:**
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### Issue 3: "Database is locked"
**Solution:**
- Close the backend server
- Wait 5 seconds
- Restart the backend server

### Issue 4: "Clerk authentication not working"
**Solution:**
- Check your `.env` files have the correct keys
- Make sure you're using the SAME Clerk project
- Verify keys are not expired

### Issue 5: "Git pull conflicts"
**Solution:**
```bash
# Save your changes
git stash

# Pull updates
git pull origin main

# Restore your changes
git stash pop

# If conflicts occur, resolve them manually
```

---

## 📁 Project Structure

```
Tourism_Recommendation_System/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   ├── .env                  # ❌ NOT in Git (you create this)
│   ├── .env.example          # ✅ Template in Git
│   └── package.json
│
├── client-server/            # Backend (Python + Flask)
│   ├── app/
│   ├── .env                  # ❌ NOT in Git (you create this)
│   ├── .env.example          # ✅ Template in Git
│   ├── tourism.db            # ❌ NOT in Git (auto-created)
│   └── requirements.txt
│
├── .gitignore                # Tells Git what NOT to track
└── TEAM_SETUP_GUIDE.md       # This file!
```

---

## 🔑 Environment Variables Checklist

Before running the app, make sure you have:

**Frontend (`client/.env`):**
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` - From Clerk Dashboard
- [ ] `VITE_API_URL` - Should be `http://localhost:8000`

**Backend (`client-server/.env`):**
- [ ] `CLERK_API_KEY` - From Clerk Dashboard (Secret Key)
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary Console
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary Console
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary Console

---

## 🤝 Team Collaboration Best Practices

### DO:
✅ Pull before you start working
✅ Commit often with clear messages
✅ Test your changes before pushing
✅ Communicate with team about major changes
✅ Use meaningful branch names (if using branches)

### DON'T:
❌ Commit `.env` files
❌ Commit database files
❌ Commit `node_modules/` or `__pycache__/`
❌ Force push without team agreement
❌ Work directly on main without pulling first

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide first
2. Check the "Common Issues" section
3. Ask in the team chat
4. Check the error message carefully

---

## 🎉 You're All Set!

Once you complete all steps:
1. Backend should be running on `http://localhost:8000`
2. Frontend should be running on `http://localhost:5173`
3. You should be able to sign in with Clerk
4. Admin panel should work with your admin account

**Happy Coding! 🚀**
