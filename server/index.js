require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@deepgram/sdk');
const cors = require('cors');

const app = express();
app.use(cors(corsOptions));

// Configure multer for different environments
const upload = multer({
  dest: process.env.VERCEL ? '/tmp' : './uploads',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY;
if (!DEEPGRAM_KEY) {
  console.error('Set DEEPGRAM_API_KEY in .env');
  process.exit(1);
}

// Initialize Deepgram client
const deepgram = createClient(DEEPGRAM_KEY);

// POST /api/transcribe -> accepts field 'file'
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        userMessage: 'Please select an audio file to upload.',
      });
    }

    // Validate file type
    const allowedTypes = [
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
      'audio/webm',
      'video/mp4',
    ];
    const fileType = req.file.mimetype;

    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({
        error: 'Unsupported file type',
        userMessage: `File type '${fileType}' is not supported. Please upload MP4 file.`,
      });
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        userMessage:
          'File size must be less than 10MB. Please upload a smaller file.',
      });
    }

    console.log(
      `Processing file: ${req.file.originalname} (${fileType}, ${Math.round(
        req.file.size / 1024
      )}KB)`
    );

    // Handle file storage based on environment
    const tmpPath = req.file.path;
    const filename = `${Date.now()}_${req.file.originalname}`;

    let dest;
    if (process.env.VERCEL) {
      // For Vercel, use the temp file directly
      dest = tmpPath;
    } else {
      // For Railway/local, move to uploads directory
      const publicPath = path.join(__dirname, 'uploads');
      if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath);
      dest = path.join(publicPath, filename);
      fs.renameSync(tmpPath, dest);
    }

    // Use Deepgram SDK for pre-recorded transcription with diarization
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(dest),
      {
        model: 'enhanced',
        language: 'en',
        diarize: true,
        smart_format: true,
        punctuate: true,
        utterances: true,
        utt_split: 2,
      }
    );

    if (error) {
      console.error('Deepgram error:', error);

      // Clean up uploaded file on error
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }

      // Parse Deepgram error for user-friendly messages
      let userMessage =
        'Failed to transcribe audio. Please try a different file.';
      if (
        error.message &&
        error.message.includes('corrupt or unsupported data')
      ) {
        userMessage =
          'Audio file appears to be corrupted or in an unsupported format. Please try uploading a different audio file.';
      } else if (error.message && error.message.includes('Bad Request')) {
        userMessage =
          'Invalid audio file format. Please ensure your file is a valid audio recording.';
      } else if (error.message && error.message.includes('timeout')) {
        userMessage =
          'Transcription took too long. Please try with a shorter audio file.';
      }

      return res.status(400).json({
        error: 'Transcription failed',
        userMessage,
        details: error.message,
      });
    }

    const dgBody = result;

    // Simplified speaker detection - alternating speakers when diarization fails
    function detectSpeakersFromContent(utterances) {
      console.log('Using simplified speaker detection...');

      return utterances.map((u, index) => {
        // Simple alternating pattern: first speaker is Agent (0), second is Candidate (1)
        // This assumes a conversation pattern where speakers alternate
        const speakerLabel = index % 2; // 0 for Agent, 1 for Candidate

        console.log(
          `Segment ${index}: "${u.transcript
            .trim()
            .substring(0, 40)}..." -> speaker_${speakerLabel}`
        );

        return {
          speaker: `speaker_${speakerLabel}`,
          start: u.start,
          end: u.end,
          text: u.transcript.trim(),
        };
      });
    }

    // Map Deepgram SDK response to our format
    function mapDeepgramResponse(body) {
      console.log('Processing Deepgram response...');

      // Try utterances first (best for diarization)
      const utterances = body?.results?.utterances || [];
      if (utterances.length) {
        console.log(`Found ${utterances.length} utterances`);

        // Check speaker distribution
        const speakerCounts = {};
        utterances.forEach((u) => {
          const speakerId = u.speaker !== undefined ? u.speaker : 0;
          speakerCounts[speakerId] = (speakerCounts[speakerId] || 0) + 1;
        });
        console.log('Deepgram speaker distribution:', speakerCounts);

        // If only one speaker detected, use content-based detection
        if (Object.keys(speakerCounts).length === 1) {
          console.log(
            'Single speaker detected, applying content-based speaker separation...'
          );
          return detectSpeakersFromContent(utterances);
        }

        // Multiple speakers detected - use Deepgram's assignments
        return utterances.map((u) => ({
          speaker: `speaker_${u.speaker !== undefined ? u.speaker : 0}`,
          start: u.start,
          end: u.end,
          text: u.transcript.trim(),
        }));
      }

      // Fallback: try words -> build segments by speaker
      const words =
        body?.results?.channels?.[0]?.alternatives?.[0]?.words || [];
      // group consecutive words by speaker
      const segments = [];
      let current = null;
      for (const w of words) {
        const sp = w.speaker || w.speaker_label || '0';
        if (!current || current.speaker !== sp) {
          if (current) segments.push(current);
          current = { speaker: sp, start: w.start, end: w.end, text: w.word };
        } else {
          current.end = w.end;
          current.text += w.word.startsWith("'") ? w.word : ' ' + w.word;
        }
      }
      if (current) segments.push(current);
      return segments;
    }

    const segments = mapDeepgramResponse(dgBody);

    console.log(`\nFinal result: ${segments.length} segments created`);
    segments.forEach((seg, idx) => {
      console.log(`${seg.speaker}: "${seg.text.substring(0, 60)}..."`);
    });

    // Return structured transcript + audio URL
    const audioUrl = process.env.VERCEL
      ? null // Vercel doesn't support file serving, audio playback disabled
      : `/uploads/${filename}`;
    res.json({ audioUrl, segments, raw: dgBody });
  } catch (err) {
    console.error('Transcription error:', err);

    // Clean up any uploaded file on error
    if (req.file) {
      const filename = `${Date.now()}_${req.file.originalname}`;
      const dest = path.join(__dirname, 'uploads', filename);
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
    }

    // Provide user-friendly error messages
    let userMessage =
      'An unexpected error occurred during transcription. Please try again.';
    let statusCode = 500;

    if (err?.message?.includes('ENOENT')) {
      userMessage =
        'File could not be processed. Please try uploading the file again.';
      statusCode = 400;
    } else if (err?.message?.includes('timeout')) {
      userMessage =
        'Transcription timed out. Please try with a shorter audio file.';
      statusCode = 408;
    }

    res.status(statusCode).json({
      error: 'Transcription failed',
      userMessage,
      details:
        process.env.NODE_ENV === 'development' ? err?.message : undefined,
    });
  }
});

// Serve uploaded files for playback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// For Vercel serverless deployment
if (process.env.VERCEL) {
  // Export the Express app as a serverless function
  module.exports = app;
} else {
  // For local development and other deployments
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}
