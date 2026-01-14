'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiHome, FiTrendingUp, FiMapPin, FiUsers, FiAlertTriangle,
    FiMessageSquare, FiBell, FiSettings, FiLogOut, FiChevronRight,
    FiPlus, FiClock
} from 'react-icons/fi';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import styles from './dashboard.module.css';

interface Stats {
    totalPopups: number;
    activePopups: number;
    totalUsers: number;
    pendingReports: number;
    pendingInquiries: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, profile, isLoading, logout } = useAdminAuth();
    const supabase = getSupabaseClient();

    const [stats, setStats] = useState<Stats>({
        totalPopups: 0,
        activePopups: 0,
        totalUsers: 0,
        pendingReports: 0,
        pendingInquiries: 0,
    });
    const [recentPopups, setRecentPopups] = useState<any[]>([]);
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchDashboardData();
        }
    }, [isAuthenticated, isAdmin]);

    const fetchDashboardData = async () => {
        setLoadingData(true);

        // Fetch counts
        const [popupsRes, activePopupsRes, usersRes, reportsRes, inquiriesRes] = await Promise.all([
            supabase.from('popups').select('id', { count: 'exact', head: true }),
            supabase.from('popups').select('id', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        setStats({
            totalPopups: popupsRes.count || 0,
            activePopups: activePopupsRes.count || 0,
            totalUsers: usersRes.count || 0,
            pendingReports: reportsRes.count || 0,
            pendingInquiries: inquiriesRes.count || 0,
        });

        // Fetch recent popups
        const { data: popups } = await supabase
            .from('popups')
            .select('id, title, brand, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
        setRecentPopups(popups || []);

        // Fetch recent reports
        const { data: reports } = await supabase
            .from('reports')
            .select(`
                id, type, created_at,
                popup:popups(title)
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5);
        setRecentReports(reports || []);

        setLoadingData(false);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading || !isAuthenticated || !isAdmin) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    🎪 PopSpot Admin
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin" className={`${styles.navItem} ${styles.active}`}>
                        <FiHome size={20} />
                        대시보드
                    </Link>
                    <Link href="/admin/popups" className={styles.navItem}>
                        <FiMapPin size={20} />
                        팝업 관리
                    </Link>
                    <Link href="/admin/users" className={styles.navItem}>
                        <FiUsers size={20} />
                        회원 관리
                    </Link>
                    <Link href="/admin/reports" className={styles.navItem}>
                        <FiAlertTriangle size={20} />
                        신고 관리
                        {stats.pendingReports > 0 && (
                            <span className={styles.badge}>{stats.pendingReports}</span>
                        )}
                    </Link>
                    <Link href="/admin/inquiries" className={styles.navItem}>
                        <FiMessageSquare size={20} />
                        문의 관리
                        {stats.pendingInquiries > 0 && (
                            <span className={styles.badge}>{stats.pendingInquiries}</span>
                        )}
                    </Link>
                    <Link href="/admin/notices" className={styles.navItem}>
                        <FiBell size={20} />
                        공지사항
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.adminInfo}>
                        <span className={styles.adminName}>{profile?.nickname}</span>
                        <span className={styles.adminRole}>관리자</span>
                    </div>
                    <button className={styles.logoutBtn} onClick={logout}>
                        <FiLogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>대시보드</h1>
                    <Link href="/admin/popups/new" className={styles.addBtn}>
                        <FiPlus size={18} />
                        새 팝업 등록
                    </Link>
                </header>

                {/* Stats Cards */}
                <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                            <FiMapPin size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>전체 팝업</span>
                            <span className={styles.statValue}>{stats.totalPopups}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <FiTrendingUp size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>진행중 팝업</span>
                            <span className={styles.statValue}>{stats.activePopups}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                            <FiUsers size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>전체 회원</span>
                            <span className={styles.statValue}>{stats.totalUsers}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            <FiAlertTriangle size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>대기중 신고</span>
                            <span className={styles.statValue}>{stats.pendingReports}</span>
                        </div>
                    </div>
                </section>

                <div className={styles.contentGrid}>
                    {/* Recent Popups */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>최근 등록된 팝업</h2>
                            <Link href="/admin/popups" className={styles.viewAll}>
                                전체보기 <FiChevronRight size={16} />
                            </Link>
                        </div>
                        <div className={styles.cardContent}>
                            {recentPopups.length === 0 ? (
                                <p className={styles.empty}>등록된 팝업이 없습니다</p>
                            ) : (
                                <ul className={styles.list}>
                                    {recentPopups.map((popup) => (
                                        <li key={popup.id}>
                                            <Link href={`/admin/popups/${popup.id}`} className={styles.listItem}>
                                                <div>
                                                    <span className={styles.itemTitle}>{popup.title}</span>
                                                    <span className={styles.itemSub}>{popup.brand}</span>
                                                </div>
                                                <span className={styles.itemDate}>
                                                    <FiClock size={12} />
                                                    {formatDate(popup.created_at)}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Pending Reports */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>대기중인 신고</h2>
                            <Link href="/admin/reports" className={styles.viewAll}>
                                전체보기 <FiChevronRight size={16} />
                            </Link>
                        </div>
                        <div className={styles.cardContent}>
                            {recentReports.length === 0 ? (
                                <p className={styles.empty}>대기중인 신고가 없습니다</p>
                            ) : (
                                <ul className={styles.list}>
                                    {recentReports.map((report) => (
                                        <li key={report.id}>
                                            <Link href={`/admin/reports/${report.id}`} className={styles.listItem}>
                                                <div>
                                                    <span className={styles.itemTitle}>
                                                        {(report.popup as any)?.title || '삭제된 팝업'}
                                                    </span>
                                                    <span className={styles.reportType}>{report.type}</span>
                                                </div>
                                                <span className={styles.itemDate}>
                                                    <FiClock size={12} />
                                                    {formatDate(report.created_at)}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
