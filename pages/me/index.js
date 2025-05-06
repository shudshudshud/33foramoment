import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import PodcastCard from '../../components/PodcastCard';
import { getAllPodcasts, getAllFriends } from '../../lib/clientData';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard({ podcasts, friends }) {
  return (
    <PasswordProtection accessType="me" pageTitle="Irsyad's Dashboard">
      <Layout>
        <Head>
          <title>My Dashboard - 33 for a Moment</title>
        </Head>

        <div className={styles.dashboard}>
          <h1>Irsyad's Dashboard</h1>
          
          <section className={styles.section}>
            <h2>My Podcasts</h2>
            {podcasts.length > 0 ? (
              <div className={styles.podcastList}>
                {podcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            ) : (
              <p className={styles.noPodcasts}>No podcasts available yet.</p>
            )}
          </section>

          <section className={styles.section}>
            <h2>Friends</h2>
            {friends.length > 0 ? (
              <div className={styles.friendsList}>
                {friends.map((friend) => (
                  <div key={friend.id} className={styles.friendCard}>
                    <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
                    <h3>{friend.name}</h3>
                    <p>{friend.hasResponded ? 'Has responded' : 'Awaiting response'}</p>
                    <a href={`/friends/${friend.id}`} className={styles.link}>
                      View Profile
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noFriends}>No friends added yet.</p>
            )}
          </section>
        </div>
      </Layout>
    </PasswordProtection>
  );
}

export async function getStaticProps() {
  try {
    // Get all podcasts - owner can see all
    const podcasts = await getAllPodcasts();
    
    // Get all friends
    const friends = await getAllFriends();
    
    return {
      props: {
        podcasts,
        friends,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        podcasts: [],
        friends: [],
      },
    };
  }
}
