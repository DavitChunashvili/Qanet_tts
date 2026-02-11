# iOS Setup & Installation Instructions

## 🍎 How to Install QANet TTS on iPhone/iPad

### Step 1: Access the App

You have two options:

**Option A: Local Network (Development)**
1. Start the dev server: `npm run dev` (from project root)
2. Frontend runs on `http://localhost:5173`
3. On iPhone, same WiFi: Open Safari
4. Enter your computer's IP (e.g., `http://192.168.1.100:5173`)

**Option B: Deployed Online**
1. Deploy frontend to Netlify/Vercel
2. Share the URL (e.g., `https://qanet-tts.netlify.app`)
3. Open in Safari on iPhone

### Step 2: Add to Home Screen

1. **Tap the Share button** (bottom center of Safari)
   - On older iPhones: ⬆️ icon
   - On newer iPhones: ⬆️ in bottom toolbar

2. **Scroll down** and tap **Add to Home Screen**

3. **Customize** (optional)
   - App name: Keep or edit (max ~20 chars)
   - Icon: Shows automatically from manifest

4. **Tap Add** (top right)

The app now appears on your home screen!

### Step 3: Launch & Verify Fullscreen

1. **Tap the app icon** on home screen
2. **Verify**: No Safari address bar or top controls visible
   - If Safari chrome is visible, something went wrong (see troubleshooting)
3. **App should display**: Header (🎙️ QANet TTS), text input, sliders, buttons

---

## ✅ Fullscreen Verification Checklist

| Check | Status | How to Fix |
|-------|--------|-----------|
| No address bar at top | ✅ | (automatic with PWA) |
| No toolbar at bottom | ✅ | (automatic with PWA) |
| Fills entire screen | ✅ | (set in CSS) |
| Safe area padding on notch | ✅ | (CSS env() handles) |
| App stays fullscreen while using | ✅ | (Web API prevents exit) |

---

## 🎤 Testing the App on iOS

### 1. Load Voices
- Tap **Load Voices** button
- Status shows: "✅ Voices ready"
- If empty, wait 2–3 seconds and tap again

### 2. Speak (Browser Speech Synthesis)
- Enter text: "Hello world"
- Change locale to **Spanish** (optional)
- Tap **Speak**
- iPhone plays audio through speaker
- **Note**: Audio is NOT recorded/exported when using browser synthesis

### 3. Export to Audio File (Server-Side)
- Enter text: "This is an export test"
- Tap **Export Audio**
- Status: "Exporting audio..."
- After ~2 seconds: File downloads or share dialog appears
- Files saved to Downloads folder

### 4. Offline Mode
- Open app
- Enable Airplane Mode
- Tap **Speak**: Still works (uses browser synthesis)
- Tap **Export Audio**: Shows "Export requires internet"
- UI remains visible (cached by Service Worker)

### 5. Different Languages
- Change locale dropdown to **Spanish (Spain)**
- Select Spanish voice
- Tap **Speak**
- Spanish voice plays (if available)

---

## 🔧 iOS PWA Limitations & Solutions

### ⚠️ Cannot Capture Speech Synthesis Audio

**Problem**: Safari on iOS doesn't allow JavaScript to capture audio from Web Speech API

**Solution**: Use Export Audio button → sends text to backend → returns MP3

### ⚠️ Limited Offline Functionality

**Problem**: Service Worker caches UI, but full TTS export needs internet

**Status Display**:
- 🟢 **Offline**: Speak button works (browser synthesis)
- 🔴 **Offline**: Export button shows warning
- 🟢 **Online**: Both buttons work

### ⚠️ No Web Audio API Playback from Speech Synthesis

**Why**: Apple restricts audio capture from synthesized speech for privacy

**Our Implementation**: Browser synthesis + Export downloads server-side audio

### ⚠️ Home Screen App Loses Data on Force Quit

**Problem**: Closing the app completely clears memory

**Solution**: Use localStorage for user preferences (not implemented by default, but can be added)

---

## 📡 Network & CORS on iOS

### If Using Local IP (192.168.x.x)

1. Frontend and backend must be on same machine
2. Frontend accesses backend at same IP
3. Example:
   - Frontend: `http://192.168.1.100:5173`
   - Backend: `http://192.168.1.100:3001`
4. CORS automatically allows (same origin)

### If Using Different Machines

