/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 전화번호 유효성 검사 (한국 번호)
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return /^01[016789]\d{7,8}$/.test(cleaned);
}

/**
 * URL 유효성 검사
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * 비밀번호 강도 검사
 * @returns 0-4 점수 (0: 매우 약함, 4: 강함)
 */
export function getPasswordStrength(password: string): number {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return Math.min(score, 4);
}

/**
 * 닉네임 유효성 검사 (2-20자, 한글/영문/숫자만 허용)
 */
export function isValidNickname(nickname: string): boolean {
    return /^[가-힣a-zA-Z0-9]{2,20}$/.test(nickname);
}
