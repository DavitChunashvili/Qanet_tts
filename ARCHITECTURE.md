# 🏗️ Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's iPhone/iPad                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Safari Browser                        │  │
│  │  (or PWA installed fullscreen on home screen)            │  │
│  │                                                          │  │
│  │  Frontend: http://192.168.X.X:5173                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         React App (TypeScript)                    │  │  │
│  │  │                                                   │  │  │
│  │  │  ┌─────────────────────────────────────────────┐  │  │  │
│  │  │  │         App.tsx (Main Component)           │  │  │  │
│  │  │  │                                             │  │  │  │
│  │  │  │  • Text input (1000 char max)               │  │  │  │
│  │  │  │  • Language selector (en-US, es-ES)         │  │  │  │
│  │  │  │  • Speed slider (0.5-2.0x)                  │  │  │  │
│  │  │  │  • Pitch slider (0.5-2.0)                   │  │  │  │
│  │  │  │  • Speak button (Web Speech API)            │  │  │  │
│  │  │  │  • Stop button                              │  │  │  │
│  │  │  │  • Export button ──┐                        │  │  │  │
│  │  │  │  • Load Voices     │                        │  │  │  │
│  │  │  │  • Status display  │                        │  │  │  │
│  │  │  └─────────────────────────────────────────────┘  │  │  │
│  │  │     │                │                             │  │  │
│  │  │     │ Speak          │ Export POST /api/tts        │  │  │
│  │  │     │                │                             │  │  │
│  │  │     ▼                ▼                             │  │  │
│  │  │  [Web Speech API]  [HTTP Request]                 │  │  │
│  │  │        │                │                          │  │  │
│  │  └────────┼────────────────┼──────────────────────────┘  │  │
│  │           │                │                             │  │
│  │  ┌────────▼────────────────▼──────────────────────────┐  │  │
│  │  │      Service Worker (sw.js) - Offline Cache      │  │  │
│  │  │                                                   │  │  │
│  │  │  • Cache-first: App shell (HTML, CSS, JS)        │  │  │
│  │  │  • Network-first: API calls                       │  │  │
│  │  │  • Fallback: Offline error messages               │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  [PWA Manifest + iOS Meta Tags]                        │  │
│  │  • apple-mobile-web-app-capable: yes                  │  │
│  │  • display: standalone                                │  │
│  │  • safe-area CSS support                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          │ HTTP/HTTPS                       │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ POST /api/tts
                           │ { text, locale, rate, pitch }
                           │
                ┌──────────▼─────────────┐
                │                        │
                │     Wi-Fi Network      │
                │   192.168.X.X/24       │
                │                        │
                └──────────┬─────────────┘
                           │
                           │ HTTP Localhost or LAN IP
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│              Computer / Development Machine                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Backend: Node.js + Express (Port 3001)       │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              server.ts                            │  │  │
│  │  │  • Express app initialization                     │  │  │
│  │  │  • CORS middleware (localhost, 192.168.x.x)       │  │  │
│  │  │  • Body parser JSON                               │  │  │
│  │  │  • Error handler                                  │  │  │
│  │  │  • Health check endpoint                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      │                                   │  │
│  │  ┌───────────────────▼────────────────────────────────┐  │  │
│  │  │              routes/tts.ts                        │  │  │
│  │  │  POST /api/tts                                    │  │  │
│  │  │  ├─ Input validation                              │  │  │
│  │  │  │  ├─ Text: non-empty, max 1000 chars           │  │  │
│  │  │  │  ├─ Locale: string                             │  │  │
│  │  │  │  ├─ Rate: 0.5-2.0                              │  │  │
│  │  │  │  └─ Pitch: 0.5-2.0                             │  │  │
│  │  │  │                                                │  │  │
│  │  │  └─ Call TTS service    </TTS>                    │  │  │
│  │  │     │                                              │  │  │
│  │  │     ▼                                              │  │  │
│  │  │  Return audio                                     │  │  │
│  │  │  • Content-Type: audio/mpeg (MP3) or audio/wav   │  │  │
│  │  │  • Content-Disposition: attachment; filename=    │  │  │
│  │  │  • Binary audio data                              │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │                      │                                   │  │
│  │  ┌───────────────────▼────────────────────────────────┐  │  │
│  │  │         services/ttsService.ts                    │  │  │
│  │  │  getTTSAudio() - Main function                     │  │  │
│  │  │                                                   │  │  │
│  │  │  case TTS_PROVIDER:                                │  │  │
│  │  │                                                   │  │  │
│  │  │  ├─ "google"                                      │  │  │
│  │  │  │  └─ Cloud Text-to-Speech API                  │  │  │
│  │  │  │     • Requires: GOOGLE_APPLICATION_CREDENTIALS │  │  │
│  │  │  │     • Returns: MP3 audio buffer                │  │  │
│  │  │  │                                                │  │  │
│  │  │  ├─ "azure"                                       │  │  │
│  │  │  │  └─ Cognitive Services Speech API             │  │  │
│  │  │  │     • Requires: AZURE_TTS_KEY, AZURE_TTS_REGION│  │  │
│  │  │  │     • Returns: MP3 audio buffer                │  │  │
│  │  │  │                                                │  │  │
│  │  │  ├─ "aws"                                         │  │  │
│  │  │  │  └─ Amazon Polly API                          │  │  │
│  │  │  │     • Requires: AWS credentials               │  │  │
│  │  │  │     • Returns: MP3/WAV audio buffer            │  │  │
│  │  │  │                                                │  │  │
│  │  │  └─ "mock" (default)                              │  │  │
│  │  │     └─ Generated WAV beep (800 Hz sine wave)      │  │  │
│  │  │        • Duration: 0.5 seconds                    │  │  │
│  │  │        • Sample rate: 22050 Hz                    │  │  │
│  │  │        • No credentials needed                    │  │  │
│  │  │        • App always works!                        │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  .env Configuration:                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ TTS_PROVIDER=mock                (or google/azure)   │  │
│  │ PORT=3001                                            │  │
│  │ NODE_ENV=development                                │  │
│  │                                                      │  │
│  │ [Optional - if using real providers]                 │  │
│  │ GOOGLE_APPLICATION_CREDENTIALS=/path/key.json        │  │
│  │ AZURE_TTS_KEY=...                                    │  │
│  │ AWS_ACCESS_KEY_ID=...                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Frontend Dev Server: Vite (Port 5173)                      │
│  ├─ Hot Module Reload (HMR)                                │
│  ├─ Network access (--host)                                │
│  ├─ Proxy for /api → http://localhost:3001                │
│  └─ Files watched for auto-reload                          │
│                                                              │
│  Backend Dev Server: Nodemon + ts-node                      │
│  ├─ Auto-restart on file change                            │
│  ├─ TypeScript compilation on-the-fly                      │
│  └─ Console output for debugging                           │
│                                                              │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### User Speaks Text

