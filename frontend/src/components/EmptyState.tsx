export default function EmptyState() {
  return (
    <section className="empty-state">
      <h3>No Speech Detected</h3>
      <p>The audio file was processed but no speech was detected. This could be due to:</p>
      <ul>
        <li>Audio file contains no speech</li>
        <li>Audio quality is too low</li>
        <li>Audio format is not fully supported</li>
      </ul>
      <p>Please try uploading a different audio file with clear speech.</p>
    </section>
  );
}