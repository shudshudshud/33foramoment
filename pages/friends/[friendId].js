import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import PasswordProtection from '../../components/PasswordProtection';
import PodcastCard from '../../components/PodcastCard';
import { getFriendById, getFriendPodcasts, updatePodcastAccess } from '../../lib/clientData';
import styles from '../../styles/FriendProfile.module.css';

export default function FriendProfile({ friend, podcasts }) {
  const [podcastAccess, setPodcastAccess] = useState(
    podcasts.reduce((acc, podcast) => {
      acc[podcast.id] = podcast.accessLevel;
      return acc;
    }, {})
  );

  const [updateStatus, setUpdateStatus] = useState({
    isUpdating: false,
    success: false,
    error: null
  });

  const handleAccessChange = async (podcastId, newAccessLevel) => {
    // Update state for immediate UI feedback
    setPodcastAccess({
      ...podcastAccess,
      [podcastId]: newAccessLevel,
    });
    
    // Show updating status
    setUpdateStatus({
      isUpdating: true,
      success: false,
      error: null
    });
    
    // Send update to backend
    // In a real implementation, this would call an API
    try {
      await updatePodcastAccess(podcastId, newAccessLevel);
      
      // Show success message
      setUpdateStatus({
        isUpdating: false,
        success: true,
        error: null
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(prev => ({
          ...prev,
          success: false
        }));
      }, 3000);
    } catch (error) {
      console.error('Error updating access:', error);
      
      // Show error message
      setUpdateStatus({
        isUpdating: false,
        success: false,
        error: 'Failed to update access level. Please try again.'
      });
    }
  };

  return (
    <PasswordProtection friendId={friend.id} pageTitle={`${friend.name}'s Profile`}>
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
              <h1>{friend.name}'s Profile</h1>
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
            <h2>Your Conversation</h2>
            <p className={styles.accessNote}>
              You can control who gets to listen to your conversation with Irsyad by selecting
              one of the following access levels:
            </p>
            <ul className={styles.accessLevels}>
              <li><strong>Me Only:</strong> Only Irsyad can listen</li>
              <li><strong>Partner:</strong> Irsyad and his partner can listen</li>
              <li><strong>Public:</strong> Anyone can listen</li>
            </ul>
            
            {/* Status Messages */}
            {updateStatus.isUpdating && (
              <div className={styles.statusMessage + ' ' + styles.updating}>
                Updating access level...
              </div>
            )}
            {updateStatus.success && (
              <div className={styles.statusMessage + ' ' + styles.success}>
                Access level updated successfully!
              </div>
            )}
            {updateStatus.error && (
              <div className={styles.statusMessage + ' ' + styles.error}>
                {updateStatus.error}
              </div>
            )}
            
            <div className={styles.podcasts}>
              {podcasts.map((podcast) => (
                <div key={podcast.id} className={styles.podcastWithControls}>
                  <PodcastCard podcast={podcast} />
                  <div className={styles.accessControls}>
                    <label htmlFor={`access-${podcast.id}`}>Access Level:</label>
                    <select 
                      id={`access-${podcast.id}`}
                      value={podcastAccess[podcast.id]}
                      onChange={(e) => handleAccessChange(podcast.id, e.target.value)}
                      className={styles.accessSelect}
                    >
                      <option value="me">Me Only</option>
                      <option value="partner">Partner</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {podcasts.length === 0 && (
                <div className={styles.noPodcasts}>
                  <p>No conversations recorded yet. Contact Irsyad to schedule your session!</p>
                </div>
              )}
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