```
User types text
       │
       ▼
User taps "Speak" button
       │
       ▼
App loads voices (Web Speech API)
       │
       ▼
Find voice matching selected locale
       │
       ▼
Create SpeechSynthesisUtterance
• text: user input
• rate: slider value (0.5-2.0)
• pitch: slider value (0.5-2.0)
• voice: selected from available list
       │
       ▼
speechSynthesis.speak(utterance)
       │
       ▼
Browser generates audio using OS engine
(no JavaScript involved from here)
       │
       ▼
Audio plays through speaker
       │
       ▼
User hears speech
(Works offline - no internet needed)
```

### User Exports Audio

```
User types text
       │
       ▼
User taps "Export Audio" button
       │
       ▼
Check online status (navigator.onLine)
       │
       ├─ Offline? ──→ Show error "Requires internet"
       │
       └─ Online ──→ Continue
                      │
                      ▼
                 POST to /api/tts
                 {
                   "text": "...",
                   "locale": "en-US",
                   "rate": 1.0,
                   "pitch": 1.0
                 }
                      │
                      ▼ (Network request)
                 Backend receives POST
                      │
                      ▼
                 Validate input
                 • Check text not empty
                 • Check length ≤ 1000 chars
                 • Check rate 0.5-2.0
                 • Check pitch 0.5-2.0
                      │
                      ├─ Invalid? ──→ Return HTTP 400 + error JSON
                      │
                      └─ Valid ──→ Continue
                                  │
                                  ▼
                            Look up TTS_PROVIDER env var
                                  │
                         ┌────────┼────────┬────────┐
                         │        │        │        │
                         ▼        ▼        ▼        ▼
                       Google   Azure    AWS    Mock (Default)
                       │        │        │        │
                       └────────┴────────┴────────┘
                                  │
                                  ▼
                        Generate audio buffer
                        (MP3 or WAV)
                                  │
                                  ▼
                        HTTP Response
                        • Content-Type: audio/mpeg or audio/wav
                        • Content-Disposition: attachment; filename="audio.mp3"
                        • [Binary audio data]
                                  │
                      ▼ (Back to frontend)
                Frontend receives blob
                                  │
                                  ▼
                        Create download URL
                        (URL.createObjectURL)
                                  │
                                  ▼
                        Option 1: Direct download
                        • Create <a> element
                        • Set href to blob URL
                        • Set download="tts-2026-02-11.mp3"
                        • Click programmatically
                                  │
                        Option 2: Share dialog (iOS)
                        • Check navigator.share
                        • Open iOS share sheet
                        • Can save to Files or iCloud
                                  │
                                  ▼
                        File downloads/appears on device
                        User sees download notification
```

