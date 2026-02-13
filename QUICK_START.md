# ⚡ Quick Start - For Team Members

## First Time Setup (5 minutes)

```bash
# 1. Clone the repo
git clone https://github.com/Sakshi17-singh/Tourism_Recommendation_System.git
cd Tourism_Recommendation_System

# 2. Set up Frontend
cd client
cp .env.example .env
# Edit .env and add your Clerk keys
npm install

# 3. Set up Backend
cd ../client-server
cp .env.example .env
# Edit .env and add your Clerk + Cloudinary keys
python -m venv env
env\Scripts\activate  # Windows
pip install -r requirements.txt
python create_admin.py

# 4. Run the app
# Terminal 1:
cd client-server
env\Scripts\activate
python -m app

# Terminal 2:
cd client
npm run dev
```

## Daily Workflow

### Before Starting Work:
```bash
git pull origin main
```

### After Finishing Work:
```bash
git add .
git commit -m "your message"
git push origin main
```

## Important URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Clerk Dashboard: https://dashboard.clerk.com/
- Cloudinary: https://cloudinary.com/console

## Need Help?
Read the full guide: `TEAM_SETUP_GUIDE.md`
