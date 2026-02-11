# 🔧 EXACT TERMINAL COMMANDS

Copy and paste these commands in order. No modifications needed.

---

## 📌 WINDOWS USERS - Recommended

### Option 1: Fully Automated (Easiest)

1. **In Windows Explorer**:
   - Navigate to: `c:\Users\davit\OneDrive\Desktop\FOR_W\Qanet_tts_web`
   - Double-click: `quickstart.bat`
   - Follow the on-screen prompts

**Done!** The script installs everything and tells you next steps.

---

### Option 2: Manual Commands

**Step 1: Install Backend Dependencies**

Open Command Prompt or PowerShell:
```powershell
cd c:\Users\davit\OneDrive\Desktop\FOR_W\Qanet_tts_web\backend
npm install
```

Expected output:
```
added XXX packages
```

**Step 2: Install Frontend Dependencies**

Open a new Command Prompt or PowerShell window:
```powershell
cd c:\Users\davit\OneDrive\Desktop\FOR_W\Qanet_tts_web\frontend
npm install
```

Expected output:
```
added XXX packages
```

**Step 3: Start Backend Server**

In the first Command Prompt (backend folder):
```powershell
npm run dev
```

Expected output:
```
🚀 TTS Backend running on http://localhost:3001
📡 Provider: mock
```

**Leave this running!**

**Step 4: Start Frontend Server**

In the second Command Prompt (frontend folder):
```powershell
npm run dev
```

Expected output:
```
Local:    http://localhost:5173/
Network:  http://192.168.X.X:5173/
```

**Leave this running too!**

**Step 5: Test in Browser**

Open a web browser (Chrome, Firefox, Safari, Edge):
```
http://localhost:5173
```

You should see the app load!

---

## 🍎 MAC/LINUX USERS

### Step 1: Install Backend

Open Terminal:
```bash
cd ~/Desktop/FOR_W/Qanet_tts_web/backend
npm install
```

### Step 2: Install Frontend

Open a new Terminal tab/window:
```bash
cd ~/Desktop/FOR_W/Qanet_tts_web/frontend
npm install
```

### Step 3: Start Backend

In Terminal Window 1 (from Step 1):
```bash
npm run dev
```

### Step 4: Start Frontend

In Terminal Window 2 (from Step 2):
```bash
npm run dev
```

### Step 5: Test
Open browser to:
```
http://localhost:5173
```

---

## 📱 TEST ON IPHONE

### Step 1: Find Your Computer's IP

**Windows - Command Prompt:**
```powershell
ipconfig
```

Look for "IPv4 Address" under "Wireless LAN adapter WiFi"
Example output: `192.168.1.100`

**Mac/Linux - Terminal:**
```bash
ifconfig
```

Look for `inet 192.168.x.x` on your Wi-Fi adapter

### Step 2: Navigate on iPhone

On your iPhone, open **Safari** and go to:
```
http://192.168.X.X:5173
```
(Replace `192.168.X.X` with your actual IP from Step 1)

### Step 3: Test Features

- Type text in the text box
- Tap **"Load Voices"** → wait 3 seconds
- Tap **"Speak"** → hear audio
- Tap **"Export Audio"** → file downloads
- Tap **"Stop"** → stops playback

### Step 4: Add to Home Screen

On iPhone Safari:
1. Tap the **Share** button (⬆️ icon at bottom center)
2. Scroll down and tap **"Add to Home Screen"**
3. Name it (or keep "QANet TTS")
4. Tap **"Add"** in top-right corner

Now you have an icon on your home screen! Tap it to run fullscreen.

---

## 🛑 STOP SERVERS

When you're done testing:

1. In backend terminal: Press `Ctrl+C`
2. In frontend terminal: Press `Ctrl+C`

Both servers will stop.

---

## 🏗️ BUILD FOR PRODUCTION

When ready to deploy:

### Build Frontend

```powershell
cd frontend
npm run build
```

Output folder: `frontend/dist/`

### Build Backend

```powershell
cd backend
npm run build
```

Output folder: `backend/dist/`

---

## 📡 VERIFY API WORKS

In a third terminal (while servers are running):

**Windows:**
```powershell
curl -X POST http://localhost:3001/api/tts `
  -H "Content-Type: application/json" `
  -d '{"text":"hello","locale":"en-US","rate":1,"pitch":1}'
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:3001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"hello","locale":"en-US","rate":1,"pitch":1}' \
  -o test-audio.wav
```

You should get back a file (test-audio.wav or audio rendered).

---

## 🔧 OPTIONAL: CONFIGURE TTS PROVIDER

Default is `mock` which always works. To use real TTS:

**Step 1: Create .env file**

```powershell
# Navigate to backend folder
cd backend

# Create .env file with your provider
# (Use Notepad or VS Code)
```

**Step 2: Add One of These**

**For Google Cloud:**
```
TTS_PROVIDER=google
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\credentials.json
GOOGLE_CLOUD_PROJECT=your-project-id
```

**For Azure:**
```
TTS_PROVIDER=azure
AZURE_TTS_KEY=your-api-key
AZURE_TTS_REGION=westus
```

**For AWS:**
```
TTS_PROVIDER=aws
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
```

**Step 3: Restart Backend Server**
- Stop terminal (Ctrl+C)
- Run: `npm run dev`

The app will now use your TTS provider.

---

## 🏠 ACCESS FRONTEND FROM ANOTHER COMPUTER

If you want another computer to access the frontend:

**Step 1: Find IP (again)**
```
Windows: ipconfig
Mac: ifconfig
```

**Step 2: On other computer, open browser:**
```
http://192.168.X.X:5173
```

**Note**: Both computers must be on same Wi-Fi network.

---

## 📝 QUICK REFERENCE

| Task | Command |
|------|---------|
| Install backend | `cd backend && npm install` |
| Install frontend | `cd frontend && npm install` |
| Start backend | `cd backend && npm run dev` |
| Start frontend | `cd frontend && npm run dev` |
| Build frontend | `cd frontend && npm run build` |
| Build backend | `cd backend && npm run build` |
| Find your IP | `ipconfig` (Windows) or `ifconfig` (Mac) |
| Stop server | `Ctrl+C` in terminal |

---

## ✅ VERIFICATION

After running both servers, you should see:

**Backend Terminal:**
```
🚀 TTS Backend running on http://localhost:3001
📡 Provider: mock
```

**Frontend Terminal:**
```
Local:    http://localhost:5173/
Network:  http://192.168.X.X:5173/
```

**Browser (http://localhost:5173):**
- App loads
- No errors in console
- All buttons visible

---

## 🎉 DONE!

You're running the app locally and can:
- ✅ Test on desktop
- ✅ Test on iPhone (same Wi-Fi)
- ✅ Add to iPhone home screen
- ✅ Launch as fullscreen app

---

## 📚 NEXT

Read these in order:
1. **00_READ_ME_FIRST.md** (already done!)
2. **START_HERE.md** (overview + tips)
3. **SETUP.md** (detailed development guide)

---

**All commands are ready to copy-paste!** 🚀
