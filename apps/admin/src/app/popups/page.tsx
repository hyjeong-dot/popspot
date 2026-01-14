'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiPlus, FiSearch, FiEdit, FiTrash2, FiEye,
    FiChevronLeft, FiChevronRight, FiFilter
} from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup } from '@popspot/types';
import styles from './popups.module.css';

export default function PopupsManagementPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
    const supabase = getSupabaseClient();

    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
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
            fetchPopups();
        }
    }, [isAuthenticated, isAdmin, page, statusFilter, searchQuery]);

    const fetchPopups = async () => {
        setLoading(true);
        const offset = (page - 1) * limit;

        let query = supabase
            .from('popups')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
        }

        const { data, count, error } = await query;

        if (!error) {
            setPopups(data as Popup[] || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('이 팝업을 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('popups')
            .update({ status: 'deleted' })
            .eq('id', id);

        if (!error) {
            fetchPopups();
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ko-KR');
    };

    const totalPages = Math.ceil(totalCount / limit);

    if (isLoading || !isAuthenticated || !isAdmin) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            <Sidebar activeMenu="popups" />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>팝업 관리</h1>
                    <Link href="/popups/new" className={styles.addBtn}>
                        <FiPlus size={18} />
                        새 팝업 등록
                    </Link>
                </header>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.searchWrapper}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            placeholder="팝업명, 브랜드명 검색..."
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.statusFilter}>
                        <FiFilter size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">전체 상태</option>
                            <option value="active">진행중</option>
                            <option value="ended">종료</option>
                            <option value="deleted">삭제됨</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>팝업명</th>
                                <th>브랜드</th>
                                <th>카테고리</th>
                                <th>지역</th>
                                <th>기간</th>
                                <th>상태</th>
                                <th>액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className={styles.loading}>
                                        로딩 중...
                                    </td>
                                </tr>
                            ) : popups.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.empty}>
                                        팝업이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                popups.map((popup) => (
                                    <tr key={popup.id}>
                                        <td>
                                            <span className={styles.title}>{popup.title}</span>
                                        </td>
                                        <td>{popup.brand}</td>
                                        <td>{popup.category}</td>
                                        <td>{popup.region}</td>
                                        <td>
                                            {formatDate(popup.start_date)} - {formatDate(popup.end_date)}
                                        </td>
                                        <td>
                                            <span className={`${styles.status} ${styles[popup.status]}`}>
                                                {popup.status === 'active' ? '진행중' :
                                                    popup.status === 'ended' ? '종료' : '삭제됨'}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <Link
                                                href={`/popups/${popup.id}`}
                                                className={styles.actionBtn}
                                                title="상세보기"
                                            >
                                                <FiEye size={16} />
                                            </Link>
                                            <Link
                                                href={`/popups/${popup.id}/edit`}
                                                className={styles.actionBtn}
                                                title="수정"
                                            >
                                                <FiEdit size={16} />
                                            </Link>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDelete(popup.id)}
                                                title="삭제"
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
