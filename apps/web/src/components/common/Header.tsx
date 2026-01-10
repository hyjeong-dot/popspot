import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                PopSpot
            </Link>

            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>홈</Link>
                <Link href="/popups" className={styles.navLink}>팝업찾기</Link>
                <Link href="/planner" className={styles.navLink}>플래너</Link>
                <Link href="/community" className={styles.navLink}>커뮤니티</Link>
            </nav>

            <div className={styles.authButtons}>
                <button className={styles.loginBtn}>로그인</button>
                <button className={styles.signupBtn}>회원가입</button>
            </div>
        </header>
    );
}
