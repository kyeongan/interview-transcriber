interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  if (!audioUrl) return null;

  return (
    <section className="player">
      <h3>Audio Player</h3>
      <audio controls src={audioUrl} style={{ width: '100%' }} />
    </section>
  );
}