'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import styles from './comments.module.css';

export default function MyCommentsPage() {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuth();
    const supabase = getSupabaseClient();

    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user) {
            fetchComments();
        }
    }, [user]);

    const fetchComments = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                popup:popups(id, title)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setComments(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;
        const { error } = await supabase.from('comments').delete().eq('id', id);
        if (!error) {
            setComments(prev => prev.filter(c => c.id !== id));
        }
    };

    if (isLoading || !isAuthenticated) return null;

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <FiArrowLeft size={20} />
                    </button>
                    <h1>내가 작성한 댓글</h1>
                </div>

                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : comments.length === 0 ? (
                    <div className={styles.empty}>
                        <FiMessageCircle size={48} />
                        <p>작성한 댓글이 없습니다.</p>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {comments.map(comment => (
                            <div key={comment.id} className={styles.card}>
                                <div className={styles.popupLink} onClick={() => router.push(`/popup/${comment.popup?.id}`)}>
                                    {comment.popup?.title || '삭제된 팝업'}
                                </div>
                                <p className={styles.content}>{comment.content}</p>
                                <div className={styles.footer}>
                                    <span className={styles.date}>{new Date(comment.created_at).toLocaleDateString()}</span>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(comment.id)}>
                                        <FiTrash2 size={16} /> 삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
