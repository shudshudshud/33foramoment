import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import PodcastCard from '../../components/PodcastCard';
import { getAllPodcasts, filterPodcastsByAccess } from '../../lib/clientData';
import styles from '../../styles/Partner.module.css';

export default function Partner({ podcasts }) {
  return (
    <PasswordProtection accessType="partner" pageTitle="Partner Access">
      <Layout>
        <Head>
          <title>Partner Access - 33 for a Moment</title>
        </Head>

        <div className={styles.partner}>
          <h1>Partner Access</h1>
          
          <section className={styles.section}>
            <h2>Welcome Partner</h2>
            <p>This is your exclusive partner portal. Here you can access podcasts that Irsyad has shared with you.</p>
          </section>

          <section className={styles.section}>
            <h2>Partner Podcasts</h2>
            {podcasts.length > 0 ? (
              <div className={styles.podcasts}>
                {podcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            ) : (
              <p className={styles.noPodcasts}>No podcasts have been shared with you yet.</p>
            )}
          </section>
        </div>
      </Layout>
    </PasswordProtection>
  );
}

export async function getStaticProps() {
  try {
    // Get all podcasts
    const allPodcasts = await getAllPodcasts();
    
    // Filter to show podcasts accessible to partner (partner or public)
    const partnerPodcasts = filterPodcastsByAccess(allPodcasts, 'partner');
    
    return {
      props: {
        podcasts: partnerPodcasts,
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
