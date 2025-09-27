// Utility function to format timestamps
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Utility function to generate timestamped filename
function generateTimestampedFilename(
  baseName: string,
  extension: string
): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, '-') // Replace colons and dots with dashes
    .replace('T', '_') // Replace T with underscore
    .slice(0, -5); // Remove milliseconds and Z

  return `${baseName}_${timestamp}.${extension}`;
}

// Utility function to export data as JSON with timestamp
export function exportAsJSON(
  data: unknown,
  baseName: string = 'edited_transcript'
): void {
  const filename = generateTimestampedFilename(baseName, 'json');
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
