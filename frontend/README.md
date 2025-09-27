# Interview Transcriber - Frontend

A modern React application for transcribing and visualizing interview conversations with AI-powered speaker diarization.

## 🚀 Live Demo

**Production**: https://interview-transcriber-flame.vercel.app

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- **CSS Modules** for styling
- **Vercel** for deployment

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Backend API running (see `../server/README.md`)

### Development Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:4000
```

For production deployment, set `VITE_API_URL` to your backend URL.

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # App header with branding
│   ├── FileUploader.tsx # Audio file upload interface
│   ├── AudioPlayer.tsx  # Synchronized audio playback
│   ├── TranscriptEditor.tsx # Editable transcript view
│   ├── ConversationView.tsx # Chat-style conversation display
│   └── ...
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎯 Key Features

- **Audio Upload**: Drag & drop or click to upload audio files
- **AI Transcription**: Powered by Deepgram's nova-2 model
- **Speaker Diarization**: Automatically identifies and labels speakers
- **Live Audio Playback**: Synchronized with transcript segments
- **Editable Transcript**: Click any text to edit in real-time
- **Export Functionality**: Download edited transcript as JSON
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🔄 API Integration

The frontend communicates with the backend API:

- `POST /api/transcribe` - Upload audio and get transcription
- Audio files are served from `/uploads/` endpoint
- Real-time error handling with user-friendly messages

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variable `VITE_API_URL`
4. Deploy automatically on git push

### Manual Build

```bash
npm run build
# Deploy contents of `dist/` folder to your hosting provider
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Related

- **Backend API**: See `../server/README.md`
- **Full Documentation**: See `../DEPLOYMENT_SUMMARY.md`
