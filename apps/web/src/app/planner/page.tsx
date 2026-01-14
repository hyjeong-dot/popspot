'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiMap, FiPlus, FiTrash2, FiNavigation,
    FiArrowLeft, FiMoreVertical, FiMenu
} from 'react-icons/fi';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup } from '@popspot/types';
import styles from './planner.module.css';

// Sortable Item Component
function SortablePopupItem({ popup, onRemove }: { popup: Popup; onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: popup.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.routeItem}>
            <div {...attributes} {...listeners} className={styles.dragHandle}>
                <FiMenu size={18} />
            </div>
            <div className={styles.itemInfo}>
                <h4 className={styles.itemTitle}>{popup.title}</h4>
                <p className={styles.itemAddress}>{popup.address}</p>
            </div>
            <button className={styles.removeBtn} onClick={() => onRemove(popup.id)}>
                <FiX size={16} />
            </button>
        </div>
    );
}

const FiX = ({ size }: { size: number }) => <FiTrash2 size={size} />;

export default function PlannerPage() {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuth();
    const supabase = getSupabaseClient();

    const [selectedPopups, setSelectedPopups] = useState<Popup[]>([]);
    const [favorites, setFavorites] = useState<Popup[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
            .select('popup:popups(*)')
            .eq('user_id', user.id);

        if (!error && data) {
            setFavorites(data.map((f: any) => f.popup).filter((p: any) => p !== null));
        }
    };

    const addToRoute = (popup: Popup) => {
        if (selectedPopups.find(p => p.id === popup.id)) return;
        setSelectedPopups(prev => [...prev, popup]);
        setShowFavorites(false);
    };

    const removeFromRoute = (id: string) => {
        setSelectedPopups(prev => prev.filter(p => p.id !== id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setSelectedPopups((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (isLoading || !isAuthenticated) return null;

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                <div className={styles.layout}>
                    {/* Left: Map Section */}
                    <div className={styles.mapSection}>
                        <div className={styles.mapPlaceholder}>
                            <FiMap size={48} />
                            <p>지도를 불러오는 중...</p>
                        </div>

                        {/* Selected Popups Pins Overlay (Conceptual) */}
                        <div className={styles.mapOverlay}>
                            <button className={styles.currentLocBtn}>
                                <FiNavigation size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Panel Section */}
                    <div className={styles.panelSection}>
                        <div className={styles.panelHeader}>
                            <h1>경로 플래너</h1>
                            <p>찜한 팝업을 담아 최적의 동선을 짜보세요.</p>
                        </div>

                        <div className={styles.routeContainer}>
                            {selectedPopups.length === 0 ? (
                                <div className={styles.emptyRoute}>
                                    <p>아직 추가된 팝업이 없습니다.</p>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => setShowFavorites(true)}
                                    >
                                        <FiPlus size={20} />
                                        팝업 추가하기
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.sortableList}>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={selectedPopups.map(p => p.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {selectedPopups.map((popup, index) => (
                                                <div key={popup.id} className={styles.itemWrapper}>
                                                    <div className={styles.orderLabel}>{index + 1}</div>
                                                    <SortablePopupItem
                                                        popup={popup}
                                                        onRemove={removeFromRoute}
                                                    />
                                                </div>
                                            ))}
                                        </SortableContext>
                                    </DndContext>

                                    <button
                                        className={styles.addMoreBtn}
                                        onClick={() => setShowFavorites(true)}
                                    >
                                        <FiPlus size={18} />
                                        더 추가하기
                                    </button>
                                </div>
                            )}
                        </div>

                        {selectedPopups.length > 1 && (
                            <div className={styles.plannerFooter}>
                                <button className={styles.calcBtn}>
                                    최적 경로 계산하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Favorites Drawer/Modal */}
            {showFavorites && (
                <div className={styles.drawerOverlay} onClick={() => setShowFavorites(false)}>
                    <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                        <div className={styles.drawerHeader}>
                            <h2>찜한 팝업 목록</h2>
                            <button onClick={() => setShowFavorites(false)}><FiX size={24} /></button>
                        </div>
                        <div className={styles.drawerContent}>
                            {favorites.length === 0 ? (
                                <p className={styles.emptyFav}>찜한 팝업이 없습니다.</p>
                            ) : (
                                favorites.map(popup => (
                                    <div key={popup.id} className={styles.favItem}>
                                        <div className={styles.favInfo}>
                                            <span className={styles.favTitle}>{popup.title}</span>
                                            <span className={styles.favAddress}>{popup.address}</span>
                                        </div>
                                        <button
                                            className={styles.selectBtn}
                                            onClick={() => addToRoute(popup)}
                                            disabled={!!selectedPopups.find(p => p.id === popup.id)}
                                        >
                                            {selectedPopups.find(p => p.id === popup.id) ? '추가됨' : '추가'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
