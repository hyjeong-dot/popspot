'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave, FiAlertCircle } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import styles from './notice-form.module.css';

export default function NewNoticePage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
    const supabase = getSupabaseClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (isLoading || !isAuthenticated || !isAdmin) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        const { error } = await (supabase
            .from('notices' as any)
            .insert([{
                title,
                content,
                is_important: isImportant
            } as any]) as any);

        if (!error) {
            router.push('/notices');
        } else {
            alert('공지 등록에 실패했습니다.');
        }
        setSubmitting(false);
    };

    return (
        <div className={styles.layout}>
            <Sidebar activeMenu="notices" />

            <main className={styles.main}>
                <header className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <FiArrowLeft size={20} />
                    </button>
                    <h1>새 공지사항 작성</h1>
                </header>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="공지사항 제목을 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="공지사항 내용을 입력하세요"
                            rows={15}
                            required
                        />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isImportant}
                                onChange={(e) => setIsImportant(e.target.checked)}
                            />
                            중요 공지로 설정 (상단 노출 및 강조)
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => router.back()}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={submitting}
                        >
                            <FiSave size={18} />
                            {submitting ? '저장 중...' : '공지사항 게시'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