### Offline Service Worker

```
First visit (Connected):
       │
       ▼
Load app at http://localhost:5173
       │
       ▼
Service Worker install event
       │
       ├─ Cache app shell:
       │  • /index.html
       │  • /assets/index-XXXXX.js
       │  • /assets/index-XXXXX.css
       │  • /manifest.webmanifest
       │  • /sw.js
       │
       └─ Cache ready
              │
              ▼
        App fully loaded (First visit complete)

Subsequent visits (Any status):
       │
       ├─ Request /assets/style.css
       │  │
       │  └─ Cache-first strategy:
       │     ├─ Check cache first
       │     └─ Found? Return cached version (instant)
       │
       ├─ Request /api/tts (API call)
       │  │
       │  ├─ Online? ──→ Network-first strategy:
       │  │             ├─ Try network first
       │  │             ├─ Got response? Cache it + return
       │  │             └─ Network failed? Return cached version
       │  │
       │  └─ Offline? ──→ Return cached version (if exists)
       │               or error message
       │
       └─ App continues to work with cached assets
          (UI loads even offline, API calls filtered)

On Request to /api/tts while offline:
       │
       └─ Service Worker intercepts
          │
          ├─ Try fetch from network
          │  │
          │  └─ Network failed (offline)
          │
          ├─ Check cache for /api/tts response
          │  │
          │  ├─ Found (previous export)? Return cached audio
          │  │
          │  └─ Not found? Return error JSON
          │     { error: "Offline - API not available" }
          │
          └─ Frontend receives error
             │
             └─ Display "Export requires internet"
```

---

## Component Hierarchy

```
App.tsx (Main)
│
├─ VoiceSelector
│  ├─ Locale dropdown
│  └─ Load Voices button
│
├─ TextInput
│  ├─ Text area
│  └─ Word counter
│
├─ Controls
│  ├─ Rate slider
│  ├─ Pitch slider
│  ├─ Speak button
│  ├─ Stop button
│  └─ Export Audio button
│
└─ Status
   └─ Status message display
```

---

## State Management (App.tsx)

