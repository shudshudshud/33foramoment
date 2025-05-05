import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard() {
  return (
    <PasswordProtection>
      <Layout>
        <Head>
          <title>My Dashboard - 33 for a Moment</title>
        </Head>

        <div className={styles.dashboard}>
          <h1>My Dashboard</h1>
          
          <section className={styles.section}>
            <h2>Recent Activity</h2>
            <div className={styles.activityList}>
              {/* Activity items will be added here */}
            </div>
          </section>

          <section className={styles.section}>
            <h2>My Podcasts</h2>
            <div className={styles.podcastList}>
              {/* Podcast items will be added here */}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Friends</h2>
            <div className={styles.friendsList}>
              {/* Friend items will be added here */}
            </div>
          </section>
        </div>
      </Layout>
    </PasswordProtection>
  );
} 