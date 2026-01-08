import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PopSpot - 팝업스토어 모아보기",
  description: "전국의 핫한 팝업스토어를 한눈에! 팝스팟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
