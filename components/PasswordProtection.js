import { useState, useEffect } from 'react';
import styles from './PasswordProtection.module.css';

// Centralized password configuration
const PASSWORD_CONFIG = {
  owner: process.env.NEXT_PUBLIC_OWNER_PASSWORD,
  partner: process.env.NEXT_PUBLIC_PARTNER_PASSWORD,
  general: process.env.NEXT_PUBLIC_PASSWORD,
  friends: {
    malcolm: process.env.NEXT_PUBLIC_FRIEND_PASSWORD_malcolm,
    venessa: process.env.NEXT_PUBLIC_FRIEND_PASSWORD_venessa,
    'friend-example': process.env.NEXT_PUBLIC_FRIEND_PASSWORD_friend_example,
  }
};

export default function PasswordProtection({ children, accessType = 'general', friendId = null, pageTitle = 'Protected Content' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify password configuration on mount
  useEffect(() => {
    try {
      if (process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'false') {
        setIsLoading(false);
        return;
      }

      // Check if the required password exists
      if (friendId) {
        if (!PASSWORD_CONFIG.friends[friendId]) {
          throw new Error(`Missing password configuration for ${friendId}`);
        }
      } else if (!PASSWORD_CONFIG[accessType]) {
        throw new Error(`Missing password configuration for ${accessType}`);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('[Password Protection Error]', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [accessType, friendId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    try {
      let correctPassword;
      
      if (friendId) {
        correctPassword = PASSWORD_CONFIG.friends[friendId];
      } else {
        correctPassword = PASSWORD_CONFIG[accessType];
      }

      if (!correctPassword) {
        throw new Error('Password configuration error');
      }

      if (password === correctPassword) {
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      console.error('[Password Verification Error]', err);
      setError(err.message);
    }
  };

  // Skip protection if disabled
  if (process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'false') {
    return children;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <p>Please check your environment variables in Vercel.</p>
        </div>
      </div>
    );
  }

  // Show authenticated content
  if (isAuthenticated) {
    return children;
  }

  // Show password form
  return (
    <div className={styles.container}>
      <h2>{pageTitle}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={styles.input}
          autoComplete="off"
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}