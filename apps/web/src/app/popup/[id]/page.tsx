'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    FiHeart, FiShare2, FiMapPin, FiClock, FiCalendar,
    FiGlobe, FiInstagram, FiFlag, FiEdit, FiArrowLeft,
    FiChevronLeft, FiChevronRight, FiMessageCircle
} from 'react-icons/fi';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CommentSection from '@/components/popup/CommentSection';
import ReportModal from '@/components/popup/ReportModal';
import KakaoMap from '@/components/common/KakaoMap';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup } from '@popspot/types';
import styles from './popup-detail.module.css';

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

export default function PopupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const supabase = getSupabaseClient();

    const [popup, setPopup] = useState<Popup | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    useEffect(() => {
        const fetchPopup = async () => {
            if (!params.id) return;

            const { data, error } = await supabase
                .from('popups')
                .select('*')
                .eq('id', params.id as string)
                .single();

            if (error || !data) {
                console.warn('Popup not found in Supabase, checking mock data');
                const { mockPopups } = await import('@/data/mockPopups');
                const mockData = mockPopups.find(p => p.id === params.id);
                if (mockData) {
                    setPopup(mockData);
                }
            } else {
                setPopup(data as Popup);
            }
            setLoading(false);
        };

        fetchPopup();
    }, [params.id, supabase]);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!isAuthenticated || !user || !popup) return;

            const { data } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', user.id)
                .eq('popup_id', popup.id)
                .single();

            setIsFavorited(!!data);
        };

        checkFavorite();
    }, [isAuthenticated, user, popup, supabase]);

    const handleFavorite = async () => {
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        if (!popup) return;

        try {
            if (isFavorited) {
                await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('popup_id', popup.id);
                setIsFavorited(false);
            } else {
                await (supabase
                    .from('favorites' as any)
                    .insert({ user_id: user.id, popup_id: popup.id } as any) as any);
                setIsFavorited(true);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: popup?.title,
                    text: popup?.description,
                    url,
                });
            } catch (error) {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(url);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 2000);
        }
    };

    const nextImage = () => {
        if (popup?.images && popup.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % popup.images.length);
        }
    };

    const prevImage = () => {
        if (popup?.images && popup.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + popup.images.length) % popup.images.length);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatus = () => {
        if (!popup) return null;
        const now = new Date();
        const start = new Date(popup.start_date);
        const end = new Date(popup.end_date);

        if (now < start) {
            const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return { label: `오픈 D-${daysUntil}`, type: 'upcoming' };
        }
        if (now > end) {
            return { label: '종료됨', type: 'ended' };
        }
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7) {
            return { label: `마감 D-${daysLeft}`, type: 'ending' };
        }
        return { label: '진행중', type: 'active' };
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>팝업 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!popup) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.notFound}>
                    <h1>팝업을 찾을 수 없습니다</h1>
                    <p>요청하신 팝업스토어 정보가 존재하지 않습니다.</p>
                    <Link href="/popups" className={styles.backBtn}>
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const status = getStatus();

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                {/* Back Button */}
                <button className={styles.backLink} onClick={() => router.back()}>
                    <FiArrowLeft size={20} />
                    뒤로가기
                </button>

                <div className={styles.layout}>
                    {/* Left: Images */}
                    <div className={styles.imageSection}>
                        <div className={styles.gallery}>
                            <Image
                                src={popup.images?.[currentImageIndex] || '/images/placeholder.png'}
                                alt={popup.title}
                                fill
                                className={styles.mainImage}
                            />
                            {popup.images && popup.images.length > 1 && (
                                <>
                                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>
                                        <FiChevronLeft size={24} />
                                    </button>
                                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>
                                        <FiChevronRight size={24} />
                                    </button>
                                    <div className={styles.dots}>
                                        {popup.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                className={`${styles.dot} ${idx === currentImageIndex ? styles.active : ''}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {status && (
                                <span className={`${styles.status} ${styles[status.type]}`}>
                                    {status.label}
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {popup.images && popup.images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {popup.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.thumbnail} ${idx === currentImageIndex ? styles.active : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    >
                                        <Image src={img} alt="" fill />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className={styles.infoSection}>
                        <span className={styles.category}>
                            {categoryLabels[popup.category] || popup.category}
                        </span>
                        <h1 className={styles.title}>{popup.title}</h1>
                        <p className={styles.brand}>{popup.brand}</p>

                        <div className={styles.actions}>
                            <button
                                className={`${styles.actionBtn} ${isFavorited ? styles.favorited : ''}`}
                                onClick={handleFavorite}
                            >
                                <FiHeart size={20} />
                                {isFavorited ? '찜 취소' : '찜하기'}
                            </button>
                            <button className={styles.actionBtn} onClick={handleShare}>
                                <FiShare2 size={20} />
                                공유
                            </button>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.detailItem}>
                                <FiCalendar className={styles.detailIcon} />
                                <div>
                                    <span className={styles.detailLabel}>기간</span>
                                    <span className={styles.detailValue}>
                                        {formatDate(popup.start_date)} ~ {formatDate(popup.end_date)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <FiClock className={styles.detailIcon} />
                                <div>
                                    <span className={styles.detailLabel}>운영시간</span>
                                    <span className={styles.detailValue}>
                                        {popup.hours || '정보 없음'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <FiMapPin className={styles.detailIcon} />
                                <div>
                                    <span className={styles.detailLabel}>위치</span>
                                    <span className={styles.detailValue}>
                                        {popup.address}
                                    </span>
                                </div>
                            </div>

                            {popup.website && (
                                <div className={styles.detailItem}>
                                    <FiGlobe className={styles.detailIcon} />
                                    <div>
                                        <span className={styles.detailLabel}>웹사이트</span>
                                        <a
                                            href={popup.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.detailLink}
                                        >
                                            방문하기
                                        </a>
                                    </div>
                                </div>
                            )}

                            {popup.instagram && (
                                <div className={styles.detailItem}>
                                    <FiInstagram className={styles.detailIcon} />
                                    <div>
                                        <span className={styles.detailLabel}>인스타그램</span>
                                        <a
                                            href={`https://instagram.com/${popup.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.detailLink}
                                        >
                                            {popup.instagram}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.description}>
                            <h3>소개</h3>
                            <p>{popup.description}</p>
                        </div>

                        <div className={styles.subActions}>
                            <button
                                className={styles.subActionBtn}
                                onClick={() => setShowReportModal(true)}
                            >
                                <FiFlag size={16} />
                                신고하기
                            </button>
                            <Link href={`/popup/${popup.id}/suggest`} className={styles.subActionBtn}>
                                <FiEdit size={16} />
                                수정 제안
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <section className={styles.mapSection}>
                    <h2 className={styles.sectionTitle}>
                        <FiMapPin size={20} />
                        위치
                    </h2>
                    <div className={styles.mapContainer}>
                        <KakaoMap
                            address={popup.address}
                            title={popup.title}
                            className={styles.map}
                        />
                    </div>
                    <div className={styles.mapActions}>
                        <p className={styles.mapAddress}>{popup.address}</p>
                        <a
                            href={`https://map.kakao.com/link/search/${encodeURIComponent(popup.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mapLink}
                        >
                            카카오맵에서 큰 지도로 보기
                        </a>
                    </div>
                </section>

                {/* Comments Section */}
                <section className={styles.commentSection}>
                    <h2 className={styles.sectionTitle}>
                        <FiMessageCircle size={20} />
                        댓글 ({popup.comment_count})
                    </h2>
                    <CommentSection popupId={popup.id} />
                </section>
            </main>

            <Footer />

            {/* Report Modal */}
            {showReportModal && (
                <ReportModal
                    popupId={popup.id}
                    onClose={() => setShowReportModal(false)}
                />
            )}

            {/* Share Toast */}
            {showShareToast && (
                <div className={styles.toast}>
                    링크가 복사되었습니다!
                </div>
            )}
        </div>
    );
}
