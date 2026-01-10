/**
 * 숫자에 천 단위 콤마 추가
 * @example formatNumber(1234567) // '1,234,567'
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('ko-KR');
}

/**
 * 가격 포맷 (원화)
 * @example formatPrice(15000) // '15,000원'
 */
export function formatPrice(price: number): string {
    return `${formatNumber(price)}원`;
}

/**
 * 전화번호 포맷
 * @example formatPhoneNumber('01012345678') // '010-1234-5678'
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

/**
 * 문자열 자르기 (말줄임)
 * @example truncate('긴 문자열입니다', 5) // '긴 문자...'
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return `${str.slice(0, maxLength)}...`;
}

/**
 * 거리 포맷
 * @example formatDistance(1500) // '1.5km'
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
}
