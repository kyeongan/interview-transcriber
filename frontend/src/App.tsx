import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AudioPlayer from './components/AudioPlayer';
import TranscriptEditor from './components/TranscriptEditor';
import ConversationView from './components/ConversationView';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import { formatTime, exportAsJSON } from './utils';
import type { Segment } from './types';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [segments, setSegments] = useState<Segment[]>([]); // editable segments
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const uploadAndTranscribe = async () => {
    if (!file) { setError('Choose a file first'); return; }
    setError(''); setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      // Ensure proper URL formatting without double slashes
      const apiUrl = `${API_BASE_URL.replace(/\/$/, '')}/api/transcribe`;
      const res = await axios.post(apiUrl, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { audioUrl, segments: rawSegments } = res.data;
      // Map speakers to Agent/Candidate using smart heuristics
      const counts: Record<string, number> = {};
      for (const s of rawSegments) {
        counts[s.speaker] = (counts[s.speaker] || 0) + 1;
      }
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      
      const speakerToLabel: Record<string, string> = {};
      const uniqueSpeakers = Object.keys(counts);
      
      if (uniqueSpeakers.length === 1) {
        // Only one speaker detected - label as Agent
        speakerToLabel[uniqueSpeakers[0]] = 'Agent';
      } else if (uniqueSpeakers.length === 2) {
        // Two speakers - assume first speaker chronologically is Agent
        const firstSpeaker = rawSegments[0]?.speaker;
        const secondSpeaker = uniqueSpeakers.find(s => s !== firstSpeaker);
        if (firstSpeaker) speakerToLabel[firstSpeaker] = 'Agent';
        if (secondSpeaker) speakerToLabel[secondSpeaker] = 'Candidate';
      } else {
        // More than 2 speakers - use frequency-based mapping
        speakerToLabel[sorted[0][0]] = 'Agent';
        if (sorted[1]) speakerToLabel[sorted[1][0]] = 'Candidate';
        // Additional speakers get numbered labels
        for (let i = 2; i < sorted.length; i++) {
          speakerToLabel[sorted[i][0]] = `Speaker ${i-1}`;
        }
      }
      
      const mapped: Segment[] = rawSegments.map((s: Segment) => ({
        ...s,
        label: speakerToLabel[s.speaker] || `Speaker ${s.speaker}`,
        timestamp: formatTime(s.start || 0)
      }));
      // Handle audio URL concatenation, avoiding double slashes
      const fullAudioUrl = audioUrl 
        ? `${API_BASE_URL}${audioUrl.startsWith('/') ? audioUrl : '/' + audioUrl}`
        : '';
      setAudioUrl(fullAudioUrl);
      setSegments(mapped);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      
      // Extract user-friendly error message from server response
      let errorMessage = 'Upload failed. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { userMessage?: string; error?: string }; status?: number } }).response;
        if (response?.data?.userMessage) {
          errorMessage = response.data.userMessage;
        } else if (response?.data?.error) {
          errorMessage = response.data.error;
        } else if (response?.status === 413) {
          errorMessage = 'File is too large. Please upload a smaller audio file (max 50MB).';
        } else if (response?.status && response.status >= 500) {
          errorMessage = 'Server error. Please try again in a moment.';
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Upload timed out. Please try with a smaller file.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const updateText = (idx: number, field: keyof Segment, value: string) => {
    const copy = [...segments];
    copy[idx] = { ...copy[idx], [field]: value };
    setSegments(copy);
  };

  const exportEdited = () => {
    exportAsJSON(segments, 'interview_transcript');
  };

  return (
    <div className="container">
      <Header />
      
      <FileUploader 
        file={file}
        uploading={uploading}
        error={error}
        onFileSelect={handleFileSelect}
        onUpload={uploadAndTranscribe}
      />

      <AudioPlayer audioUrl={audioUrl} />
      
      <TranscriptEditor 
        segments={segments}
        onUpdateSegment={updateText}
        onExport={exportEdited}
      />

      {audioUrl && segments.length === 0 && !uploading && <EmptyState />}

      <ConversationView segments={segments} />
    </div>
  );
}

// Render Footer outside of container for sticky positioning
export default function AppWithFooter() {
  return (
    <>
      <App />
      <Footer />
    </>
  );
}