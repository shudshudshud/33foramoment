import { useState, useEffect } from 'react';
import { verifyPassword } from '../lib/clientData';
import styles from './PasswordProtection.module.css';

export default function PasswordProtection({ children, pageId }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      // If no pageId is specified, use 'global' as default
      const authKey = `auth_${pageId || 'global'}`;
      const storedAuth = localStorage.getItem(authKey);
      
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    // Execute the check auth function
    checkAuth();
  }, [pageId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Check if password is correct
    if (verifyPassword(password)) {
      setIsAuthenticated(true);
      
      // Save authentication status to localStorage
      const authKey = `auth_${pageId || 'global'}`;
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
        <h2>Protected Content</h2>
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