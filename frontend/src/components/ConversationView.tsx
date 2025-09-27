import SpeakerBubble from './SpeakerBubble';
import type { ConversationViewProps } from '../types';

export default function ConversationView({ segments }: ConversationViewProps) {
  if (segments.length === 0) return null;

  return (
    <section className="visualize">
      <h3>Conversation View</h3>
      <div className="conversation-stats">
        <span>{segments.filter(s => s.label === 'Agent').length} Agent messages</span>
        <span>{segments.filter(s => s.label === 'Candidate').length} Candidate messages</span>
        <span>{segments.length} total segments</span>
      </div>
      <div className="bubbles">
        {segments.map((s, idx) => (
          <SpeakerBubble 
            key={idx} 
            speakerLabel={s.label || 'Unknown'} 
            text={s.text}
            timestamp={s.timestamp}
          />
        ))}
      </div>
    </section>
  );
}