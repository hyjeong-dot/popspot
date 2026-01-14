'use client';

import { useState, useEffect } from 'react';
import { FiSend, FiTrash2, FiUser } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { CommentWithProfile } from '@popspot/types';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
    popupId: string;
}

export default function CommentSection({ popupId }: CommentSectionProps) {
    const { isAuthenticated, user, profile } = useAuth();
    const supabase = getSupabaseClient();

    const [comments, setComments] = useState<CommentWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [popupId]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                profile:profiles(id, nickname, profile_image_url)
            `)
            .eq('popup_id', popupId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setComments(data as CommentWithProfile[]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        const { error } = await supabase
            .from('comments')
            .insert({
                popup_id: popupId,
                user_id: user.id,
                content: newComment.trim(),
            });

        if (!error) {
            setNewComment('');
            fetchComments();
        }
        setSubmitting(false);
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (!error) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <div className={styles.container}>
            {/* Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.avatar}>
                        {profile?.profile_image_url ? (
                            <img src={profile.profile_image_url} alt="" />
                        ) : (
                            <FiUser size={20} />
                        )}
                    </div>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        className={styles.input}
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={!newComment.trim() || submitting}
                    >
                        <FiSend size={18} />
                    </button>
                </form>
            ) : (
                <div className={styles.loginPrompt}>
                    <p>댓글을 작성하려면 <a href="/login">로그인</a>하세요</p>
                </div>
            )}

            {/* Comments List */}
            <div className={styles.list}>
                {loading ? (
                    <div className={styles.loading}>댓글을 불러오는 중...</div>
                ) : comments.length === 0 ? (
                    <div className={styles.empty}>
                        <p>아직 댓글이 없습니다</p>
                        <span>첫 번째 댓글을 작성해보세요!</span>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentAvatar}>
                                {(comment as any).profile?.profile_image_url ? (
                                    <img src={(comment as any).profile.profile_image_url} alt="" />
                                ) : (
                                    <FiUser size={18} />
                                )}
                            </div>
                            <div className={styles.commentBody}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.nickname}>
                                        {(comment as any).profile?.nickname || '익명'}
                                    </span>
                                    <span className={styles.date}>
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                                <p className={styles.content}>{comment.content}</p>
                            </div>
                            {user?.id === comment.user_id && (
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(comment.id)}
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
