# Interview Transcriber - Backend API

Express.js backend server with Deepgram AI integration for audio transcription and speaker diarization.

## 🚀 Live API

**Production**: https://interview-transcriber-server-production.up.railway.app

## 🛠️ Tech Stack

- **Node.js** with Express
- **Deepgram SDK** for AI transcription (nova-2 model)
- **Multer** for file upload handling
- **CORS** configured for cross-origin requests
- **Railway** for deployment

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Deepgram API key ([Get one here](https://deepgram.com))

### Development Setup

```bash
npm install

# Create .env file
echo "DEEPGRAM_API_KEY=your_key_here" > .env

npm start
```

Server runs on `http://localhost:4000`

## 🔧 Environment Variables

```bash
DEEPGRAM_API_KEY=your_deepgram_api_key
PORT=4000                    # Optional, defaults to 4000
NODE_ENV=production          # Optional, for production optimizations
```

## 📡 API Endpoints

### `POST /api/transcribe`

Upload audio file for transcription with speaker diarization.

**Request:**

- `Content-Type: multipart/form-data`
- `file`: Audio file (MP3, WAV, M4A, etc.)

**Response:**

```json
{
  "audioUrl": "/uploads/filename.mp3",
  "segments": [
    {
      "speaker": "0",
      "text": "Hello, how are you today?",
      "start": 0.5,
      "end": 2.3,
      "label": "Agent",
      "timestamp": "00:00"
    }
  ],
  "raw": {
    /* Raw Deepgram response */
  }
}
```

### `GET /health`

Health check endpoint for monitoring.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-09-27T10:30:00.000Z",
  "deepgram": true
}
```

### `GET /uploads/:filename`

Serve uploaded audio files for playback.

## 🎯 Key Features

- **Smart Speaker Mapping**: Automatically labels speakers as "Agent" and "Candidate"
- **Multi-format Support**: Handles various audio formats
- **Error Handling**: Comprehensive error responses with user-friendly messages
- **File Management**: Automatic cleanup of temporary files
- **CORS Configuration**: Supports multiple frontend domains

## 📁 Project Structure

```
server/
├── index.js          # Main server file
├── uploads/          # Audio file storage
├── package.json      # Dependencies and scripts
├── .env             # Environment variables
└── vercel.json      # Vercel deployment config
```

## 🚀 Deployment

### Railway (Current)

- Automatic deployment from GitHub
- Persistent file storage
- Environment variables configured in Railway dashboard

### Vercel (Alternative)

- Serverless function deployment
- Temporary file storage only
- Configure `DEEPGRAM_API_KEY` in Vercel dashboard

## 🔄 Speaker Diarization Logic

1. **Single Speaker**: Labeled as "Agent"
2. **Two Speakers**: First chronologically = "Agent", Second = "Candidate"
3. **Multiple Speakers**: Frequency-based mapping with numbered fallbacks

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (if configured)

## 🔗 Related

- **Frontend**: See `../frontend/README.md`
- **Full Documentation**: See `../DEPLOYMENT_SUMMARY.md`
