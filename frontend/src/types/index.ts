export interface Segment {
  speaker: string;
  start: number;
  end: number;
  text: string;
  label?: string;
  timestamp?: string;
}

export interface SpeakerBubbleProps {
  speakerLabel: string;
  text: string;
  timestamp?: string;
}

export interface FileUploaderProps {
  file: File | null;
  uploading: boolean;
  error: string;
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
}

export interface TranscriptEditorProps {
  segments: Segment[];
  onUpdateSegment: (index: number, field: keyof Segment, value: string) => void;
  onExport: () => void;
}

export interface ConversationViewProps {
  segments: Segment[];
}
