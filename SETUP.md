# QANet TTS PWA - Setup & Development Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (in a new terminal)
cd backend
npm install
```

### 2. Run Development Servers

**Terminal 1 - Backend (port 3001):**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 TTS Backend running on http://localhost:3001
📡 Provider: mock
```

**Terminal 2 - Frontend (port 5173):**
```bash
cd frontend
npm run dev
```

Expected output:
```
  Local:    http://localhost:5173/
  Network:  http://192.168.X.X:5173/
```

### 3. Test in Browser

- **Desktop**: Open http://localhost:5173 in Chrome/Firefox
- **iOS on same network**: Open `http://192.168.X.X:5173` (replace X.X with your computer's IP)

---

## 🌐 Testing on iPhone/iPad

### Prerequisites
- iPhone/iPad on same Wi-Fi network as your development machine
- Your computer's IP address (find it: Windows: `ipconfig`, Mac/Linux: `ifconfig`)

### Steps

1. **Start both dev servers** (as above)

2. **Find your computer's IP**:
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" in your Wi-Fi adapter (usually 192.168.X.X or 10.0.X.X)
   
   # Mac/Linux
   ifconfig
   ```

3. **On iPad/iPhone Safari**:
   - Open Safari
   - In address bar: `http://192.168.X.X:5173` (your IP from step 2)
   - The app loads fullscreen

4. **Test features**:
   - ✅ Type text
   - ✅ Tap "Load Voices" → wait 2–3 seconds
   - ✅ Tap "Speak" → audio plays
   - ✅ Tap "Export Audio" → file downloads
   - ✅ Offline: Turn on Airplane Mode → Speak still works, Export shows warning

5. **Add to Home Screen** (optional):
   - Tap Share (⬆️ icon, bottom of screen)
   - Scroll down, tap "Add to Home Screen"
   - Give it a name (or keep default)
   - Tap "Add"
   - The app now appears as an icon on your home screen
   - When opened from home screen, it runs fullscreen with no Safari ui

---

## 📋 Environment Variables

### Frontend (optional for LAN testing)

Create `frontend/.env.local`:
```env
# Only needed if backend is on different machine/IP
VITE_API_BASE=http://192.168.X.X:3001
```

- If not set, defaults to `http://localhost:3001`
- On localhost (desktop) development, Vite's proxy will handle it automatically
- On LAN (iPhone) testing, set this to your computer's IP:3001

### Backend (optional)

Create `backend/.env`:
```env
TTS_PROVIDER=mock
PORT=3001
NODE_ENV=development
```

**Supported providers**:
- `mock` (default) - Always works, returns WAV beep
- `google` - Requires Google Cloud credentials
- `azure` - Requires Azure API key
- `aws` - Requires AWS credentials

If no credentials are set, the mock provider kicks in automatically.

---

## 🏗️ Project Structure

```
Qanet_tts_web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextInput.tsx
│   │   │   ├── VoiceSelector.tsx
│   │   │   ├── Controls.tsx
│   │   │   └── Status.tsx
│   │   ├── App.tsx (main app logic)
│   │   ├── main.tsx (entry + Service Worker registration)
│   │   └── index.css (mobile-first styling)
│   │
│   ├── public/
│   │   ├── sw.js (Service Worker - offline caching)
│   │   ├── manifest.webmanifest (PWA metadata)
│   │   ├── favicon.svg
│   │   └── apple-touch-icon.png (iOS home screen icon)
│   │
│   ├── index.html (iOS meta tags included)
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.ts (Express app + CORS)
│   │   ├── routes/
│   │   │   └── tts.ts (POST /api/tts endpoint)
│   │   └── services/
│   │       └── ttsService.ts (TTS providers + mock generator)
│   │
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## 🔑 Key Features

### Frontend
- **React + TypeScript** for type-safe components
- **Vite** for fast dev server with HMR
- **Service Worker** for offline app-shell caching
- **Web Speech API** for browser-based speech synthesis
- **Mobile-first CSS** with safe-area support for notched iPhones
- **Responsive layout** that works on all screen sizes

### Backend
- **Express** server with CORS enabled
- **POST /api/tts** endpoint accepts JSON, returns audio
- **Pluggable TTS providers**: Mock (default), Google, Azure, AWS
- **Mock provider** generates a simple WAV beep (no credentials needed)
- **Error handling** with fallback to mock if provider fails

### PWA Features
- **Offline support**: Assets cached by Service Worker
- **Installable**: Add to Home Screen on iOS
- **Fullscreen**: No Safari chrome when opened from home screen
- **iOS meta tags**: Status bar, icon, app name

---

## 🚀 Development Tips

### Hot Reload
- Frontend: Vite automatically reloads when you save files
- Backend: Nodemon auto-restarts server on TypeScript file changes

### Debug with Browser DevTools
- **Desktop**: F12 in Chrome to open DevTools
- **iPhone**: Connect to Mac via USB → Mac Safari → Develop menu → select your iPhone

### Test Offline
- Open DevTools → Network tab → click "Offline" checkbox
- Speak button works (browser synthesis)
- Export button shows "requires internet" error

### Adding New Locales
Edit `frontend/src/components/VoiceSelector.tsx`:
```typescript
const localeOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French' },  // Add here
];
```

---

## 🐛 Troubleshooting

### "Cannot GET /api/tts"
- ❌ Is the backend running? Check Terminal 1
- ✅ Start backend: `cd backend && npm run dev`

### Voices not loading
- ❌ Voices list is empty initially on many browsers
- ✅ Tap the "Load Voices" button
- ✅ Wait 2–3 seconds (voices load async)
- ✅ Check browser console for errors (F12)

### Export Audio returns error "HTTP 500"
- ❌ Backend crashed or isn't running
- ✅ Restart backend server
- ✅ Check for errors in backend terminal
- ✅ Ensure `npm install` was run in backend folder

### iPhone can't connect to http://192.168.X.X:5173
- ❌ Wrong IP address
- ✅ Verify correct IP: `ipconfig` on Windows
- ✅ Both devices on same Wi-Fi network
- ✅ Check firewall isn't blocking port 5173

### Frontend calls backend but gets CORS error
- ❌ Running on different machines/networks
- ✅ Frontend at http://192.168.1.10:5173, Backend at http://192.168.1.20:3001?
- ✅ Set `VITE_API_BASE=http://192.168.1.20:3001` in frontend/.env.local
- ✅ Restart frontend dev server

