import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'PopSpot - 팝업스토어를 한눈에',
    description: '전국 팝업스토어 정보를 한눈에! 위치 기반 검색부터 실시간 업데이트까지.',
    keywords: ['팝업스토어', 'popup store', '팝업', '전시', '브랜드', '이벤트'],
    openGraph: {
        title: 'PopSpot - 팝업스토어를 한눈에',
        description: '전국 팝업스토어 정보를 한눈에! 위치 기반 검색부터 실시간 업데이트까지.',
        type: 'website',
        locale: 'ko_KR',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
