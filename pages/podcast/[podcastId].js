import Head from 'next/head';
import Layout from '../../components/Layout';
import DriveAudioPlayer from '../../components/DriveAudioPlayer';
import { getPodcastById, extractGoogleDriveId } from '../../lib/clientData';
import styles from '../../styles/Podcast.module.css';

export default function Podcast({ podcast, fileId }) {
  return (
    <Layout>
      <Head>
        <title>{podcast.title} - 33 for a Moment</title>
        <meta name="description" content={podcast.description} />
      </Head>

      <article className={styles.podcast}>
        <div className={styles.header}>
          <img
            src={podcast.coverImage || '/images/default-cover.jpg'}
            alt={podcast.title}
            className={styles.coverImage}
          />
          <div className={styles.info}>
            <h1>{podcast.title}</h1>
            <p className={styles.date}>
              {new Date(podcast.recordedDate).toLocaleDateString()}
            </p>
            <p className={styles.description}>{podcast.description}</p>
          </div>
        </div>

        <div className={styles.playerContainer}>
          <DriveAudioPlayer fileId={fileId} title={podcast.title} />
        </div>

        <div className={styles.content}>
          <h2>Show Notes</h2>
          <div
            className={styles.showNotes}
            dangerouslySetInnerHTML={{ __html: podcast.showNotes || '<p>No show notes available for this episode.</p>' }}
          />
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    const podcast = await getPodcastById(params.podcastId);
    const fileId = extractGoogleDriveId(podcast.driveUrl);

    if (!podcast || !fileId) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        podcast,
        fileId,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  // In a real application, you would fetch all podcast IDs here
  // For now, we'll return an empty paths array
  return {
    paths: [],
    fallback: 'blocking',
  };
}