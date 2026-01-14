'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiAlertTriangle, FiCheck, FiX, FiEye,
    FiChevronLeft, FiChevronRight, FiClock
} from 'react-icons/fi';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import styles from './reports.module.css';
import { ProcessStatus, Database } from '@popspot/types';
import { SupabaseClient } from '@supabase/supabase-js';

export default function ReportsManagementPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
    const supabase = getSupabaseClient() as SupabaseClient<Database>;

    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchReports();
        }
    }, [isAuthenticated, isAdmin, page, statusFilter]);

    const fetchReports = async () => {
        setLoading(true);
        const offset = (page - 1) * limit;

        let query = supabase
            .from('reports')
            .select(`
                *,
                popup:popups(id, title),
                user:profiles(id, nickname, email)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter as any);
        }

        const { data, count, error } = await query;

        if (!error) {
            setReports(data || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    };

    const handleStatusChange = async (reportId: string, newStatus: ProcessStatus) => {
        if (newStatus === 'pending') return;

        const { error } = await (supabase
            .from('reports') as any)
            .update({
                status: newStatus,
                processed_at: new Date().toISOString()
            })
            .eq('id', reportId);

        if (!error) {
            fetchReports();
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getReportTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            wrong_info: '잘못된 정보',
            ended: '이미 종료됨',
            duplicate: '중복 게시물',
            spam: '스팸/광고',
            other: '기타',
        };
        return types[type] || type;
    };

    const totalPages = Math.ceil(totalCount / limit);

    if (isLoading || !isAuthenticated || !isAdmin) return null;

    return (
        <div className={styles.layout}>
            <Sidebar activeMenu="reports" />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>신고 관리</h1>
                </header>

                {/* Filters */}
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'pending' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('pending'); setPage(1); }}
                    >
                        처리 대기
                    </button>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'processed' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('processed'); setPage(1); }}
                    >
                        처리 완료
                    </button>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'ignored' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('ignored'); setPage(1); }}
                    >
                        무시됨
                    </button>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'all' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('all'); setPage(1); }}
                    >
                        전체
                    </button>
                </div>

                {/* Reports List */}
                <div className={styles.reportsList}>
                    {loading ? (
                        <div className={styles.loading}>로딩 중...</div>
                    ) : reports.length === 0 ? (
                        <div className={styles.empty}>신고 내역이 없습니다</div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className={styles.reportCard}>
                                <div className={styles.reportHeader}>
                                    <div className={styles.reportMeta}>
                                        <span className={styles.reportType}>
                                            {getReportTypeLabel(report.type)}
                                        </span>
                                        <span className={styles.reportDate}>
                                            <FiClock size={14} />
                                            {formatDate(report.created_at)}
                                        </span>
                                    </div>
                                    {report.status === 'pending' && (
                                        <div className={styles.reportActions}>
                                            <button
                                                className={styles.approveBtn}
                                                onClick={() => handleStatusChange(report.id, 'processed')}
                                                title="처리 완료"
                                            >
                                                <FiCheck size={18} />
                                                처리
                                            </button>
                                            <button
                                                className={styles.rejectBtn}
                                                onClick={() => handleStatusChange(report.id, 'ignored')}
                                                title="무시"
                                            >
                                                <FiX size={18} />
                                                무시
                                            </button>
                                        </div>
                                    )}
                                    {report.status !== 'pending' && (
                                        <span className={`${styles.statusBadge} ${styles[report.status]}`}>
                                            {report.status === 'processed' ? '처리됨' : '무시됨'}
                                        </span>
                                    )}
                                </div>

                                <div className={styles.reportContent}>
                                    <div className={styles.targetInfo}>
                                        <span className={styles.label}>신고 대상 팝업:</span>
                                        <Link href={`/popups/${report.popup?.id}`} className={styles.targetLink}>
                                            {report.popup?.title || '삭제된 팝업'}
                                            <FiEye size={14} />
                                        </Link>
                                    </div>

                                    {report.description && (
                                        <div className={styles.reportDesc}>
                                            <p>{report.description}</p>
                                        </div>
                                    )}

                                    <div className={styles.reporterInfo}>
                                        <span className={styles.label}>신고자:</span>
                                        <span>{report.user?.nickname} ({report.user?.email})</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        <span className={styles.pageInfo}>
                            {page} / {totalPages}
                        </span>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <FiChevronRight size={18} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