```
App Component State:
│
├─ text (string) - User input text
├─ locale (string) - Selected language (en-US, es-ES)
├─ rate (number) - Playback speed (0.5-2.0)
├─ pitch (number) - Voice pitch (0.5-2.0)
├─ status (enum) - Status type (idle, speaking, exporting, etc.)
├─ statusMessage (string) - User-facing message
├─ isSpeaking (boolean) - Playback in progress
├─ isOnline (boolean) - Network status
├─ voices (array) - Available voices
├─ voicesLoaded (boolean) - Have we fetched voice list
├─ utteranceRef (ref) - Current speech utterance
└─ speakingRef (ref) - Playback state flag
```

---

## Environment & Configuration

```
Development:
│
├─ Frontend (Vite)
│  ├─ PORT: 5173
│  ├─ HOST: 0.0.0.0 (--host for network)
│  ├─ VITE_API_BASE: http://localhost:3001 (default)
│  └─ HMR: Enabled
│
└─ Backend (Express)
   ├─ PORT: 3001
   ├─ TTS_PROVIDER: mock (default)
   └─ CORS: localhost + 192.168.x.x

Production:
│
├─ Frontend (Static)
│  ├─ VITE_API_BASE: https://api.yourdomain.com
│  └─ Served from CDN/Netlify/Vercel
│
└─ Backend
   ├─ PORT: Assigned by hosting (Railway, Heroku)
   ├─ TTS_PROVIDER: google, azure, or aws
   ├─ GOOGLE_APPLICATION_CREDENTIALS: /path/to/key.json
   ├─ AZURE_TTS_KEY: xxxxx
   └─ AWS_*: credentials
```

---

## Request/Response Flow - POST /api/tts

### Request (Frontend → Backend)

```
POST http://localhost:3001/api/tts

Headers:
{
  "Content-Type": "application/json"
}

Body:
{
  "text": "Hello, how are you?",
  "locale": "en-US",
  "rate": 1.2,
  "pitch": 0.9
}
```

### Response Success (Backend → Frontend)

```
HTTP/1.1 200 OK

Headers:
{
  "Content-Type": "audio/mpeg",
  "Content-Disposition": "attachment; filename=\"audio.mp3\"",
  "Cache-Control": "no-cache, no-store, must-revalidate"
}

Body: [Binary MP3 data - ~50-500 KB]
```

### Response Error (Backend → Frontend)

```
HTTP/1.1 400 Bad Request

Headers:
{
  "Content-Type": "application/json"
}

Body:
{
  "error": "Text exceeds 1000 characters"
}
```

---

## Network Communication Diagram

```
Localhost Development:
┌─────────┐        HTTP         ┌─────────┐
│         │◄─────────────────────│         │
│Frontend │  http://localhost    │Backend  │
│ :5173   │  /api/tts            │  :3001  │
│         │──────────────────────►│         │
└─────────┘        JSON          └─────────┘
    ▲                                 ▲
    │                                 │
    └─────────── Same Machine ────────┘
    
    (Vite Proxy forwards /api → localhost:3001)

LAN Testing (iPhone + Computer):
┌─────────────────────────────────────┐
│    Wi-Fi Network 192.168.1.0/24     │
│  ┌──────────┐        ┌──────────┐   │
│  │ Computer │        │  iPhone  │   │
│  │ :5173    │◄───────│  Safari  │   │
│  │ :3001    │─HTTP──►│          │   │
│  └──────────┘        └──────────┘   │
│  192.168.1.100      192.168.1.50    │
└─────────────────────────────────────┘

Data over Wi-Fi:
Frontend @ 192.168.1.100:5173
  │
  └─ Calls POST http://192.168.1.100:3001/api/tts
     (set via VITE_API_BASE env var)
     │
     └─ Backend receives, processes, returns audio
        │
        └─ Browser downloads file
```

---

**This architecture ensures:** ✅ Separation of concerns, ✅ Offline support, ✅ Production scalability, ✅ iOS PWA compatibility
