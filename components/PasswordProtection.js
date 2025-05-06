import { useState, useEffect } from 'react';
import styles from './PasswordProtection.module.css';

export default function PasswordProtection({ children, accessType = 'general', friendId = null, pageTitle = 'Protected Content' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      // Create a unique auth key based on access type and friend ID (if applicable)
      const authKey = friendId 
        ? `auth_friend_${friendId}`
        : `auth_${accessType}`;
      
      const storedAuth = localStorage.getItem(authKey);
      
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    // Execute the check auth function
    checkAuth();
  }, [accessType, friendId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Determine which verification method to use
    let isPasswordCorrect = false;
    
    if (friendId) {
      // Each friend has their own dedicated environment variable
      // Format: NEXT_PUBLIC_FRIEND_PASSWORD_[FRIENDID]
      const envVarName = `NEXT_PUBLIC_FRIEND_PASSWORD_${friendId.toUpperCase()}`;
      const correctPassword = process.env[envVarName];
      
      console.log('[DEBUG] Friend authentication:', { 
        friendId,
        envVarName,
        hasPassword: !!correctPassword
      });
      
      isPasswordCorrect = password === correctPassword;
    } else {
      // For non-friend access, use the existing environment variables
      let correctPassword;
      
      switch (accessType) {
        case 'me':
          correctPassword = process.env.NEXT_PUBLIC_OWNER_PASSWORD;
          break;
        case 'partner':
          correctPassword = process.env.NEXT_PUBLIC_PARTNER_PASSWORD;
          break;
        default:
          correctPassword = process.env.NEXT_PUBLIC_PASSWORD;
      }
      
      isPasswordCorrect = password === correctPassword;
    }
    
    if (isPasswordCorrect) {
      setIsAuthenticated(true);
      
      // Save authentication status to localStorage with the appropriate key
      const authKey = friendId 
        ? `auth_friend_${friendId}`
        : `auth_${accessType}`;
      
      localStorage.setItem(authKey, 'true');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  // If password protection is disabled in environment
  if (process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'false') {
    return children;
  }

  // If component is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // If user is authenticated, render children
  if (isAuthenticated) {
    return children;
  }

  // Otherwise, show password form
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
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}