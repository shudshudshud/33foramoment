import Link from 'next/link';
import styles from './Layout.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          33 for a Moment
        </Link>
        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/public">Public</Link>
          <Link href="/partner">Partner</Link>
          <Link href="/me">Irsyad Only</Link>
          <Link href="/friends">Friends</Link>
        </div>
      </nav>
    </header>
  );
}