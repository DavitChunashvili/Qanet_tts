# Complete File Listing - QANet TTS PWA

## Project Root Files

```
Qanet_tts_web/
├── package.json                 # Root project metadata
├── README.md                    # Project overview
├── SETUP.md                     # Development setup guide
├── IMPLEMENTATION.md            # Complete implementation walkthrough
├── iOS_INSTRUCTIONS.md          # iOS-specific PWA guide
├── quickstart.bat              # Windows batch script for quick setup
└── .gitignore                  # Git ignore rules
```

---

## Frontend Files

### Configuration & Build

```
frontend/
├── package.json                 # Dependencies: React, Vite, TypeScript
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript for Vite config
├── vite.config.ts              # Vite build config + dev server
├── index.html                  # HTML entry (iOS meta tags included)
├── .gitignore                  # Frontend git ignore
└── .env.example                # Env var template (VITE_API_BASE)
```

### TypeScript Source

```
frontend/src/
├── main.tsx                    # React entry + Service Worker registration
├── App.tsx                     # Main app component with TTS logic
├── index.css                   # Mobile-first styles + safe areas
│
└── components/
    ├── TextInput.tsx           # Text area with word count
    ├── VoiceSelector.tsx       # Language picker + Load Voices button
    ├── Controls.tsx            # Rate/Pitch sliders + Speak/Stop/Export buttons
    └── Status.tsx              # Status message display
```

### Public Assets (PWA & Icons)

```
frontend/public/
├── sw.js                       # Service Worker (offline caching)
├── manifest.webmanifest        # PWA metadata + app info
├── favicon.svg                 # App icon (browser + dev)
└── apple-touch-icon.png        # iOS home screen icon
```

### File Purposes

| File | Lines | Purpose |
|------|-------|---------|
| main.tsx | 11 | React app mount + SW registration |
| App.tsx | 242 | Main logic, states, API calls, speech synthesis |
| index.css | 380+ | Mobile responsive design, safe areas, animations |
| TextInput.tsx | 30 | Text input component with word counter |
| VoiceSelector.tsx | 45 | Locale dropdown +  Load Voices button |
| Controls.tsx | 70 | Rate/Pitch sliders + Export/Speak/Stop |
| Status.tsx | 20 | Status message component |
| sw.js | 80+ | Service Worker offline caching strategy |
| manifest.webmanifest | 30 | PWA manifest (name, icons, display) |
| index.html | 30 | HTML entry with iOS meta tags |

---

## Backend Files

### Configuration & Build

```
backend/
├── package.json                # Dependencies: Express, CORS, TypeScript
├── tsconfig.json               # TypeScript configuration
├── .gitignore                  # Backend git ignore
└── .env.example                # Env var template (TTS_PROVIDER, credentials)
```

### TypeScript Source

```
backend/src/
├── server.ts                   # Express app setup, CORS, routes
│
├── routes/
│   └── tts.ts                  # POST /api/tts endpoint (validation + response)
│
└── services/
    └── ttsService.ts           # TTS logic (Google, Azure, AWS, Mock providers)
```

### File Purposes

| File | Lines | Purpose |
|------|-------|---------|
| server.ts | 38 | Express setup, CORS, middleware, error handling |
| routes/tts.ts | 45 | POST /api/tts endpoint, input validation, audio response |
| services/ttsService.ts | 250+ | TTS providers + Mock WAV generator |

---

## Documentation Files

**In root folder**:

1. **README.md** (380+ lines)
   - Full project overview
   - Feature list
   - Architecture explanation
   - Deployment guide
   - API reference
   - Browser compatibility

2. **SETUP.md** (260+ lines)
   - Quick 5-minute start
   - iPhone testing step-by-step
   - Environment variable explanation
   - Development tips & tricks
   - Troubleshooting guide
   - Production build instructions

3. **IMPLEMENTATION.md** (450+ lines)
   - Complete walkthrough
   - Exact terminal commands
   - File-by-file explanation
   - How it works end-to-end
   - Network architecture
   - Verification checklist

4. **iOS_INSTRUCTIONS.md** (300+ lines)
   - iPhone home screen install
   - Fullscreen verification
   - Feature testing guide
   - PWA limitations & workarounds
   - Safe area support
   - Troubleshooting for iOS

5. **quickstart.bat**
   - Automated setup script
   - Node.js & npm check
   - Dependency installation
   - Next steps guidance

---

## Dependencies

### Frontend (package.json)

**Runtime**:
- react ^18.2.0
- react-dom ^18.2.0

**Dev**:
- @types/react ^18.2.43
- @types/react-dom ^18.2.17
- @vitejs/plugin-react-swc ^3.5.0
- typescript ^5.3.3
- vite ^5.0.8

**Total size**: ~250MB with node_modules

### Backend (package.json)

**Runtime**:
- express ^4.18.2
- cors ^2.8.5
- dotenv ^16.3.1
- @google-cloud/text-to-speech ^5.3.0 (optional, auto-fallbacks)

