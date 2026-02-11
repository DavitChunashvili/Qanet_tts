# 🚀 QANet TTS PWA - START HERE

Welcome! This is a production-ready Progressive Web App for Text-to-Speech that works as a native app on iPhones.

## ⚡ Get Started in 60 Seconds

### Option 1: Automated Setup (Windows)
```bash
# Double-click this file:
quickstart.bat

# Then follow the on-screen instructions
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### ✅ Done!
- Frontend: **http://localhost:5173**
- Backend: **http://localhost:3001**
- iPhone: **http://192.168.X.X:5173** (use your computer's IP)

---

## 📱 Test on iPhone

1. **Find your computer's IP**:
   ```
   Windows: Open Command Prompt → ipconfig
   Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. **On iPhone Safari**:
   ```
   Open http://192.168.X.X:5173
   ```

3. **Test the app**:
   - Type text
   - Tap "Load Voices" → wait 3 seconds
   - Tap "Speak" → hear audio
   - Tap "Export Audio" → download file
   - Tap "Stop" → stop playback

4. **Add to Home Screen** (optional):
   - Tap Share (⬆️) → "Add to Home Screen" → "Add"
   - App appears as icon on home screen
   - Tapping it launches fullscreen (no Safari UI)

---

## 📚 Documentation

Need more info? Read these:

| Document | Purpose |
|----------|---------|
| **SETUP.md** | Step-by-step development guide (recommended first read) |
| **IMPLEMENTATION.md** | Complete technical walkthrough |
| **iOS_INSTRUCTIONS.md** | iPhone PWA specifics (safe areas, home screen, CORS) |
| **README.md** | Project overview & architecture |
| **FILES.md** | Complete file listing & sizes |

---

## 🏗️ Project Structure

```
frontend/               React + Vite frontend
├── src/
│   ├── App.tsx       Main component (TTS logic)
│   ├── components/   UI components
│   └── index.css     Responsive mobile styles
├── public/
│   ├── sw.js         Service Worker (offline)
│   ├── manifest.webmanifest  PWA config
│   └── icons/       Icons

backend/               Express API server
├── src/
│   ├── server.ts     Express setup
│   ├── routes/tts.ts API endpoint
│   └── services/     TTS providers
└── .env.example     Config template
```

---

## 🔧 Key Features

✅ **Frontend**
- React + TypeScript for type safety
- Web Speech API (browser-based TTS)
- Backend API for audio export
- Service Worker for offline support
- Mobile-first responsive design
- iOS PWA support (home screen installs)

✅ **Backend**
- Express REST API
- TTS providers: Google Cloud, Azure, AWS, or Mock
- Mock provider always works (no credentials needed)
- CORS enabled for development
- Environment-based configuration

✅ **PWA Features**
- Install to iOS home screen
- Fullscreen mode (no Safari UI)
- Offline app shell caching
- Works over Wi-Fi on local network

---

## 🎯 What You Can Do

**In the App**:
- 📝 Type text (up to 1000 chars)
- 🌐 Choose language (en-US, es-ES)
- 🎚️ Adjust speed (0.5x - 2.0x)
- 🎵 Adjust pitch (0.5 - 2.0)
- 🔊 Speak text using browser synthesis
- ⏹️ Stop playback anytime
- ⬇️ Export audio as MP3 (desktop) or WAV (fallback)
- 📴 Works offline (Speak only, Export needs internet)

---

## 🌍 Network Modes

### Localhost (Desktop Testing)
```
Browser: http://localhost:5173
Backend: http://localhost:3001 (auto-routed by Vite proxy)
```

### LAN (iPhone Testing)
```
iPhone Safari: http://192.168.1.100:5173
Frontend calls: http://192.168.1.100:3001 (via VITE_API_BASE)
```

### Production
```
Frontend: https://your-domain.com (Netlify/Vercel)
Backend: https://api.your-domain.com (Railway/Heroku/VPS)
```

---

## ⚙️ Configuration

### Add Real TTS Engine (Optional)

Edit `backend/.env`:

**Google Cloud** (if you have credentials):
```
TTS_PROVIDER=google
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

**Azure**:
```
TTS_PROVIDER=azure
AZURE_TTS_KEY=your-api-key
AZURE_TTS_REGION=westus
```

**AWS**:
```
TTS_PROVIDER=aws
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

**Default (No Credentials)**: Fallback to `mock` provider (returns WAV beep)

---

## 🧪 Verify Everything Works

```bash
# Check backend is running
curl http://localhost:3001/health
# Should return: {"status":"ok","provider":"mock"}

# Test API endpoint
curl -X POST http://localhost:3001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"hello","locale":"en-US","rate":1,"pitch":1}' \
  -o test-audio.wav
# Should create audio.wav file
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Run `npm install` in backend/ folder |
| Frontend can't reach backend | Restart frontend after backend is running |
| Voices not loading | Tap "Load Voices" button, wait 3 sec |
| iPhone can't access frontend | Check your IP: `ipconfig`, same Wi-Fi? |
| Export returns error | Check backend is running on correct port |
| App doesn't install on home | Ensure running over http:// on LAN |

**Still stuck?** Check **SETUP.md** → Troubleshooting section

---

## 📦 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Express + Node.js
- **TTS**: Web Speech API (browser) + Server-side (Google/Azure/AWS/Mock)
- **PWA**: Service Worker + Web Manifest
- **Styling**: CSS3 with safe-area support for iOS

---

## 🚢 Deploy to Production

### Build

```bash
# Frontend
cd frontend && npm run build
# Creates: frontend/dist/ (upload to Netlify/Vercel)

# Backend
cd backend && npm run build
# Creates: backend/dist/ (deploy to Railway/Heroku)
```

### Deploy Frontend
- Netlify/Vercel: Drag frontend/dist/ to dashboard
- Set env: `VITE_API_BASE=https://your-backend.com`

### Deploy Backend
- Railway/Heroku: Connect git repo
- Set env: `TTS_PROVIDER=google` (or azure/aws/mock)
- Set credentials if needed (GOOGLE_APPLICATION_CREDENTIALS, etc.)

---

## 💡 Tips

- **HMR**: Changes auto-reload in browser (both frontend & backend)
- **Offline**: Turn on Airplane Mode → Speak still works
- **Safe Areas**: App handles iPhone notches automatically
- **Mobile Design**: All buttons are large and touch-friendly
- **No Passwords**: Just edit `.env` files for configuration

---

## ❓ Questions?

1. **Quick start**: See **SETUP.md** 
2. **How it works**: See **IMPLEMENTATION.md**
3. **iPhone stuff**: See **iOS_INSTRUCTIONS.md**
4. **File details**: See **FILES.md**
5. **Architecture**: See **README.md**

---

## 🎉 Next Steps

1. ✅ Run backends/frontend
2. ✅ Test at localhost:5173
3. ✅ Test on iPhone at 192.168.X.X:5173
4. ✅ Add to home screen (optional)
5. ✅ Deploy to production

---

**Ready? Start with `quickstart.bat` or manual commands above!** 🚀

Questions? I'm here to help. Check the documentation files above first!
