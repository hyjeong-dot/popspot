'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiUser, FiLogOut, FiHeart, FiMenu, FiX, FiMap } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css';

export default function Header() {
    const router = useRouter();
    const { isAuthenticated, profile, logout, isLoading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/register');
    };

    const handleLogout = async () => {
        await logout();
        setProfileMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                🎪 PopSpot
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>홈</Link>
                <Link href="/popups" className={styles.navLink}>팝업찾기</Link>
                <Link href="/planner" className={styles.navLink}>플래너</Link>
                <Link href="/notices" className={styles.navLink}>공지사항</Link>
            </nav>

            {/* Auth Section */}
            <div className={styles.authSection}>
                {isLoading ? (
                    <div className={styles.skeleton} />
                ) : isAuthenticated ? (
                    <div className={styles.profileWrapper}>
                        <button
                            className={styles.profileBtn}
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        >
                            {profile?.profile_image_url ? (
                                <img
                                    src={profile.profile_image_url}
                                    alt={profile.nickname}
                                    className={styles.profileImage}
                                />
                            ) : (
                                <FiUser size={20} />
                            )}
                            <span className={styles.profileName}>
                                {profile?.nickname || '사용자'}
                            </span>
                        </button>

                        {profileMenuOpen && (
                            <div className={styles.profileMenu}>
                                <Link
                                    href="/mypage"
                                    className={styles.menuItem}
                                    onClick={() => setProfileMenuOpen(false)}
                                >
                                    <FiUser size={16} />
                                    마이페이지
                                </Link>
                                <Link
                                    href="/mypage/favorites"
                                    className={styles.menuItem}
                                    onClick={() => setProfileMenuOpen(false)}
                                >
                                    <FiHeart size={16} />
                                    찜 목록
                                </Link>
                                <Link
                                    href="/planner"
                                    className={styles.menuItem}
                                    onClick={() => setProfileMenuOpen(false)}
                                >
                                    <FiMap size={16} />
                                    경로 플래너
                                </Link>
                                <button
                                    className={styles.menuItem}
                                    onClick={handleLogout}
                                >
                                    <FiLogOut size={16} />
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <button className={styles.loginBtn} onClick={handleLogin}>
                            로그인
                        </button>
                        <button className={styles.signupBtn} onClick={handleSignup}>
                            회원가입
                        </button>
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/" className={styles.mobileNavLink}>홈</Link>
                    <Link href="/popups" className={styles.mobileNavLink}>팝업찾기</Link>
                    <Link href="/planner" className={styles.mobileNavLink}>플래너</Link>
                    <Link href="/notices" className={styles.mobileNavLink}>공지사항</Link>
                    {isAuthenticated ? (
                        <>
                            <Link href="/mypage" className={styles.mobileNavLink}>마이페이지</Link>
                            <button className={styles.mobileNavLink} onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.mobileNavLink}>로그인</Link>
                            <Link href="/register" className={styles.mobileNavLink}>회원가입</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
