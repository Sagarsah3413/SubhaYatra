# Quick Start Guide - Tourism Recommendation System

## Start Backend Server

Open a terminal and run:

```bash
cd client-server
.\env\Scripts\activate.ps1
python -m app
```

You should see:
```
🚀 Starting Tourism Recommendation System Backend Server...
📍 Server running at: http://localhost:8000
🌐 CORS enabled for frontend at: http://localhost:5173
📊 Database: SQLite (tourism.db)
==================================================
```

**Keep this terminal open!**

## Start Frontend Server

Open a NEW terminal and run:

```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Keep this terminal open too!**

## Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Test Recommendation Feature

1. Click "Get Recommendations" or navigate to `/recommendation`
2. Fill out the form:
   - Name: Your name
   - Age: Select your age
   - Phone: Enter phone number
   - Travellers: Number of people
   - Trip Duration: Select duration
   - Travel Month: Select month
   - Trip Types: Select 1-2 types
3. Click "Get My Recommendations"
4. You should see personalized recommendations!

## Troubleshooting

### Backend won't start
- Make sure you're in the `client-server` directory
- Activate virtual environment first: `.\env\Scripts\activate.ps1`
- Check if port 8000 is already in use

### Frontend won't start
- Make sure you're in the `client` directory
- Run `npm install` if you haven't already
- Check if port 5173 is already in use

### Recommendation API Error
- Make sure BOTH servers are running
- Check backend terminal for errors
- Check browser console (F12) for errors
- See `RECOMMENDATION_API_FIX.md` for detailed troubleshooting

## Stop Servers

To stop either server, press `Ctrl+C` in the terminal.

## Database Info

- Location: `client-server/tourism.db`
- Places: 1057
- Events: 805
- Hotels, Restaurants, Reviews, etc.

## Important Notes

- Always activate virtual environment before running backend
- Keep both terminals open while using the app
- Don't close the terminals or the servers will stop
- If you get database errors, see `RECOMMENDATION_API_FIX.md`
