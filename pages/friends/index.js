import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import { getAllFriends } from '../../lib/clientData';
import styles from '../../styles/Friends.module.css';

export default function Friends({ friends }) {
  return (
    <PasswordProtection>
      <Layout>
        <Head>
          <title>Friends Portal - 33 for a Moment</title>
        </Head>

        <div className={styles.friends}>
          <h1>Friends Portal</h1>
          
          <section className={styles.section}>
            <h2>Our Friends</h2>
            <div className={styles.friendsGrid}>
              {friends.map((friend) => (
                <div key={friend.id} className={styles.friendCard}>
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className={styles.avatar}
                  />
                  <h3>{friend.name}</h3>
                  <p>{friend.bio}</p>
                  <a href={`/friends/${friend.id}`} className={styles.link}>
                    View Profile
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </PasswordProtection>
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
