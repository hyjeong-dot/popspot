'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiMessageSquare, FiCheck, FiX, FiSend,
    FiChevronLeft, FiChevronRight, FiClock, FiUser
} from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import styles from './inquiries.module.css';

export default function InquiriesManagementPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
    const supabase = getSupabaseClient();

    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchInquiries();
        }
    }, [isAuthenticated, isAdmin, page, statusFilter]);

    const fetchInquiries = async () => {
        setLoading(true);
        const offset = (page - 1) * limit;

        let query = supabase
            .from('inquiries')
            .select(`
                *,
                user:profiles(id, nickname, email, role)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data, count, error } = await query;

        if (!error) {
            setInquiries(data || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    };

    const handleReply = async (inquiryId: string) => {
        if (!replyContent.trim()) return;
        setSubmittingReply(true);

        const { error } = await (supabase
            .from('inquiries' as any)
            .update({
                answer: replyContent,
                answered_at: new Date().toISOString(),
                status: 'answered'
            } as any)
            .eq('id', inquiryId) as any);

        if (!error) {
            setReplyingTo(null);
            setReplyContent('');
            fetchInquiries();
        }
        setSubmittingReply(false);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ko-KR');
    };

    const totalPages = Math.ceil(totalCount / limit);

    if (isLoading || !isAuthenticated || !isAdmin) return null;

    return (
        <div className={styles.layout}>
            <Sidebar activeMenu="inquiries" />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>문의 관리</h1>
                </header>

                {/* Filters */}
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'pending' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('pending'); setPage(1); }}
                    >
                        답변 대기
                    </button>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'answered' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('answered'); setPage(1); }}
                    >
                        답변 완료
                    </button>
                    <button
                        className={`${styles.filterTab} ${statusFilter === 'all' ? styles.active : ''}`}
                        onClick={() => { setStatusFilter('all'); setPage(1); }}
                    >
                        전체
                    </button>
                </div>

                {/* Inquiries List */}
                <div className={styles.list}>
                    {loading ? (
                        <div className={styles.loading}>로딩 중...</div>
                    ) : inquiries.length === 0 ? (
                        <div className={styles.empty}>문의 내역이 없습니다</div>
                    ) : (
                        inquiries.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.userMeta}>
                                        <div className={styles.avatar}>
                                            <FiUser size={18} />
                                        </div>
                                        <div>
                                            <p className={styles.userName}>{item.user?.nickname}</p>
                                            <p className={styles.userEmail}>{item.user?.email}</p>
                                        </div>
                                        <span className={styles.userRole}>
                                            {item.user?.role === 'business' ? '사업자' : '일반'}
                                        </span>
                                    </div>
                                    <div className={styles.dateMeta}>
                                        <FiClock size={14} />
                                        {formatDate(item.created_at)}
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.inquiryTitle}>{item.title}</h3>
                                    <p className={styles.inquiryContent}>{item.content}</p>

                                    {item.status === 'answered' && (
                                        <div className={styles.answerSection}>
                                            <div className={styles.answerHeader}>
                                                <span className={styles.answerLabel}>답변 내용</span>
                                                <span className={styles.answerDate}>{formatDate(item.answered_at)}</span>
                                            </div>
                                            <p className={styles.answerText}>{item.answer}</p>
                                        </div>
                                    )}

                                    {item.status === 'pending' && replyingTo !== item.id && (
                                        <button
                                            className={styles.replyBtn}
                                            onClick={() => setReplyingTo(item.id)}
                                        >
                                            <FiMessageSquare size={16} />
                                            답변하기
                                        </button>
                                    )}

                                    {replyingTo === item.id && (
                                        <div className={styles.replyForm}>
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="답변 내용을 입력하세요..."
                                                rows={4}
                                            />
                                            <div className={styles.replyActions}>
                                                <button
                                                    className={styles.cancelBtn}
                                                    onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    className={styles.sendBtn}
                                                    onClick={() => handleReply(item.id)}
                                                    disabled={!replyContent.trim() || submittingReply}
                                                >
                                                    <FiSend size={16} />
                                                    {submittingReply ? '전송 중...' : '답변 전송'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
