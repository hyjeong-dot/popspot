'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiBell, FiCheck, FiX, FiEdit, FiTrash2,
    FiPlus, FiChevronLeft, FiChevronRight, FiAlertCircle
} from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Notice } from '@popspot/types';
import styles from './notices.module.css';

export default function NoticesManagementPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
    const supabase = getSupabaseClient();

    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
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
            fetchNotices();
        }
    }, [isAuthenticated, isAdmin, page]);

    const fetchNotices = async () => {
        setLoading(true);
        const offset = (page - 1) * limit;

        const { data, count, error } = await supabase
            .from('notices')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (!error && data) {
            setNotices(data as Notice[]);
            setTotalCount(count || 0);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;
        const { error } = await supabase.from('notices').delete().eq('id', id);
        if (!error) {
            fetchNotices();
        }
    };

    const totalPages = Math.ceil(totalCount / limit);

    if (isLoading || !isAuthenticated || !isAdmin) return null;

    return (
        <div className={styles.layout}>
            <Sidebar activeMenu="notices" />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>공지사항 관리</h1>
                    <button className={styles.addBtn} onClick={() => router.push('/notices/new')}>
                        <FiPlus size={18} />
                        공지 등록
                    </button>
                </header>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>중요</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className={styles.loading}>로딩 중...</td></tr>
                            ) : notices.length === 0 ? (
                                <tr><td colSpan={4} className={styles.empty}>공지사항이 없습니다</td></tr>
                            ) : (
                                notices.map(notice => (
                                    <tr key={notice.id}>
                                        <td>{notice.is_important && <FiAlertCircle className={styles.important} size={18} />}</td>
                                        <td className={styles.title}>{notice.title}</td>
                                        <td>{new Date(notice.created_at).toLocaleDateString()}</td>
                                        <td className={styles.actions}>
                                            <button className={styles.actionBtn}><FiEdit size={16} /></button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDelete(notice.id)}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        <span className={styles.pageInfo}>{page} / {totalPages}</span>
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