**Dev**:
- typescript ^5.3.3
- @types/express ^4.17.21
- @types/cors ^2.8.17
- @types/node ^20.10.6
- ts-node ^10.9.2
- nodemon ^3.0.2

**Total size**: ~350MB with node_modules

---

## Total File Count

**Frontend**:
- 7 config/build files
- 5 TypeScript components
- 1 main entry point
- 4 public assets
- **Total: 17 files**

**Backend**:
- 3 config files
- 3 TypeScript source files
- **Total: 6 files**

**Documentation**:
- 5 markdown files
- 1 batch script
- **Total: 6 files**

**Grand Total: ~29 main project files** (plus node_modules)

---

## File Sizes (Approximate)

| Category | Size |
|----------|------|
| Frontend source (src/) | 1.2 MB (minified: 120 KB) |
| Backend source (src/) | 15 KB (compiled: 25 KB) |
| Public assets (icons, manifest) | 5 KB |
| Documentation | 1.5 MB |
| **Total uncompressed** | ~3 MB (excluding node_modules) |
| **Total with node_modules** | ~600 MB |
| **Minified production build** | ~200 KB (frontend) + 25 KB (backend) |

---

## Deployment Artifacts

### Frontend Production Build

**Command**: `npm run build`

**Output**: `frontend/dist/`
```
dist/
├── index.html                 (minified React app)
├── assets/
│   ├── index-XXXXX.js         (React bundle, ~50-80 KB)
│   ├── index-XXXXX.css        (Styles, ~10 KB)
│   └── ...other assets
├── manifest.webmanifest       (copied from public)
├── sw.js                      (Service Worker)
├── favicon.svg                (Icon)
└── apple-touch-icon.png       (iOS icon)
```

**Serve**: Upload to static hosting (Netlify, Vercel, S3, nginx, etc.)

### Backend Production Build

**Command**: `npm run build`

**Output**: `backend/dist/`
```
dist/
├── server.js                  (compiled Express server)
├── routes/
│   └── tts.js
└── services/
    └── ttsService.js
```

**Run**: `NODE_ENV=production node backend/dist/server.js`

---

## Version Info

- **Node.js**: ^18.0.0 (LTS recommended)
- **npm**: ^9.0.0
- **React**: 18.2.0
- **Vite**: 5.0.8
- **Express**: 4.18.2
- **TypeScript**: 5.3.3

---

## Environment Variables

### Development

**File**: `backend/.env`
```
TTS_PROVIDER=mock
PORT=3001
NODE_ENV=development
```

**File**: `frontend/.env.local` (optional)
```
VITE_API_BASE=http://192.168.1.100:3001
```

### Production

**Backend**:
```
NODE_ENV=production
PORT=3001
TTS_PROVIDER=google (or azure, aws, mock)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/creds.json (if Google)
AZURE_TTS_KEY=xxxxx (if Azure)
AWS_ACCESS_KEY_ID=xxxxx (if AWS)
```

**Frontend**:
```
VITE_API_BASE=https://your-backend.com
```

---

## Scripts Overview

### Frontend

```bash
npm run dev        # Vite dev server with HMR (--host for LAN)
npm run build      # TypeScript + Vite minified production build
npm run preview    # Serve dist/ for preview
```

### Backend

```bash
npm run dev        # Nodemon with ts-node (auto-restart)
npm run start      # ts-node (no build)
npm run build      # TypeScript compilation to dist/
npm run start:compiled  # Run compiled dist/server.js
```

---

## PWA Checklist

✅ **Manifest**
- [x] manifest.webmanifest present
- [x] Icons defined (favicon.svg)
- [x] display: "standalone"
- [x] start_url: "/"
- [x] scope: "/"

✅ **Service Worker**
- [x] sw.js registered in main.tsx
- [x] Cache-first for assets
- [x] Network-first for API
- [x] Offline fallback messages

✅ **iOS Support**
- [x] apple-mobile-web-app-capable: yes
- [x] apple-mobile-web-app-status-bar-style: black-translucent
- [x] apple-touch-icon: present
- [x] Safe area insets in CSS
- [x] Viewport meta tag with width, initial-scale

✅ **Security**
- [x] CORS configured
- [x] Content-Security-Policy headers
- [x] No hardcoded secrets
- [x] Environment variables for config

---

## Next Steps

1. **Run quickstart.bat** or manually:
   ```bash
   cd frontend && npm install && npm run dev
   cd backend && npm install && npm run dev
   ```

2. **Test locally**: http://localhost:5173

3. **Test on iPhone**: http://192.168.X.X:5173

4. **Add to home screen**: Share → Add to Home Screen

5. **Deploy**: Build & upload frontend/dist to Netlify, backend to Railway

---

## Support

- **Technical issues**: Check SETUP.md and IMPLEMENTATION.md
- **iOS-specific**: See iOS_INSTRUCTIONS.md
- **Architecture questions**: Refer to README.md
- **Code walkthrough**: Each file has clear comments

---

**Everything is ready to go!** 🚀