### "Service Worker: Cannot register"
- ❌ Running over HTTP on non-localhost
- ✅ Service Workers require HTTPS in production
- ✅ On localhost development, SW should register fine
- ✅ Check browser console (F12) for errors

---

## 📦 Build & Deploy

### Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/ (static files for hosting)

# Backend
cd backend
npm run build
# Output: backend/dist/ (compiled JavaScript)
```

### Deploy Frontend

**Netlify/Vercel**:
1. Upload `frontend/dist/` folder
2. Configure environment: Set `VITE_API_BASE` to your backend URL
3. Netlify auto-detects it's a React SPA and configures correctly

**Self-hosted (nginx)**:
```nginx
server {
  listen 80;
  root /app/frontend/dist;
  
  location / {
    try_files $uri $uri/ /index.html;  # Route all requests to index.html
  }
  
  location /api {
    proxy_pass http://backend:3001;
  }
}
```

### Deploy Backend

**Railway/Heroku**:
1. Connect your git repo
2. Set environment variables (TTS_PROVIDER, API keys, etc.)
3. Command: `npm run build && npm run start:compiled`
4. Port: Automatically assigned to `process.env.PORT`

**Self-hosted (systemd service)**:
```ini
[Unit]
Description=QANet TTS Backend
After=network.target

[Service]
Type=simple
User=tts
WorkingDirectory=/app/backend
ExecStart=node /app/backend/dist/server.js
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=TTS_PROVIDER=mock
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 📚 API Reference

### POST /api/tts

**Request**:
```json
{
  "text": "Hello, how are you?",
  "locale": "en-US",
  "rate": 1.0,
  "pitch": 1.0
}
```

**Response**:
- Content-Type: `audio/mpeg` (for real TTS) or `audio/wav` (for mock)
- Content-Disposition: `attachment; filename="audio.mp3"` (or `.wav`)
- Binary audio data

**Errors**:
- 400: Invalid request (empty text, out-of-range rate/pitch)
- 500: TTS generation failed (tries fallback to mock)

### GET /health

**Response**:
```json
{
  "status": "ok",
  "provider": "mock"
}
```

---

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] Voices load within 3 seconds of tapping "Load Voices"
- [ ] Speak button plays audio (browser synthesis)
- [ ] Stop button stops playback
- [ ] Export Audio downloads file (if online)
- [ ] Offline mode: Speak works, Export shows warning
- [ ] Different locales work (en-US, es-ES)
- [ ] Speed/pitch sliders are smooth and responsive
- [ ] On iPhone: App opens fullscreen from home screen
- [ ] On iPhone: All buttons are touch-friendly (large enough)
- [ ] CORS works between frontend and backend

---

## 🎯 Next Steps

1. **Run dev servers**: Follow "Quick Start" above
2. **Test on desktop**: Visit http://localhost:5173
3. **Test on iPhone**: Follow "Testing on iPhone" section
4. **Configure TTS provider**: Edit `backend/.env` if you have credentials
5. **Deploy**: Follow "Build & Deploy" section when ready

---

**Questions?** Refer to iOS_INSTRUCTIONS.md for iOS-specific details, or README.md for full project overview.
