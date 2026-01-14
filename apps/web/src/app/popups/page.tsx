'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter, FiGrid, FiList, FiMapPin, FiX } from 'react-icons/fi';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PopupCard from '@/components/popup/PopupCard';
import FilterPanel from '@/components/popup/FilterPanel';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup, PopupCategory, PopupRegion, PopupFilters } from '@popspot/types';
import styles from './popups.module.css';

export default function PopupsPage() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<PopupFilters>({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const supabase = getSupabaseClient();

    const fetchPopups = useCallback(async (reset = false) => {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const limit = 12;
        const offset = (currentPage - 1) * limit;

        let query = supabase
            .from('popups')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.region) {
            query = query.eq('region', filters.region);
        }
        if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
        }
        if (filters.startDate) {
            query = query.gte('end_date', filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte('start_date', filters.endDate);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            console.warn('Supabase data not found, using mock data');
            const { mockPopups } = await import('@/data/mockPopups');
            if (reset) {
                setPopups(mockPopups);
            } else {
                setPopups(prev => [...prev, ...mockPopups]);
            }
            setHasMore(false);
        } else {
            if (reset) {
                setPopups(data as Popup[]);
            } else {
                setPopups(prev => [...prev, ...(data as Popup[])]);
            }
            setHasMore(data.length === limit);
        }
        setLoading(false);
    }, [supabase, filters, searchQuery, page]);

    useEffect(() => {
        fetchPopups(true);
        setPage(1);
    }, [filters, searchQuery]);

    useEffect(() => {
        if (page > 1) {
            fetchPopups();
        }
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is already triggered by searchQuery change
    };

    const handleFilterChange = (newFilters: PopupFilters) => {
        setFilters(newFilters);
    };

    const clearFilter = (key: keyof PopupFilters) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const activeFilterCount = Object.keys(filters).filter(k => filters[k as keyof PopupFilters]).length;

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <h1 className={styles.heroTitle}>팝업스토어 찾기</h1>
                    <p className={styles.heroSubtitle}>
                        전국의 핫한 팝업스토어를 발견하세요
                    </p>
                </section>

                {/* Search & Filter Bar */}
                <section className={styles.searchSection}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchWrapper}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="브랜드명, 팝업명으로 검색"
                                className={styles.searchInput}
                            />
                        </div>
                    </form>

                    <div className={styles.controls}>
                        <button
                            className={`${styles.filterBtn} ${activeFilterCount > 0 ? styles.active : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FiFilter size={18} />
                            필터
                            {activeFilterCount > 0 && (
                                <span className={styles.filterBadge}>{activeFilterCount}</span>
                            )}
                        </button>

                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <FiGrid size={18} />
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <FiList size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                    <div className={styles.activeFilters}>
                        {filters.category && (
                            <span className={styles.filterChip}>
                                {filters.category}
                                <button onClick={() => clearFilter('category')}>
                                    <FiX size={14} />
                                </button>
                            </span>
                        )}
                        {filters.region && (
                            <span className={styles.filterChip}>
                                <FiMapPin size={12} />
                                {filters.region}
                                <button onClick={() => clearFilter('region')}>
                                    <FiX size={14} />
                                </button>
                            </span>
                        )}
                        {(filters.startDate || filters.endDate) && (
                            <span className={styles.filterChip}>
                                {filters.startDate} ~ {filters.endDate}
                                <button onClick={() => { clearFilter('startDate'); clearFilter('endDate'); }}>
                                    <FiX size={14} />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Filter Panel */}
                {showFilters && (
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClose={() => setShowFilters(false)}
                    />
                )}

                {/* Results */}
                <section className={styles.results}>
                    {loading && popups.length === 0 ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>팝업스토어를 불러오는 중...</p>
                        </div>
                    ) : popups.length === 0 ? (
                        <div className={styles.empty}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <p>검색 결과가 없습니다</p>
                            <span>다른 검색어나 필터를 시도해보세요</span>
                        </div>
                    ) : (
                        <>
                            <div className={`${styles.grid} ${viewMode === 'list' ? styles.listView : ''}`}>
                                {popups.map((popup) => (
                                    <PopupCard key={popup.id} popup={popup} viewMode={viewMode} />
                                ))}
                            </div>

                            {hasMore && (
                                <button
                                    className={styles.loadMoreBtn}
                                    onClick={loadMore}
                                    disabled={loading}
                                >
                                    {loading ? '로딩 중...' : '더 보기'}
                                </button>
                            )}
                        </>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
