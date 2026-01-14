'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup } from '@popspot/types';
import styles from './PopupCard.module.css';

interface PopupCardProps {
    popup: Popup;
    viewMode?: 'grid' | 'list';
}

const categoryLabels: Record<string, string> = {
    fashion: '패션',
    beauty: '뷰티',
    character: '캐릭터',
    food: '푸드',
    lifestyle: '라이프스타일',
    art: '아트',
    entertainment: '엔터테인먼트',
    other: '기타',
};

export default function PopupCard({ popup, viewMode = 'grid' }: PopupCardProps) {
    const { isAuthenticated, user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(false);
    const [likesCount, setLikesCount] = useState(popup.likes_count);
    const supabase = getSupabaseClient();

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || !user) {
            // Redirect to login
            window.location.href = '/login';
            return;
        }

        try {
            if (isFavorited) {
                await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('popup_id', popup.id);
                setIsFavorited(false);
                setLikesCount(prev => prev - 1);
            } else {
                await supabase
                    .from('favorites')
                    .insert({ user_id: user.id, popup_id: popup.id });
                setIsFavorited(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const formatDate = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const formatDate = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const getStatus = () => {
        const now = new Date();
        const start = new Date(popup.start_date);
        const end = new Date(popup.end_date);

        if (now < start) {
            const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return { label: `D-${daysUntil}`, type: 'upcoming' };
        }
        if (now > end) {
            return { label: '종료', type: 'ended' };
        }
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7) {
            return { label: `마감 D-${daysLeft}`, type: 'ending' };
        }
        return { label: '진행중', type: 'active' };
    };

    const status = getStatus();

    return (
        <Link
            href={`/popup/${popup.id}`}
            className={`${styles.card} ${viewMode === 'list' ? styles.listCard : ''}`}
        >
            <div className={styles.imageWrapper}>
                <Image
                    src={popup.images?.[0] || '/images/placeholder.png'}
                    alt={popup.title}
                    fill
                    className={styles.image}
                />
                <span className={`${styles.status} ${styles[status.type]}`}>
                    {status.label}
                </span>
                <button
                    className={`${styles.favoriteBtn} ${isFavorited ? styles.favorited : ''}`}
                    onClick={handleFavorite}
                    aria-label={isFavorited ? '찜 취소' : '찜하기'}
                >
                    <FiHeart size={18} />
                </button>
            </div>

            <div className={styles.content}>
                <span className={styles.category}>
                    {categoryLabels[popup.category] || popup.category}
                </span>
                <h3 className={styles.title}>{popup.title}</h3>
                <p className={styles.brand}>{popup.brand}</p>

                <div className={styles.info}>
                    <span className={styles.infoItem}>
                        <FiCalendar size={14} />
                        {formatDate(popup.start_date, popup.end_date)}
                    </span>
                    <span className={styles.infoItem}>
                        <FiMapPin size={14} />
                        {popup.region}
                    </span>
                </div>

                <div className={styles.footer}>
                    <span className={styles.likes}>
                        <FiHeart size={14} />
                        {likesCount}
                    </span>
                </div>
            </div>
        </Link>
    );
}
