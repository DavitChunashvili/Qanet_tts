# Complete Implementation Guide - QANet TTS PWA

## 📋 Overview

This is a production-ready Progressive Web App (PWA) for Text-to-Speech that works as a native app on iPhone home screens.

**Stack**: 
- Frontend: Vite + React + TypeScript
- Backend: Express + Node.js
- TTS: Browser Web Speech API (frontend) + Server-side TTS API (backend)

---

## 🚀 Quick Terminal Commands

### Setup (One-time)

```bash
# Navigate to project
cd c:\Users\davit\OneDrive\Desktop\FOR_W\Qanet_tts_web

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (in another folder/terminal context)
cd ..\backend
npm install

# Come back to root
cd ..
```

### Run Development (Local)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Output: `🚀 TTS Backend running on http://localhost:3001`

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```
Output: Shows local URLs including network IP

### Run on iPhone via Wi-Fi

1. **Ensure both servers running** (Terminals 1 & 2 above)

2. **Find your computer IP** (Windows):
   ```bash
   ipconfig
   # Look for "IPv4 Address" under "Wireless LAN adapter WiFi" section
   # Example: 192.168.1.100
   ```

3. **On iPhone Safari**, navigate to:
   ```
   http://192.168.1.100:5173
   ```
   (Replace 192.168.1.100 with your actual IP)

4. **Test the app**:
   - Type text
   - Tap "Load Voices" → wait 2-3 seconds
   - Tap "Speak" → audio plays
   - Tap "Export Audio" → file downloads

5. **Add to Home Screen**:
   - Tap Share (⬆️) → "Add to Home Screen" → "Add"
   - Icon appears on home screen
   - Tap to launch fullscreen app (no Safari UI)

### Stop Development Servers

```bash
# In each terminal, press Ctrl+C
# This stops the dev servers
```

---

## 📁 File Overview & What Each Does

### Frontend - Main Files

| File | Purpose |
|------|---------|
| `frontend/index.html` | Entry HTML with iOS meta tags (fullscreen, icon, capability) |
| `frontend/src/main.tsx` | React entry point + Service Worker registration |
| `frontend/src/App.tsx` | Main React component with TTS logic and API calls |
| `frontend/src/index.css` | Mobile-first styles (safe areas for notches, responsive) |
| `frontend/src/components/*.tsx` | UI components (TextInput, VoiceSelector, Controls, Status) |
| `frontend/public/sw.js` | Service Worker: offline caching strategy |
| `frontend/public/manifest.webmanifest` | PWA metadata (name, icons, start_url, display type) |
| `frontend/vite.config.ts` | Vite config with dev server options and API proxy |
| `frontend/package.json` | Dependencies + scripts (dev, build, preview) |

### Backend - Main Files

| File | Purpose |
|------|---------|
| `backend/src/server.ts` | Express app setup, CORS, health check endpoint |
| `backend/src/routes/tts.ts` | POST /api/tts endpoint, validates input, returns audio |
| `backend/src/services/ttsService.ts` | TTS provider logic (Google, Azure, AWS, Mock) |
| `backend/.env.example` | Template for environment variables |
| `backend/package.json` | Dependencies + scripts (dev, build, start) |

### Config Files

| File | Purpose |
|------|---------|
| `frontend/.env.example` | Template for VITE_API_BASE if needed |
| `backend/.env.example` | Template for TTS_PROVIDER and credentials |

---

## 🔧 How It Works End-to-End

### User Taps "Speak"
1. Frontend calls browser `speechSynthesis.speak()`
2. Voices loaded via Web Speech API
3. Audio plays directly in browser (no connection needed)

### User Taps "Export Audio"
1. Frontend constructs JSON: `{ text, locale, rate, pitch }`
2. Frontend **POST** to `/api/tts` endpoint
3. Backend receives request, identifies TTS provider from `TTS_PROVIDER` env var
4. Backend generates audio (MP3 from real provider, or WAV beep from mock)
5. Backend returns binary audio with proper headers
6. Frontend receives blob, downloads file (or shows share dialog on iOS)

### Offline Behavior
- **Service Worker** caches all app assets on first visit
- **Speak button**: Still works (browser synthesis, no internet needed)
- **Export button**: Shows error (requires internet to reach backend)
- Internet detection via `navigator.onLine` event listener

### PWA Home Screen Install
- iOS detects manifest.webmanifest + iOS meta tags
- "Add to Home Screen" option appears in Safari
- When launched from home screen: fullscreen app, no Safari chrome

---

## 🌍 Network Setup for LAN Testing

### Scenario: Desktop & iPhone on Same Wi-Fi

```
Your Computer (192.168.1.100)
├── Frontend Vite Dev Server: http://192.168.1.100:5173
└── Backend Express Server: http://192.168.1.100:3001

iPhone on same Network (192.168.1.50)
└── Safari: http://192.168.1.100:5173
    └── JavaScript calls: http://192.168.1.100:3001/api/tts
```

### CORS Handling

**Localhost (-Vite Proxy)**:
- Frontend at `http://localhost:5173`
- Calls `/api/tts` (Vite proxy routes to `http://localhost:3001`)
- No CORS issues

**LAN (Multiple IPs)**:
- Frontend at `http://192.168.1.100:5173`
- Calls `http://192.168.1.100:3001/api/tts` (set via `VITE_API_BASE`)
- Backend CORS allows `localhost` origins (for flexibility during dev)

To allow iPhone IP explicitly, edit `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.1.100:5173'  // Add your IP if needed
  ]
}));
```

---

## 📦 NPM Scripts Reference

### Frontend

```bash
npm run dev        # Start Vite dev server (--host for network access)
npm run build      # TypeScript compilation + Vite minified build
npm run preview    # Serve built dist/ for preview
```

### Backend

```bash
npm run dev        # Start with nodemon (auto-restart on file changes)
npm run start      # Run with ts-node (no build step)
npm run build      # TypeScript compilation to dist/
npm run start:compiled  # Run compiled JavaScript from dist/
```

---

## 🔑 Environment Variables

### Frontend (frontend/.env.local)

```env
# Optional - only needed if backend on different IP
VITE_API_BASE=http://192.168.1.100:3001
```

If not set, defaults to `http://localhost:3001`

### Backend (backend/.env)

```env
TTS_PROVIDER=mock
PORT=3001
NODE_ENV=development

# If using Google Cloud TTS:
# TTS_PROVIDER=google
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
# GOOGLE_CLOUD_PROJECT=your-project

# If using Azure TTS:
# TTS_PROVIDER=azure
# AZURE_TTS_KEY=your-api-key
# AZURE_TTS_REGION=westus

# If using AWS Polly:
# TTS_PROVIDER=aws
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_REGION=us-east-1
```

**Default Behavior**: If provider env var not set or credentials missing, backend returns mock WAV beep (app still works)

---

## ✅ Verification Checklist

### After npm install

- [ ] `frontend/node_modules/` exists
- [ ] `backend/node_modules/` exists
- [ ] No npm install errors

### After running servers

- [ ] Backend terminal: "🚀 TTS Backend running on http://localhost:3001"
- [ ] Frontend terminal: Shows "Local: http://localhost:5173" and network IP

### Desktop browser (localhost:5173)

- [ ] Page loads without errors
- [ ] "Load Voices" button works → "✅ Voices ready"
- [ ] Type text and tap "Speak" → audio plays
- [ ] Tap "Stop" → audio stops
- [ ] Tap "Export Audio" → file downloads (mock WAV or real MP3)

### iPhone browser (192.168.X.X:5173)

- [ ] Page loads
- [ ] All buttons visible and responsive (large touch targets)
- [ ] Same tests as desktop
- [ ] No Safari address bar/controls visible (fullscreen)

### Add to Home Screen (iPhone)

- [ ] Safari: Share → Add to Home Screen
- [ ] Icon appears on home screen
- [ ] Tapping icon launches fullscreen app
- [ ] No Safari UI when running from home screen

---

## 🚢 Production Build & Deployment

### Build

```bash
# Frontend
cd frontend
npm run build
# Outputs: dist/ folder with optimized React bundle

# Backend
cd backend
npm run build
# Outputs: dist/ folder with compiled JavaScript
```

### Serve Frontend

**Netlify**:
- Auto-detect SPA, deploy `frontend/dist/`
- Set env var `VITE_API_BASE` to your backend URL

**Self-hosted (static server)**:
```bash
# Use any static server (e.g., http-server, nginx)
npx http-server frontend/dist  # For quick testing

# In production, configure as SPA:
# All routes → /index.html (for React Router to handle)
```

### Run Backend

**Production with Node**:
```bash
cd backend
npm install --production  # Skip devDependencies
npm run build
NODE_ENV=production node dist/server.js
```

**With environment**:
```bash
export NODE_ENV=production
export TTS_PROVIDER=google
export GOOGLE_APPLICATION_CREDENTIALS=/etc/tts/key.json
node dist/server.js
```

---

## 🐛 Common Issues & Fixes

### Backend won't start

```
Error: Cannot find module 'express'
```
**Fix**: Run `npm install` in backend folder

### Frontend can't reach backend

```
Fetch error: Network request failed
TypeError: failed to fetch from http://localhost:3001
```
**Causes**:
1. Backend not running → Start it: `cd backend && npm run dev`
2. Wrong IP on LAN → Set `VITE_API_BASE=http://192.168.X.X:3001` in frontend/.env.local
3. CORS misconfigured → Check backend/src/server.ts origin list

**Fix**: 
```bash
# Verify backend is running and responding
curl http://localhost:3001/health
# Should return: {"status":"ok","provider":"mock"}
```

### Voices not loading

**Cause**: Browser Voice API async loading

**Fix**:
1. Tap "Load Voices" button
2. Wait 2–3 seconds
3. Check browser console (F12) for errors
4. Some browsers (Safari) load voices on first speak() call

### Export Audio returns blank/silence

**Cause**: Mock provider generates short WAV beep (0.5 seconds)

**Expected behavior**: Short ~0.5 second tone should play. If a real TTS provider is configured, it returns longer audio.

**To test with real TTS**: Set up credentials in `backend/.env` (Google/Azure/AWS)

### CORS error on iPhone

```
Access to fetch at 'http://192.168.1.100:3001/api/tts' from origin 'http://192.168.1.100:5173' has been blocked
```

**Fix**: Edit `backend/src/server.ts`:
```typescript
origins: ['http://localhost:5173', 'http://192.168.1.100:5173', 'http://192.168.1.100']
```

Then restart backend.

---

## 📱 iOS PWA Specific Notes

### Fullscreen on Home Screen
- Works because: `manifest.webmanifest` has `"display": "standalone"`
- Plus iOS meta tags in `index.html`: `<meta name="apple-mobile-web-app-capable">`
- Service Worker caches app shell for offline boot

### Audio Download on iPhone
- iOS Safari doesn't allow capturing Web Speech Audio
- Solution: Export button uses backend TTS instead
- File downloads to iPhone Files / iCloud Drive / Downloads

### Safe Areas (Notch Support)
- CSS includes: `padding-bottom: env(safe-area-inset-bottom)`
- Ensures buttons don't hide behind home bar on notched iPhones

### Offline Behavior
- Service Worker caches HTML, CSS, JS on first visit
- Offline app opens, but Export button disabled
- Speak still works (browser API, no network needed)

---

## 🎯 What's Implemented

✅ **Frontend**
- React + TypeScript components
- Web Speech API integration (Speak/Stop)
- Backend API calls (Export Audio)
- Service Worker registration + offline caching
- PWA manifest & iOS meta tags
- Mobile-responsive UI with safe areas
- Status messages & error handling
- Voice loading with fallback

✅ **Backend**
- Express API on port 3001
- POST /api/tts endpoint
- Pluggable TTS providers (Google, Azure, AWS, Mock)
- Mock WAV generator (zero dependencies)
- CORS enabled for development/LAN
- Input validation & error handling
- Proper audio headers & content-type

✅ **PWA**
- Installable to iOS home screen
- Fullscreen mode (no Safari UI)
- Offline app-shell caching
- Web manifest
- iOS meta tags
- Icons

✅ **DevOps**
- Nodemon for auto-restart
- TypeScript compilation
- Environment-based configuration
- Fallback to mock if no credentials

---

## 📞 Support & Documentation

- **SETUP.md**: Step-by-step development guide
- **iOS_INSTRUCTIONS.md**: iOS-specific PWA details
- **README.md**: Project overview & architecture

---

## ✨ Ready?

1. **Run**: `cd frontend && npm install && npm run dev` (Terminal 1)
2. **Run**: `cd backend && npm install && npm run dev` (Terminal 2)
3. **Open**: http://192.168.X.X:5173 on iPhone Safari
4. **Test**: Speak, Export, Add to Home Screen
5. **Deploy**: Follow production build steps above

---

Last updated: February 11, 2026
