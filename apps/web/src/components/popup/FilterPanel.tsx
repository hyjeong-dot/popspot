'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiMapPin } from 'react-icons/fi';
import type { PopupFilters, PopupCategory, PopupRegion } from '@popspot/types';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
    filters: PopupFilters;
    onFilterChange: (filters: PopupFilters) => void;
    onClose: () => void;
}

const categories: { value: PopupCategory; label: string; emoji: string }[] = [
    { value: 'fashion', label: '패션', emoji: '👗' },
    { value: 'beauty', label: '뷰티', emoji: '💄' },
    { value: 'character', label: '캐릭터', emoji: '🎭' },
    { value: 'food', label: '푸드', emoji: '🍽️' },
    { value: 'lifestyle', label: '라이프스타일', emoji: '🏠' },
    { value: 'art', label: '아트', emoji: '🎨' },
    { value: 'entertainment', label: '엔터테인먼트', emoji: '🎬' },
    { value: 'other', label: '기타', emoji: '📦' },
];

const regions: { value: PopupRegion; label: string }[] = [
    { value: '서울/성수', label: '서울/성수' },
    { value: '서울/홍대', label: '서울/홍대' },
    { value: '서울/강남', label: '서울/강남' },
    { value: '서울/명동', label: '서울/명동' },
    { value: '서울/여의도', label: '서울/여의도' },
    { value: '서울/기타', label: '서울/기타' },
    { value: '경기', label: '경기' },
    { value: '부산', label: '부산' },
    { value: '기타', label: '기타' },
];

export default function FilterPanel({ filters, onFilterChange, onClose }: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<PopupFilters>(filters);

    const handleCategoryToggle = (category: PopupCategory) => {
        setLocalFilters(prev => ({
            ...prev,
            category: prev.category === category ? undefined : category,
        }));
    };

    const handleRegionToggle = (region: PopupRegion) => {
        setLocalFilters(prev => ({
            ...prev,
            region: prev.region === region ? undefined : region,
        }));
    };

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value || undefined,
        }));
    };

    const handleApply = () => {
        onFilterChange(localFilters);
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({});
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3 className={styles.title}>필터</h3>
                <button className={styles.closeBtn} onClick={onClose}>
                    <FiX size={20} />
                </button>
            </div>

            <div className={styles.content}>
                {/* Category Filter */}
                <div className={styles.filterGroup}>
                    <h4 className={styles.filterLabel}>카테고리</h4>
                    <div className={styles.categoryGrid}>
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className={`${styles.categoryBtn} ${localFilters.category === cat.value ? styles.active : ''
                                    }`}
                                onClick={() => handleCategoryToggle(cat.value)}
                            >
                                <span className={styles.categoryEmoji}>{cat.emoji}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Region Filter */}
                <div className={styles.filterGroup}>
                    <h4 className={styles.filterLabel}>
                        <FiMapPin size={16} />
                        지역
                    </h4>
                    <div className={styles.regionGrid}>
                        {regions.map(reg => (
                            <button
                                key={reg.value}
                                className={`${styles.regionBtn} ${localFilters.region === reg.value ? styles.active : ''
                                    }`}
                                onClick={() => handleRegionToggle(reg.value)}
                            >
                                {reg.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Filter */}
                <div className={styles.filterGroup}>
                    <h4 className={styles.filterLabel}>
                        <FiCalendar size={16} />
                        날짜
                    </h4>
                    <div className={styles.dateInputs}>
                        <div className={styles.dateInput}>
                            <label>시작일</label>
                            <input
                                type="date"
                                value={localFilters.startDate || ''}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                            />
                        </div>
                        <span className={styles.dateSeparator}>~</span>
                        <div className={styles.dateInput}>
                            <label>종료일</label>
                            <input
                                type="date"
                                value={localFilters.endDate || ''}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.resetBtn} onClick={handleReset}>
                    초기화
                </button>
                <button className={styles.applyBtn} onClick={handleApply}>
                    적용하기
                </button>
            </div>
        </div>
    );
}