1. Set env vars or configure CORS in `backend/src/server.ts`:
   ```typescript
   app.use(cors({
     origin: ['http://192.168.1.100:5173'],  // Add your IP
     credentials: true
   }));
   ```

### If Deployed Online

1. CORS configured for deploy domains
2. No special setup needed
3. Both frontend & backend on same domain or with proper CORS headers

---

## 🐛 Troubleshooting

### Issue: App Opens in Safari Instead of Fullscreen

**Cause**: PWA manifest not loading or iOS caching old version

**Fix**:
1. Force quit the app (swipe up)
2. Remove from home screen
3. Clear Safari cache: Settings → Safari → Clear History and Website Data
4. Re-add to home screen
5. Wait 5 seconds before tapping

### Issue: "Voices Ready" Doesn't Appear

**Cause**: Voice list empty or delayed loading

**Fix**:
1. Tap **Load Voices** button
2. Wait 3 seconds
3. Close app and reopen
4. On iOS, voices load on first `speechSynthesis.speak()` call

### Issue: Export Button Disabled

**Cause**: Offline or backend not running

**Check**:
1. Is backend running? `npm run backend:dev` (terminal shows port 3001)
2. Is iPhone on same WiFi?
3. Can you ping backend IP from iPhone?
   - Open Safari
   - Test: `http://192.168.1.100:3001/health`
   - Should return: `{"status":"ok","provider":"mock"}`

### Issue: Exported Audio Doesn't Play

**Cause**: Browser default MP3 codec or file format issue

**Try**:
1. Download file to iPhone
2. Open Files app
3. Locate .mp3 file
4. Tap to play with Music app

---

## 🎨 Customizing for Production

### 1. Change App Name

Edit `frontend/public/manifest.webmanifest`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

Edit `frontend/index.html`:
```html
<meta name="apple-mobile-web-app-title" content="Your App Name" />
<title>Your App Name</title>
```

### 2. Update Icon & Splash Screen

- Replace `frontend/public/favicon.svg` (app icon)
- Replace `frontend/public/apple-touch-icon.png` (home screen icon)
- Both should be square, 192x192 or larger

### 3. Change Color Scheme

Edit `frontend/src/index.css`:
```css
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### 4. Deploy with Proper Domain

- Upload frontend to Netlify/Vercel
- Configure backend API domain in CORS
- Users access via `https://yourdomain.com` (always HTTPS for PWA)

---

## 📜 iOS Meta Tags Explained

The app includes these iOS-specific tags in `index.html`:

```html
<!-- Allow fullscreen standalone mode -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Status bar color (black-translucent = dark overlay) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<!-- App name on home screen -->
<meta name="apple-mobile-web-app-title" content="QANet TTS" />

<!-- Home screen icon -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

These tell iOS to:
1. Hide Safari chrome
2. Full viewport control
3. Show custom app name
4. Use custom icon

---

## 🔄 Update & Maintenance

### Service Worker Updates

When you deploy a new version:
1. Frontend Vite build auto-versioned (new filenames)
2. Service Worker cache busts on version change
3. Users get new version on next visit

### Backend Updates

For TTS provider changes:
1. Update `.env` file
2. Restart backend
3. No frontend rebuild needed

### Check Installed Version

Open app → Browser DevTools (if testing via desktop) → Application → Service Workers
Shows current cache version

---

## 📚 Useful iOS Development Tools

### Safari DevTools on Mac

1. Mac must be on same WiFi
2. Connect iPhone via USB
3. Mac Safari: Develop → [Your iPhone] → Select your app
4. Remote inspect & debug

### iOS Simulator (Xcode)

1. Install Xcode (~30GB)
2. `xcode-select --install`
3. `xcrun open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app`
4. Open Safari in simulator
5. Navigate to `localhost:5173`

### Simple Local Testing

1. `npm run dev`
2. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac)
3. On iPhone: Safari → `http://192.168.x.x:5173`
4. Add to home screen
5. Test!

---

## ✨ Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Fullscreen on iOS | ✅ | No Safari chrome |
| Audio export | ✅ | Via server-side TTS |
| Browser speech | ✅ | Works offline |
| Install to home | ✅ | Standard PWA |
| CORS handling | ✅ | Frontend proxies to backend on dev |
| Offline support | ✅ | UI + speech synthesis |
| Multiple locales | ✅ | en-US, es-ES (easily extendable) |

---

**Ready to test?** Run `npm run dev` and add to your iPhone home screen! 🚀
