'use client';

import Link from 'next/link';
import {
    FiHome, FiMapPin, FiUsers, FiAlertTriangle,
    FiMessageSquare, FiBell, FiLogOut
} from 'react-icons/fi';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import styles from './Sidebar.module.css';

interface SidebarProps {
    activeMenu: 'dashboard' | 'popups' | 'users' | 'reports' | 'inquiries' | 'notices';
}

export default function Sidebar({ activeMenu }: SidebarProps) {
    const { profile, logout } = useAdminAuth();

    const menuItems = [
        { id: 'dashboard', label: '대시보드', icon: FiHome, href: '/' },
        { id: 'popups', label: '팝업 관리', icon: FiMapPin, href: '/popups' },
        { id: 'users', label: '회원 관리', icon: FiUsers, href: '/users' },
        { id: 'reports', label: '신고 관리', icon: FiAlertTriangle, href: '/reports' },
        { id: 'inquiries', label: '문의 관리', icon: FiMessageSquare, href: '/inquiries' },
        { id: 'notices', label: '공지사항', icon: FiBell, href: '/notices' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                🎪 PopSpot Admin
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`${styles.navItem} ${activeMenu === item.id ? styles.active : ''}`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                <div className={styles.adminInfo}>
                    <p className={styles.adminName}>{profile?.nickname || '관리자'}</p>
                    <p className={styles.adminRole}>System Admin</p>
                </div>
                <button className={styles.logoutBtn} onClick={logout} title="로그아웃">
                    <FiLogOut size={18} />
                </button>
            </div>
        </aside>
    );
}
