// components/DriveAudioPlayer.js
import styles from './DriveAudioPlayer.module.css';

export default function DriveAudioPlayer({ fileId, title }) {
  // Construct the embed URL for Google Drive
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.iframeWrapper}>
        <iframe
          src={embedUrl}
          width="100%"
          height="100"
          frameBorder="0"
          allowFullScreen
          title={title}
          className={styles.iframe}
        ></iframe>
      </div>
    </div>
  );
}