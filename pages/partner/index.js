import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import styles from '../../styles/Partner.module.css';

export default function Partner() {
  return (
    <PasswordProtection>
      <Layout>
        <Head>
          <title>Partner Access - 33 for a Moment</title>
        </Head>

        <div className={styles.partner}>
          <h1>Partner Access</h1>
          
          <section className={styles.section}>
            <h2>Welcome Partner</h2>
            <p>This is your exclusive partner portal. Here you can access special content and features.</p>
          </section>

          <section className={styles.section}>
            <h2>Partner Resources</h2>
            <div className={styles.resources}>
              {/* Resource items will be added here */}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Partner Podcasts</h2>
            <div className={styles.podcasts}>
              {/* Partner podcast items will be added here */}
            </div>
          </section>
        </div>
      </Layout>
    </PasswordProtection>
  );
} 