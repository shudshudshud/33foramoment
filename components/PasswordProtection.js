import { useState, useEffect } from 'react';
import styles from './PasswordProtection.module.css';

export default function PasswordProtection({ children, accessType = 'general', friendId = null, pageTitle = 'Protected Content' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authKey = friendId 
        ? `auth_friend_${friendId}`
        : `auth_${accessType}`;
      
      const storedAuth = localStorage.getItem(authKey);
      setIsAuthenticated(storedAuth === 'true');
      setIsLoading(false);
    };
    
    checkAuth();
  }, [accessType, friendId]);

  const getCorrectPassword = () => {
    if (friendId) {
      const envVarName = `NEXT_PUBLIC_FRIEND_PASSWORD_${friendId.toUpperCase()}`;
      const correctPassword = process.env[envVarName];
      
      if (!correctPassword) {
        console.error(`[ERROR] Missing environment variable: ${envVarName}`);
        throw new Error(`Missing password configuration for ${friendId}`);
      }
      
      return correctPassword;
    }

    // For non-friend access
    switch (accessType) {
      case 'me':
        if (!process.env.NEXT_PUBLIC_OWNER_PASSWORD) {
          throw new Error('Missing owner password configuration');
        }
        return process.env.NEXT_PUBLIC_OWNER_PASSWORD;
      case 'partner':
        if (!process.env.NEXT_PUBLIC_PARTNER_PASSWORD) {
          throw new Error('Missing partner password configuration');
        }
        return process.env.NEXT_PUBLIC_PARTNER_PASSWORD;
      default:
        if (!process.env.NEXT_PUBLIC_PASSWORD) {
          throw new Error('Missing general password configuration');
        }
        return process.env.NEXT_PUBLIC_PASSWORD;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const correctPassword = getCorrectPassword();
      
      if (password === correctPassword) {
        const authKey = friendId 
          ? `auth_friend_${friendId}`
          : `auth_${accessType}`;
        
        localStorage.setItem(authKey, 'true');
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      console.error('[ERROR] Authentication error:', err);
      setError(err.message || 'Authentication configuration error. Please contact support.');
    }
  };

  // Early returns for different states
  if (process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'false') {
    return children;
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  // Password form
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{pageTitle}</h2>
        <p>Please enter the password to access this content.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={styles.input}
          autoComplete="current-password"
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}