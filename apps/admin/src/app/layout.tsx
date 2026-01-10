import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'PopSpot Admin',
    description: 'PopSpot 관리자 대시보드',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="antialiased">{children}</body>
        </html>
    );
}
