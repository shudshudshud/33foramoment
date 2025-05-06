import { useState, useEffect } from 'react';
import styles from './PasswordProtection.module.css';

export default function PasswordProtection({ children, accessType = 'general', friendId = null, pageTitle = 'Protected Content' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug environment variables on component mount
  useEffect(() => {
    // Log all environment variables
    const allEnvVars = Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? '***' : null;
        return acc;
      }, {});

    // Special check for Malcolm's password
    const malcolmPassword = process.env.NEXT_PUBLIC_FRIEND_PASSWORD_MALCOLM;
    
    console.log('[DEBUG] Environment Variables Check:', {
      accessType,
      friendId,
      pageTitle,
      allEnvVars,
      malcolmPassword: malcolmPassword ? '***' : null,
      malcolmPasswordLength: malcolmPassword ? malcolmPassword.length : 0,
      malcolmPasswordType: typeof malcolmPassword,
      isMalcolmPasswordDefined: typeof malcolmPassword !== 'undefined',
      isMalcolmPasswordNull: malcolmPassword === null,
      isMalcolmPasswordEmpty: malcolmPassword === '',
      processEnvType: typeof process.env,
      processEnvKeys: Object.keys(process.env),
      nextPublicKeys: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
    });
  }, [accessType, friendId, pageTitle]);

  const getCorrectPassword = () => {
    if (friendId) {
      const envVarName = `NEXT_PUBLIC_FRIEND_PASSWORD_${friendId.toUpperCase()}`;
      const correctPassword = process.env[envVarName];
      
      console.log('[DEBUG] Friend password check:', {
        friendId,
        envVarName,
        hasPassword: !!correctPassword,
        correctPassword: correctPassword ? '***' : null,
        correctPasswordLength: correctPassword ? correctPassword.length : 0,
        correctPasswordType: typeof correctPassword,
        isPasswordDefined: typeof correctPassword !== 'undefined',
        isPasswordNull: correctPassword === null,
        isPasswordEmpty: correctPassword === '',
        allFriendPasswords: Object.keys(process.env)
          .filter(key => key.startsWith('NEXT_PUBLIC_FRIEND_PASSWORD_'))
          .reduce((acc, key) => {
            acc[key] = {
              exists: !!process.env[key],
              length: process.env[key] ? process.env[key].length : 0,
              type: typeof process.env[key]
            };
            return acc;
          }, {})
      });

      if (!correctPassword) {
        console.error('[ERROR] Missing friend password:', {
          friendId,
          envVarName,
          availableEnvVars: Object.keys(process.env)
            .filter(key => key.startsWith('NEXT_PUBLIC_'))
            .join(', '),
          processEnv: Object.keys(process.env),
          nextPublicEnv: Object.keys(process.env)
            .filter(key => key.startsWith('NEXT_PUBLIC_'))
            .map(key => ({ key, exists: !!process.env[key] }))
        });
        throw new Error(`Missing password configuration for ${friendId}`);
      }
      return correctPassword;
    }

    if (accessType === 'me') {
      const ownerPassword = process.env.NEXT_PUBLIC_OWNER_PASSWORD;
      console.log('[DEBUG] Owner password check:', {
        hasPassword: !!ownerPassword,
        password: ownerPassword ? '***' : null
      });
      if (!ownerPassword) {
        throw new Error('Missing owner password configuration');
      }
      return ownerPassword;
    }

    if (accessType === 'partner') {
      const partnerPassword = process.env.NEXT_PUBLIC_PARTNER_PASSWORD;
      console.log('[DEBUG] Partner password check:', {
        hasPassword: !!partnerPassword,
        password: partnerPassword ? '***' : null
      });
      if (!partnerPassword) {
        throw new Error('Missing partner password configuration');
      }
      return partnerPassword;
    }

    const generalPassword = process.env.NEXT_PUBLIC_PASSWORD;
    console.log('[DEBUG] General password check:', {
      hasPassword: !!generalPassword,
      password: generalPassword ? '***' : null
    });
    if (!generalPassword) {
      throw new Error('Missing general password configuration');
    }
    return generalPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const correctPassword = getCorrectPassword();
      if (password === correctPassword) {
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      console.error('[ERROR] Password verification failed:', err);
      setError(err.message);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    try {
      getCorrectPassword(); // This will throw if password is missing
      setIsLoading(false);
    } catch (err) {
      console.error('[ERROR] Initial password check failed:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  if (process.env.NEXT_PUBLIC_PASSWORD_PROTECTION === 'false') {
    return children;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <p>Please check your environment variables in Vercel.</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

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
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}