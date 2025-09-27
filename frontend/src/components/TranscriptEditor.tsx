import type { TranscriptEditorProps } from '../types';

export default function TranscriptEditor({ segments, onUpdateSegment, onExport }: TranscriptEditorProps) {
  if (segments.length === 0) return null;

  return (
    <section className="editor">
      <h3>Edit Transcript</h3>
      <div className="segments">
        {segments.map((s, idx) => (
          <div key={idx} className="segmentRow">
            <select 
              value={s.label} 
              onChange={(e) => onUpdateSegment(idx, 'label', e.target.value)}
              title="Select speaker type"
            >
              <option value="Agent">Agent</option>
              <option value="Candidate">Candidate</option>
            </select>
            <textarea 
              value={s.text} 
              onChange={(e) => onUpdateSegment(idx, 'text', e.target.value)}
              placeholder="Edit transcript text..."
              title="Edit the transcript text for this segment"
            />
          </div>
        ))}
      </div>
      <div className="export-section">
        <button className="export-btn" onClick={onExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Edited JSON
        </button>
      </div>
    </section>
  );
}