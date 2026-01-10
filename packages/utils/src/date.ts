import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 형식으로 포맷
 * @example formatDate('2024-01-15') // '2024년 1월 15일'
 */
export function formatDate(date: string | Date, formatStr = 'yyyy년 M월 d일'): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr, { locale: ko });
}

/**
 * 상대적 시간 표시 (예: '3일 전', '방금 전')
 */
export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
}

/**
 * 팝업 운영 기간 포맷
 * @example formatDateRange('2024-01-15', '2024-02-15') // '1.15 - 2.15'
 */
export function formatDateRange(startDate: string, endDate: string): string {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return `${format(start, 'M.d')} - ${format(end, 'M.d')}`;
}

/**
 * 팝업 상태 확인
 */
export function getPopupStatus(startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'ended' {
    const now = new Date();
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (isBefore(now, start)) return 'upcoming';
    if (isAfter(now, end)) return 'ended';
    return 'ongoing';
}

/**
 * D-Day 계산
 */
export function getDDay(targetDate: string): string {
    const target = parseISO(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
}
