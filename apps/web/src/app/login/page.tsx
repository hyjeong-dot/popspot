'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { signInWithEmail, signInWithKakao, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        const result = await signInWithEmail(email, password);
        if (result.error) {
            setError(result.error);
        } else {
            router.push('/');
        }
    };

    const handleKakaoLogin = async () => {
        const result = await signInWithKakao();
        if (result.error) {
            setError(result.error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <Link href="/" className={styles.backLink}>
                    <FiArrowLeft size={20} />
                    홈으로
                </Link>

                <div className={styles.header}>
                    <h1 className={styles.title}>🎪 PopSpot</h1>
                    <p className={styles.subtitle}>로그인하고 팝업스토어를 찜해보세요</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일</label>
                        <div className={styles.inputWrapper}>
                            <FiMail className={styles.inputIcon} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className={styles.input}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className={styles.input}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.options}>
                        <label className={styles.remember}>
                            <input type="checkbox" />
                            <span>로그인 상태 유지</span>
                        </label>
                        <Link href="/forgot-password" className={styles.forgot}>
                            비밀번호 찾기
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
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
                    카카오로 계속하기
                </button>

                <p className={styles.register}>
                    아직 회원이 아니신가요?{' '}
                    <Link href="/register" className={styles.registerLink}>
                        회원가입
                    </Link>
                </p>
            </div>
        </div>
    );
}
