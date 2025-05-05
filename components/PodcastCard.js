import Link from 'next/link';
import styles from './PodcastCard.module.css';

export default function PodcastCard({ podcast }) {
  return (
    <div className={styles.card}>
      <Link href={`/podcast/${podcast.id}`}>
        <div className={styles.imageContainer}>
          <img
            src={podcast.coverImage}
            alt={podcast.title}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{podcast.title}</h3>
          <p className={styles.description}>{podcast.description}</p>
          <div className={styles.meta}>
            <span className={styles.date}>
              {new Date(podcast.date).toLocaleDateString()}
            </span>
            <span className={styles.duration}>{podcast.duration}</span>
          </div>
        </div>
      </Link>
    </div>
  );
} 