'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiUser, FiHeart, FiMessageCircle, FiSettings, FiEdit,
    FiLogOut, FiChevronRight, FiBell, FiMap, FiShield
} from 'react-icons/fi';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/hooks/useAuth';
import styles from './mypage.module.css';

export default function MyPage() {
    const router = useRouter();
    const { isAuthenticated, profile, isLoading, logout } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !profile) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        {
            section: '내 활동',
            items: [
                { icon: FiHeart, label: '찜한 팝업', href: '/mypage/favorites', count: null },
                { icon: FiMessageCircle, label: '작성한 댓글', href: '/mypage/comments', count: null },
                { icon: FiMap, label: '저장한 경로', href: '/mypage/routes', count: null },
            ],
        },
        {
            section: '설정',
            items: [
                { icon: FiEdit, label: '프로필 수정', href: '/mypage/edit' },
                { icon: FiBell, label: '알림 설정', href: '/mypage/notifications' },
                { icon: FiShield, label: '비밀번호 변경', href: '/mypage/password' },
            ],
        },
        {
            section: '지원',
            items: [
                { icon: FiMessageCircle, label: '1:1 문의', href: '/mypage/inquiries' },
            ],
        },
    ];

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                {/* Profile Card */}
                <section className={styles.profileCard}>
                    <div className={styles.profileImage}>
                        {profile.profile_image_url ? (
                            <img src={profile.profile_image_url} alt={profile.nickname} />
                        ) : (
                            <FiUser size={40} />
                        )}
                    </div>
                    <div className={styles.profileInfo}>
                        <h1 className={styles.nickname}>{profile.nickname}</h1>
                        <p className={styles.email}>{profile.email}</p>
                        <span className={styles.badge}>
                            {profile.role === 'business' ? '🏢 사업자' : '👤 일반회원'}
                        </span>
                    </div>
                    <Link href="/mypage/edit" className={styles.editBtn}>
                        <FiSettings size={20} />
                    </Link>
                </section>

                {/* Menu Sections */}
                <div className={styles.menuSections}>
                    {menuItems.map((section) => (
                        <section key={section.section} className={styles.menuSection}>
                            <h2 className={styles.sectionTitle}>{section.section}</h2>
                            <div className={styles.menuList}>
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={styles.menuItem}
                                    >
                                        <div className={styles.menuIcon}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className={styles.menuLabel}>{item.label}</span>
                                        {'count' in item && item.count !== null && (
                                            <span className={styles.menuCount}>{item.count}</span>
                                        )}
                                        <FiChevronRight className={styles.chevron} size={18} />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Logout Button */}
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <FiLogOut size={20} />
                    로그아웃
                </button>

                {/* App Info */}
                <div className={styles.appInfo}>
                    <p>PopSpot v1.0.0</p>
                    <div className={styles.links}>
                        <Link href="/terms">이용약관</Link>
                        <span>|</span>
                        <Link href="/privacy">개인정보처리방침</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
