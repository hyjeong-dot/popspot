'use client';

import { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { ReportType } from '@popspot/types';
import styles from './ReportModal.module.css';

interface ReportModalProps {
    popupId: string;
    onClose: () => void;
}

const reportTypes: { value: ReportType; label: string; description: string }[] = [
    { value: 'wrong_info', label: '잘못된 정보', description: '주소, 날짜, 운영시간 등이 틀렸어요' },
    { value: 'ended', label: '이미 종료됨', description: '팝업스토어가 이미 끝났어요' },
    { value: 'duplicate', label: '중복 게시물', description: '같은 팝업이 여러 개 있어요' },
    { value: 'spam', label: '스팸/광고', description: '관련 없는 광고예요' },
    { value: 'other', label: '기타', description: '다른 이유로 신고해요' },
];

export default function ReportModal({ popupId, onClose }: ReportModalProps) {
    const { isAuthenticated, user } = useAuth();
    const supabase = getSupabaseClient();

    const [selectedType, setSelectedType] = useState<ReportType | null>(null);
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!selectedType || !user) return;

        setSubmitting(true);
        setError('');

        const { error: submitError } = await supabase
            .from('reports')
            .insert({
                popup_id: popupId,
                user_id: user.id,
                type: selectedType,
                description: description.trim() || null,
            });

        if (submitError) {
            setError('신고 접수 중 오류가 발생했습니다.');
            setSubmitting(false);
            return;
        }

        setSubmitted(true);
        setSubmitting(false);
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <div className={styles.header}>
                        <h2>신고하기</h2>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <FiX size={20} />
                        </button>
                    </div>
                    <div className={styles.loginPrompt}>
                        <FiAlertCircle size={48} />
                        <p>신고하려면 로그인이 필요합니다</p>
                        <a href="/login" className={styles.loginBtn}>
                            로그인하기
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <div className={styles.success}>
                        <span className={styles.successIcon}>✅</span>
                        <h3>신고가 접수되었습니다</h3>
                        <p>관리자가 검토 후 처리할 예정입니다.</p>
                        <button className={styles.confirmBtn} onClick={onClose}>
                            확인
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>신고하기</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.subtitle}>신고 사유를 선택해주세요</p>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.typeList}>
                        {reportTypes.map(type => (
                            <label
                                key={type.value}
                                className={`${styles.typeItem} ${selectedType === type.value ? styles.selected : ''
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="reportType"
                                    value={type.value}
                                    checked={selectedType === type.value}
                                    onChange={() => setSelectedType(type.value)}
                                />
                                <div className={styles.typeContent}>
                                    <span className={styles.typeLabel}>{type.label}</span>
                                    <span className={styles.typeDesc}>{type.description}</span>
                                </div>
                            </label>
                        ))}
                    </div>

                    {selectedType === 'other' && (
                        <textarea
                            className={styles.textarea}
                            placeholder="신고 사유를 자세히 적어주세요..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                        />
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        취소
                    </button>
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={!selectedType || submitting}
                    >
                        {submitting ? '제출 중...' : '신고하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
