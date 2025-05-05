import Head from 'next/head';
import Layout from '../components/Layout';
import PodcastCard from '../components/PodcastCard';
import { getAllPodcasts } from '../lib/podcasts';
import styles from '../styles/Home.module.css';

export default function Home({ podcasts }) {
  return (
    <Layout>
      <Head>
        <title>33 for a Moment - Podcast</title>
        <meta name="description" content="Welcome to 33 for a Moment podcast" />
      </Head>

      <div className={styles.hero}>
        <h1>33 for a Moment</h1>
        <p>Welcome to our podcast journey</p>
      </div>

      <section className={styles.podcasts}>
        <h2>Latest Episodes</h2>
        <div className={styles.podcastGrid}>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const podcasts = await getAllPodcasts();
    return {
      props: {
        podcasts,
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