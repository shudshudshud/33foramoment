import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import PodcastCard from '../../components/PodcastCard';
import { getAllPodcasts, getAllFriends, getFriendPodcasts } from '../../lib/clientData';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard({ podcasts, friends, friendPodcastMap }) {
  // Function to determine the highest access level for a friend
  const getHighestAccessLevel = (friendId) => {
    if (!friendPodcastMap[friendId] || friendPodcastMap[friendId].length === 0) {
      return 'None';
    }
    
    const accessLevels = friendPodcastMap[friendId].map(p => p.accessLevel);
    
    if (accessLevels.includes('public')) {
      return 'public';
    } else if (accessLevels.includes('partner')) {
      return 'partner';
    } else {
      return 'me';
    }
  };
  
  // Function to get CSS class for access level tag
  const getAccessLevelClass = (accessLevel) => {
    switch(accessLevel) {
      case 'public':
        return styles.public;
      case 'partner':
        return styles.partner;
      case 'me':
        return styles.meOnly;
      default:
        return '';
    }
  };
  
  // Function to get descriptive text for access level
  const getAccessLevelText = (accessLevel) => {
    switch(accessLevel) {
      case 'public':
        return 'Public Access';
      case 'partner':
        return 'Partner Access';
      case 'me':
        return 'Me Only';
      default:
        return 'No Podcasts';
    }
  };

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
                {friends.map((friend) => {
                  const accessLevel = getHighestAccessLevel(friend.id);
                  return (
                    <div key={friend.id} className={styles.friendCard}>
                      <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
                      <h3>{friend.name}</h3>
                      <div className={`${styles.accessLevelTag} ${getAccessLevelClass(accessLevel)}`}>
                        {getAccessLevelText(accessLevel)}
                      </div>
                      <a href={`/friends/${friend.id}`} className={styles.link}>
                        View Profile
                      </a>
                    </div>
                  );
                })}
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
    
    // Create a map of friend ID to their podcasts
    const friendPodcastMap = {};
    
    // Initialize with empty arrays
    friends.forEach(friend => {
      friendPodcastMap[friend.id] = [];
    });
    
    // Fill in podcasts for each friend
    podcasts.forEach(podcast => {
      if (podcast.friendId && friendPodcastMap[podcast.friendId]) {
        friendPodcastMap[podcast.friendId].push(podcast);
      }
    });
    
    return {
      props: {
        podcasts,
        friends,
        friendPodcastMap,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        podcasts: [],
        friends: [],
        friendPodcastMap: {},
      },
    };
  }
}