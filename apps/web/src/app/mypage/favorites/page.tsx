'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiTrash2 } from 'react-icons/fi';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PopupCard from '@/components/popup/PopupCard';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup } from '@popspot/types';
import styles from './favorites.module.css';

export default function FavoritesPage() {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuth();
    const supabase = getSupabaseClient();

    const [favorites, setFavorites] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('favorites')
            .select(`
                popup_id,
                popup:popups(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            const popups = data
                .map((f: any) => f.popup)
                .filter((p: any) => p !== null);
            setFavorites(popups);
        }
        setLoading(false);
    };

    const handleRemoveFavorite = async (popupId: string) => {
        if (!user) return;

        await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('popup_id', popupId);

        setFavorites(prev => prev.filter(p => p.id !== popupId));
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <FiArrowLeft size={20} />
                    </button>
                    <h1>찜한 팝업</h1>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                    </div>
                ) : favorites.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>💜</span>
                        <h2>찜한 팝업이 없어요</h2>
                        <p>마음에 드는 팝업을 찜해보세요!</p>
                        <Link href="/popups" className={styles.exploreBtn}>
                            팝업 둘러보기
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className={styles.count}>총 {favorites.length}개</p>
                        <div className={styles.grid}>
                            {favorites.map((popup) => (
                                <div key={popup.id} className={styles.cardWrapper}>
                                    <PopupCard popup={popup} />
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemoveFavorite(popup.id)}
                                        title="찜 취소"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
