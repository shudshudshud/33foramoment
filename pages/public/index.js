import Head from 'next/head';
import Layout from '../../components/Layout';
import PodcastCard from '../../components/PodcastCard';
import { getAllPodcasts, filterPodcastsByAccess } from '../../lib/clientData';
import styles from '../../styles/Public.module.css';

export default function PublicPage({ podcasts }) {
  return (
    <Layout>
      <Head>
        <title>Public Episodes - 33 for a Moment</title>
        <meta name="description" content="Publicly available episodes of 33 for a Moment podcast" />
      </Head>

      <div className={styles.public}>
        <h1>Public Episodes</h1>
        <p className={styles.intro}>
          These episodes are available for everyone to enjoy. Thank you for visiting 33 for a Moment.
        </p>
        
        {podcasts.length > 0 ? (
          <div className={styles.podcastGrid}>
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        ) : (
          <div className={styles.noPodcasts}>
            <p>No public episodes available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Get all podcasts
    const allPodcasts = await getAllPodcasts();
    
    // Filter to only show public podcasts
    const publicPodcasts = filterPodcastsByAccess(allPodcasts, 'public');
    
    return {
      props: {
        podcasts: publicPodcasts,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return {
      props: {
        podcasts: [],
      },
    };
  }
}