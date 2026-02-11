# QANet TTS PWA - Production-Ready iOS App

A full-stack, production-ready Progressive Web App for Text-to-Speech that works seamlessly on iOS as a native app.

## 🎯 Features

✅ **PWA with iOS Support**
- Install to home screen on iPhone
- Fullscreen mode (no Safari chrome)
- Offline-first architecture with Service Worker
- Native app feel with splash screens

✅ **Text-to-Speech Controls**
- Browser-based speech synthesis (Web Speech API)
- Server-side TTS export with audio download
- Language/locale selector (en-US, es-ES)
- Speed control (0.5x – 2.0x)
- Pitch control (0.5 – 2.0)

✅ **Backend TTS Engine**
- Pluggable TTS providers: Google Cloud, Azure, AWS Polly
- Fallback mock engine (always works)
- Server-side audio rendering to MP3
- Environment-based configuration

✅ **Responsive Design**
- Mobile-first layout
- Large touch-friendly buttons
- Safe area support on notched iPhones
- Gradient UI with smooth animations

## 📁 Project Structure

```
Qanet_tts_web/
├── frontend/                          # React + Vite + TypeScript (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextInput.tsx
│   │   │   ├── VoiceSelector.tsx
│   │   │   ├── Controls.tsx
│   │   │   └── Status.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   ├── sw.js                     # Service Worker
│   │   ├── manifest.webmanifest      # PWA manifest
│   │   ├── favicon.svg
│   │   └── apple-touch-icon.png
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # Express + Node.js (port 3001)
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── tts.ts
│   │   └── services/
│   │       └── ttsService.ts
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── package.json                       # Root project file
├── README.md
└── iOS_INSTRUCTIONS.md
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- iOS device (iPhone, iPad) for full testing

### Installation & Development

```bash
# 1. Clone or navigate to project
cd Qanet_tts_web

# 2. Install & run (both frontend + backend)
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

The dev script runs both frontend and backend in parallel.

### Production Build

```bash
# Build both frontend and backend
npm run build

# Frontend builds to: frontend/dist/
# Backend builds to: backend/dist/
```

### Run Production

```bash
# Start backend (requires compiled dist/)
npm run backend:start

# Serve frontend from static hosting or:
npm run frontend:preview
```

## 🔧 Configuration

### Backend TTS Provider

Edit `backend/.env`:

```env
TTS_PROVIDER=mock              # Options: google, azure, aws, mock
PORT=3001
NODE_ENV=development
```

#### Google Cloud TTS
```env
TTS_PROVIDER=google
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
GOOGLE_CLOUD_PROJECT=your-project-id
```
[Setup Guide](https://cloud.google.com/docs/authentication/getting-started)

#### Azure TTS
```env
TTS_PROVIDER=azure
AZURE_TTS_KEY=your-api-key
AZURE_TTS_REGION=westus
```
[Setup Guide](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-text-to-speech)

#### AWS Polly
```env
TTS_PROVIDER=aws
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
```
[Setup Guide](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html)

#### Mock (Default - Always Works)
```env
TTS_PROVIDER=mock
```
Returns a small test tone. Perfect for development.

## 📱 iOS Installation & Setup

### Add to Home Screen

1. **Open in Safari**
   - Navigate to your app's URL (e.g., `http://yourdomain.com` or `http://192.168.x.x:5173`)

2. **Share → Add to Home Screen**
   - Tap the **Share** button (bottom center)
   - Scroll and tap **Add to Home Screen**
   - Customize name (optional)
   - Tap **Add**

3. **Launch**
   - The app appears on your home screen
   - Tap to open—it runs fullscreen, no Safari chrome

### Ensure Fullscreen Mode

The app automatically runs fullscreen on iOS because:
- `manifest.webmanifest` has `"display": "standalone"`
- HTML includes `<meta name="apple-mobile-web-app-capable" content="yes">`
- Service Worker caches assets for offline access

### iOS PWA Limitations & Workarounds

| Limitation | Workaround |
|-----------|-----------|
| **Speech Synthesis audio cannot be captured** | Use Export Audio (backend) to download MP3 |
| **No persistent storage beyond cache** | App cache persists; user data in localStorage is limited to ~5MB |
| **No background audio** | Works only when app is in foreground |
| **Limited localStorage** | Use IndexedDB if needed (not implemented here) |
| **Status bar shows time** | Set `apple-mobile-web-app-status-bar-style: black-translucent` for dark bars |

### Notch & Safe Area Support

The app includes CSS safe-area handling:
```css
padding-bottom: env(safe-area-inset-bottom);
```
This ensures buttons/content don't hide behind iPhone notches or home bars.

## 🌐 API Reference

### POST /api/tts

Export audio file from backend.

**Request:**
```json
{
  "text": "Hello world",
  "locale": "en-US",
  "rate": 1.0,
  "pitch": 1.0
}
```

**Response:**
```
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="audio.mp3"
```

**Error Responses:**
- `400` – Invalid text or out-of-range rate/pitch
- `500` – TTS engine failure (falls back to mock)

## 🔌 Browser Support

| Feature | Chrome | Safari (iOS) | Firefox | Edge |
|---------|--------|-------------|---------|------|
| PWA Install | ✅ | ✅ (home screen) | ✅ | ✅ |
| Web Speech API | ✅ | ✅ | ⚠️ (limited) | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Fullscreen iOS | ✅ | ✅ | ✅ | ✅ |

## 📦 Dependencies

### Frontend
- **React 18** – UI framework
- **Vite 5** – Build tool
- **TypeScript** – Type safety

### Backend
- **Express** – HTTP server
- **CORS** – Cross-origin support
- **@google-cloud/text-to-speech** – Google TTS (optional)

## 🚀 Deployment

### Netlify / Vercel (Frontend)
1. Build: `npm run frontend:build`
2. Deploy `frontend/dist/` folder
3. Configure rewrite: `/* -> /index.html 200`

### Heroku / Railway (Backend)
1. Create `.env` with TTS credentials
2. Deploy `backend/` folder
3. Backend automatically runs on specified `PORT`

### Self-Hosted
1. Build both: `npm run build`
2. Serve frontend from web server (nginx, Apache)
3. Run backend with node: `node backend/dist/server.js`

## 🛠️ Development

### Add a New Language

Edit `frontend/src/components/VoiceSelector.tsx`:
```typescript
const localeOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French (France)' },  // Add this
];
```

### Customize UI

- Colors: Edit gradient in `frontend/src/index.css` (currently #667eea → #764ba2)
- Icons: Replace SVG in `frontend/public/favicon.svg`
- Text: Update `frontend/src/App.tsx`

## 📊 Testing Checklist

- [ ] **Desktop**: Speak & export work in Chrome
- [ ] **iOS Safari**: Load in browser, voices load properly
- [ ] **Add to Home Screen**: Works without chrome
- [ ] **Fullscreen**: No Safari UI visible when opened from home screen
- [ ] **Offline**: UI loads, Speak works, Export shows "requires internet"
- [ ] **Audio Export**: Opens file or shows share dialog
- [ ] **Different Locales**: Test en-US and es-ES
- [ ] **Speed/Pitch**: Sliders move 0.5–2.0 smoothly
- [ ] **Cross-origin**: CORS works between :5173 and :3001

## 📝 License

MIT

## 🤝 Contributing

Feel free to fork, modify, and deploy!

---

**Questions?** Check `iOS_INSTRUCTIONS.md` for more detailed iOS setup.
