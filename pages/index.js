import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>33 for a Moment - Podcast</title>
        <meta name="description" content="Welcome to 33 for a Moment podcast" />
      </Head>

      <div className={styles.hero}>
        <h1>33 for a Moment</h1>
        <p>Welcome to our podcast journey celebrating meaningful conversations</p>
      </div>

      <section className={styles.sections}>
        <h2>Choose Your Access Level</h2>
        <div className={styles.sectionsGrid}>
          <div className={styles.sectionCard}>
            <h3>Public Access</h3>
            <p>Listen to publicly available podcast episodes</p>
            <Link href="/public" className={styles.button}>
              Browse Public Episodes
            </Link>
          </div>
          
          <div className={styles.sectionCard}>
            <h3>Partner Access</h3>
            <p>Access episodes shared with Irsyad's partner</p>
            <Link href="/partner" className={styles.button}>
              Partner Login
            </Link>
          </div>
          
          <div className={styles.sectionCard}>
            <h3>Irsyad Only</h3>
            <p>Private dashboard for all podcast episodes</p>
            <Link href="/me" className={styles.button}>
              Personal Access
            </Link>
          </div>
          
          <div className={styles.sectionCard}>
            <h3>Friends Portal</h3>
            <p>Friend access to manage conversation visibility</p>
            <Link href="/friends" className={styles.button}>
              Friends Login
            </Link>
          </div>
        </div>
      </section>
      
      <section className={styles.about}>
        <h2>About This Project</h2>
        <p>
          "33 For A Moment" is a personal podcast project celebrating meaningful 
          conversations with friends as I turn 33. Inspired by Five for Fighting's 
          "100 Years" lyrics: "I'm 33 for a moment, still the man, but you see I'm a they..."
        </p>
      </section>
    </Layout>
  );
}