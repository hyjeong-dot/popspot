'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    FiArrowLeft, FiSave, FiImage, FiX, FiMapPin,
    FiCalendar, FiClock, FiPlus
} from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSupabaseClient } from '@/lib/supabase';
import type { Popup, PopupCategory, PopupRegion } from '@popspot/types';
import styles from './popup-form.module.css';

export default function PopupFormPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
    const supabase = getSupabaseClient();

    const isEdit = !!params.id;
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Popup>>({
        title: '',
        brand: '',
        category: 'fashion',
        region: '서울/성수',
        description: '',
        address: '',
        start_date: '',
        end_date: '',
        hours: '',
        website: '',
        instagram: '',
        images: [],
        status: 'active',
    });

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, isLoading, router]);

    useEffect(() => {
        if (isEdit && isAuthenticated && isAdmin) {
            fetchPopup();
        }
    }, [isEdit, isAuthenticated, isAdmin]);

    const fetchPopup = async () => {
        const { data, error } = await supabase
            .from('popups')
            .select('*')
            .eq('id', params.id)
            .single();

        if (!error && data) {
            setFormData(data);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageAdd = () => {
        const url = prompt('이미지 URL을 입력하세요');
        if (url) {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), url]
            }));
        }
    };

    const handleImageRemove = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isEdit) {
                const { error } = await (supabase
                    .from('popups')
                    .update(formData as any)
                    .eq('id', params.id as string) as any);
                if (error) throw error;
            } else {
                const { error } = await (supabase
                    .from('popups')
                    .insert([formData as any]) as any);
                if (error) throw error;
            }
            router.push('/popups');
        } catch (error) {
            console.error('Error saving popup:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className={styles.layout}>
            <Sidebar activeMenu="popups" />

            <main className={styles.main}>
                <header className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <FiArrowLeft size={20} />
                    </button>
                    <h1>{isEdit ? '팝업 수정' : '새 팝업 등록'}</h1>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        {/* 기본 정보 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>기본 정보</h2>
                            <div className={styles.inputGroup}>
                                <label>팝업명</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="상호명 또는 팝업 주제"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>브랜드명</label>
                                <input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="주최 브랜드"
                                    required
                                />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>카테고리</label>
                                    <select name="category" value={formData.category || 'fashion'} onChange={handleChange}>
                                        <option value="fashion">패션</option>
                                        <option value="beauty">뷰티</option>
                                        <option value="character">캐릭터</option>
                                        <option value="food">푸드</option>
                                        <option value="lifestyle">라이프스타일</option>
                                        <option value="art">아트</option>
                                        <option value="entertainment">엔터테인먼트</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>지역</label>
                                    <select name="region" value={formData.region || '서울/성수'} onChange={handleChange}>
                                        <option value="서울/성수">서울/성수</option>
                                        <option value="서울/홍대">서울/홍대</option>
                                        <option value="서울/강남">서울/강남</option>
                                        <option value="서울/명동">서울/명동</option>
                                        <option value="서울/여의도">서울/여의도</option>
                                        <option value="서울/기타">서울/기타</option>
                                        <option value="경기">경기</option>
                                        <option value="부산">부산</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>상세 설명</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="팝업스토어 상세 내용을 입력하세요"
                                    rows={5}
                                    required
                                />
                            </div>
                        </section>

                        {/* 위치 및 시간 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>위치 및 일정</h2>
                            <div className={styles.inputGroup}>
                                <label><FiMapPin size={14} /> 주소</label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="상세 주소를 입력하세요"
                                    required
                                />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label><FiCalendar size={14} /> 시작일</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label><FiCalendar size={14} /> 종료일</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label><FiClock size={14} /> 운영 시간</label>
                                <input
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    placeholder="예: 11:00 - 20:00"
                                />
                            </div>
                        </section>

                        {/* 이미지 관리 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>이미지</h2>
                            <div className={styles.imageGrid}>
                                {formData.images?.map((url, idx) => (
                                    <div key={idx} className={styles.imagePreview}>
                                        <img src={url} alt={`preview ${idx}`} />
                                        <button
                                            type="button"
                                            className={styles.removeImgBtn}
                                            onClick={() => handleImageRemove(idx)}
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className={styles.addImgBtn} onClick={handleImageAdd}>
                                    <FiPlus size={24} />
                                    <span>이미지 추가</span>
                                </button>
                            </div>
                        </section>

                        {/* 외부 링크 */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>외부 링크</h2>
                            <div className={styles.inputGroup}>
                                <label>공식 웹사이트</label>
                                <input
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>인스타그램</label>
                                <input
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="@account"
                                />
                            </div>
                        </section>
                    </div>

                    <div className={styles.formFooter}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => router.back()}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={submitting}
                        >
                            <FiSave size={18} />
                            {submitting ? '저장 중...' : '팝업 저장하기'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
