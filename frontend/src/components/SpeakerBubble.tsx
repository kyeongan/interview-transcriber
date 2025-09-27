import type { SpeakerBubbleProps } from '../types';

export default function SpeakerBubble({ speakerLabel, text, timestamp }: SpeakerBubbleProps) {
  const isAgent = speakerLabel === 'Agent';
  const isCandidate = speakerLabel === 'Candidate';
  
  return (
    <div className={`bubble ${
      isAgent ? 'agent' : 
      isCandidate ? 'candidate' : 
      'other-speaker'
    }`}>
      <div className="meta">
        <span className="speaker-name">{speakerLabel}:</span>
        {timestamp && <span className="timestamp">({timestamp})</span>}
      </div>
      <div className="text">{text}</div>
    </div>
  );
}