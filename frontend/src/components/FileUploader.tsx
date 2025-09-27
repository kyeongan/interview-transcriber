import type { FileUploaderProps } from '../types';

export default function FileUploader({ file, uploading, error, onFileSelect, onUpload }: FileUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    onFileSelect(selectedFile || null);
  };

  return (
    <section className="uploader">
      <div className="upload-controls">
        <input 
          id="file-upload"
          type="file" 
          accept="audio/*,.mp3,.wav,.webm,audio/mp4" 
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className={`upload-btn ${uploading ? 'disabled' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Audio File
        </label>
        
        {file && (
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-size">({Math.round(file.size / 1024)}KB)</span>
          </div>
        )}
        
        <button 
          className={`run-btn ${!file || uploading ? 'disabled' : ''}`}
          onClick={onUpload} 
          disabled={uploading || !file}
        >
          {uploading ? (
            <>
              <div className="spinner"></div>
              Transcribing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21 5,3"/>
              </svg>
              Run
            </>
          )}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      
      {!error && !uploading && !file && (
        <div className="help-text">
          <p>Supports audio-only MP4 files. Max file size: 10MB.</p>
          <p>The AI will automatically separate speaker voices and create an editable transcript.</p>
        </div>
      )}
    </section>
  );
}