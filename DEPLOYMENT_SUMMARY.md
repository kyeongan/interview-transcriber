# Interview Transcriber - Deployment Summary

## 🚀 Live Application

**Frontend (Vercel)**: https://interview-transcriber-flame.vercel.app  
**Backend API (Railway)**: https://interview-transcriber-server-production.up.railway.app

## 📂 Repository

**GitHub**: https://github.com/kyeongan/interview-transcriber

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript, Vite, Vercel hosting
- **Backend**: Node.js + Express, Railway hosting
- **AI Service**: Deepgram API (nova-2 model with speaker diarization)

## ⚡ Quick Setup (Local Development)

### Prerequisites

- Node.js 18+
- Deepgram API key

### Backend Setup

```bash
cd server
npm install
# Create .env file with:
# DEEPGRAM_API_KEY=your_key_here
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Production Architecture

**Frontend (Vercel)**:

- Static React build deployed via GitHub integration
- Environment variable: `VITE_API_URL` → Railway backend URL
- Automatic deployments on GitHub pushes

**Backend (Railway)**:

- Express server with persistent file storage
- Handles file uploads, Deepgram transcription, and audio serving
- Auto-deploys from GitHub main branch

## 📋 Key Features

✅ **Audio Upload**: Supports common audio formats (MP3, WAV, M4A)  
✅ **AI Transcription**: Deepgram's nova-2 model with speaker diarization  
✅ **Smart Speaker Mapping**: Automatically labels speakers as "Agent" and "Candidate"  
✅ **Live Audio Playback**: Synchronized with transcript segments  
✅ **Editable Transcript**: Click-to-edit text with real-time updates  
✅ **Export Functionality**: Download edited transcript as JSON  
✅ **Responsive Design**: Works on desktop and mobile

## 🎯 Notable Design Decisions

### **Architecture Choice: Separated Frontend/Backend**

- **Frontend on Vercel**: Optimized for React/Vite builds, global CDN
- **Backend on Railway**: Persistent storage for uploaded audio files
- **Tradeoff**: Slightly more complex than monolithic deployment, but better performance and scalability

### **Speaker Diarization Strategy**

- **Approach**: Uses chronological first speaker as "Agent", second as "Candidate"
- **Fallback**: If complex patterns detected, uses frequency-based mapping
- **Tradeoff**: Simple heuristic vs. complex AI analysis for speed and reliability

### **File Storage**

- **Railway**: Persistent uploads directory for audio playback
- **Vercel Alternative**: Could use temporary storage but loses audio playback capability
- **Tradeoff**: Railway hosting cost vs. audio playback functionality

## 🔒 Environment Variables

**Vercel Frontend**:

- `VITE_API_URL`: Points to Railway backend

**Railway Backend**:

- `DEEPGRAM_API_KEY`: Your Deepgram API credentials
- `PORT`: Auto-configured by Railway

## 🚀 Deployment Process

1. **Code Push**: Push to GitHub main branch
2. **Auto-Deploy**: Both Vercel and Railway auto-deploy
3. **Live**: Changes are live within 1-2 minutes

## 📝 Usage Instructions

1. **Visit**: https://interview-transcriber-flame.vercel.app
2. **Upload**: Select an audio file (interview recording)
3. **Transcribe**: Click "Upload & Transcribe"
4. **Review**: AI processes and labels speakers automatically
5. **Edit**: Click any text segment to edit in-place
6. **Export**: Download the final transcript as JSON

---

**Total Development Time**: ~4 hours  
**Status**: ✅ Production Ready  
**Performance**: ~30-60 seconds processing time for typical 10-minute interviews
