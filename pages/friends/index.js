import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllFriends } from '../../lib/clientData';
import styles from '../../styles/Friends.module.css';

export default function Friends({ friends }) {
  return (
    <Layout>
      <Head>
        <title>Friends Portal - 33 for a Moment</title>
      </Head>

      <div className={styles.friends}>
        <h1>Friends Portal</h1>
        
        <section className={styles.intro}>
          <p>
            Welcome to the Friends Portal! This is where friends can log in to their individual 
            profiles to manage the visibility of their podcast conversations. 
            Use the password Irsyad provided to you.
          </p>
        </section>
        
        <section className={styles.section}>
          <h2>Find Your Profile</h2>
          <div className={styles.friendsGrid}>
            {friends.map((friend) => (
              <div key={friend.id} className={styles.friendCard}>
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className={styles.avatar}
                />
                <h3>{friend.name}</h3>
                <p>{friend.bio ? friend.bio.substring(0, 100) + '...' : 'No bio available'}</p>
                
                {/* Primary access button - more prominent */}
                <Link href={`/friends/${friend.id}`}>
                  <button className={styles.accessButton}>
                    Access Your Profile
                  </button>
                </Link>
                
                {/* Additional instruction */}
                <p className={styles.passwordNote}>
                  You'll need to enter your password to access your profile.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const friends = await getAllFriends();
    return {
      props: {
        friends,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching friends:', error);
    return {
      props: {
        friends: [],
      },
    };
  }
}