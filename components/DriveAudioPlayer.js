// components/DriveAudioPlayer.js
import { useState, useEffect } from 'react';
import styles from './DriveAudioPlayer.module.css';

export default function DriveAudioPlayer({ fileId, title }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Construct the embed URL for Google Drive
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  
  useEffect(() => {
    // Reset state when fileId changes
    setLoading(true);
    setError(null);
  }, [fileId]);
  
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load audio player. The file might not exist or is not accessible.');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.iframeWrapper}>
        {loading && <div className={styles.loading}>Loading audio player...</div>}
        {error && <div className={styles.error}>{error}</div>}
        
        <iframe
          src={embedUrl}
          width="100%"
          height="100"
          frameBorder="0"
          allowFullScreen
          title={title}
          className={styles.iframe}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
        
        <div className={styles.helpText}>
          <p>Having trouble with the embedded player? <a href={embedUrl} target="_blank" rel="noopener noreferrer">Open directly in Google Drive</a></p>
        </div>
      </div>
    </div>
  );
}