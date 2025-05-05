import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import PodcastCard from '../../components/PodcastCard';
import { getFriendById, getFriendPodcasts } from '../../lib/clientData';
import styles from '../../styles/FriendProfile.module.css';

export default function FriendProfile({ friend, podcasts }) {
  return (
    <PasswordProtection>
      <Layout>
        <Head>
          <title>{friend.name} - 33 for a Moment</title>
          <meta name="description" content={friend.bio} />
        </Head>

        <div className={styles.profile}>
          <div className={styles.header}>
            <img
              src={friend.avatar}
              alt={friend.name}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h1>{friend.name}</h1>
              <p className={styles.bio}>{friend.bio}</p>
              {friend.website && (
                <a
                  href={friend.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.website}
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>

          <section className={styles.section}>
            <h2>Podcasts</h2>
            <div className={styles.podcasts}>
              {podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </PasswordProtection>
  );
}

export async function getStaticProps({ params }) {
  try {
    const friend = await getFriendById(params.friendId);
    const podcasts = await getFriendPodcasts(params.friendId);

    return {
      props: {
        friend,
        podcasts,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching friend profile:', error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  // In a real application, you would fetch all friend IDs here
  // For now, we'll return an empty paths array
  return {
    paths: [],
    fallback: 'blocking',
  };
}
