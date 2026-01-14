'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { signUp, signInWithKakao, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return { minLength, hasLetter, hasNumber, isValid: minLength && hasLetter && hasNumber };
    };

    const passwordValidation = validatePassword(formData.password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email || !formData.password || !formData.nickname) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (!passwordValidation.isValid) {
            setError('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreeTerms || !agreePrivacy) {
            setError('필수 약관에 동의해주세요.');
            return;
        }

        const result = await signUp(formData.email, formData.password, formData.nickname);
        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
        }
    };

    const handleKakaoLogin = async () => {
        const result = await signInWithKakao();
        if (result.error) {
            setError(result.error);
        }
    };

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>
                            <FiCheck size={48} />
                        </div>
                        <h2 className={styles.successTitle}>회원가입 완료!</h2>
                        <p className={styles.successText}>
                            이메일로 인증 링크를 보내드렸습니다.<br />
                            이메일을 확인하고 인증을 완료해주세요.
                        </p>
                        <Link href="/login" className={styles.successBtn}>
                            로그인하기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <Link href="/" className={styles.backLink}>
                    <FiArrowLeft size={20} />
                    홈으로
                </Link>

                <div className={styles.header}>
                    <h1 className={styles.title}>🎪 PopSpot</h1>
                    <p className={styles.subtitle}>회원가입하고 팝업스토어를 찜해보세요</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일</label>
                        <div className={styles.inputWrapper}>
                            <FiMail className={styles.inputIcon} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className={styles.input}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>닉네임</label>
                        <div className={styles.inputWrapper}>
                            <FiUser className={styles.inputIcon} />
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="사용할 닉네임을 입력하세요"
                                className={styles.input}
                                maxLength={20}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8자 이상, 영문+숫자"
                                className={styles.input}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <div className={styles.passwordRules}>
                            <span className={passwordValidation.minLength ? styles.valid : ''}>
                                8자 이상
                            </span>
                            <span className={passwordValidation.hasLetter ? styles.valid : ''}>
                                영문 포함
                            </span>
                            <span className={passwordValidation.hasNumber ? styles.valid : ''}>
                                숫자 포함
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호 확인</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호를 다시 입력하세요"
                                className={styles.input}
                                autoComplete="new-password"
                            />
                        </div>
                        {formData.confirmPassword && (
                            <span className={
                                formData.password === formData.confirmPassword
                                    ? styles.matchSuccess
                                    : styles.matchError
                            }>
                                {formData.password === formData.confirmPassword
                                    ? '✓ 비밀번호 일치'
                                    : '✗ 비밀번호 불일치'}
                            </span>
                        )}
                    </div>

                    <div className={styles.agreements}>
                        <label className={styles.agreement}>
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <span>[필수] 이용약관에 동의합니다</span>
                        </label>
                        <label className={styles.agreement}>
                            <input
                                type="checkbox"
                                checked={agreePrivacy}
                                onChange={(e) => setAgreePrivacy(e.target.checked)}
                            />
                            <span>[필수] 개인정보처리방침에 동의합니다</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? '가입 중...' : '회원가입'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>또는</span>
                </div>

                <button
                    type="button"
                    className={styles.kakaoBtn}
                    onClick={handleKakaoLogin}
                >
                    <img src="/images/kakao-icon.svg" alt="" className={styles.kakaoIcon} />
                    카카오로 시작하기
                </button>

                <p className={styles.login}>
                    이미 계정이 있으신가요?{' '}
                    <Link href="/login" className={styles.loginLink}>
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    );
}
