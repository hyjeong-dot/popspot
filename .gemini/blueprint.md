# 🎪 PopSpot 프로젝트 블루프린트

## 📌 Phase 1: MVP 개발 (8주)

### Week 1: 프로젝트 셋업

#### 1.1 모노레포 초기화
- [ ] Turborepo 설정
- [ ] TypeScript 설정 (tsconfig)
- [ ] ESLint + Prettier 설정
- [ ] pnpm-workspace.yaml 설정

#### 1.2 Supabase 설정
- [ ] Supabase 프로젝트 생성
- [ ] Database URL 확인
- [ ] Storage 버킷 생성 (popup-images)
- [ ] Realtime 활성화
- [ ] 환경변수 설정 (.env.local)

#### 1.3 앱 생성
- [ ] apps/web (Next.js 14, 사용자용)
- [ ] apps/admin (Next.js 14, 관리자용)

#### 1.4 패키지 생성
- [ ] packages/database (Supabase 클라이언트)
- [ ] packages/ui (공통 컴포넌트)
- [ ] packages/types (TypeScript 타입)
- [ ] packages/utils (유틸리티)

-----

### Week 2: 데이터베이스 & 인증

#### 2.1 데이터베이스 스키마 생성
- [ ] popups 테이블 (팝업스토어)
- [ ] profiles 테이블 (사용자 프로필)
- [ ] favorites 테이블 (찜하기)
- [ ] comments 테이블 (댓글)
- [ ] reports 테이블 (신고)
- [ ] notices 테이블 (공지사항)
- [ ] inquiries 테이블 (1:1 문의)

#### 2.2 Supabase Auth 설정
- [ ] 이메일/비밀번호 인증 활성화
- [ ] 소셜 로그인 설정 (kakao)
- [ ] Auth 훅 생성 (useAuth)
- [ ] 미들웨어 보호 설정

#### 2.3 공통 컴포넌트 개발 (packages/ui)
- [ ] Button 컴포넌트
- [ ] Input 컴포넌트
- [ ] Card 컴포넌트
- [ ] Modal 컴포넌트
- [ ] Loading 컴포넌트

---

### Week 3: 사용자 기본 기능

#### 3.1 레이아웃 구성
- [ ] Header 컴포넌트
- [ ] Footer 컴포넌트
- [ ] Navigation (하단 탭바)
- [ ] 반응형 레이아웃

#### 3.2 로그인/회원가입
- [ ] 로그인 페이지 (/login)
- [ ] 회원가입 페이지 (/register)
- [ ] 비밀번호 찾기
- [ ] 로그인 상태 관리 (Zustand)

#### 3.3 팝업 목록 페이지
- [ ] 홈 페이지 (/)
- [ ] 팝업 카드 컴포넌트
- [ ] 리스트뷰 / 그리드뷰 전환
- [ ] 무한 스크롤

---

### Week 4: 필터링 & 검색

#### 4.1 필터 기능
- [ ] 날짜별 필터 (DatePicker)
- [ ] 지역별 필터 (서울/성수, 홍대 등)
- [ ] 카테고리별 필터 (패션, 뷰티 등)
- [ ] 필터 칩 UI

#### 4.2 검색 기능
- [ ] 검색 바 컴포넌트
- [ ] 키워드 검색 (팝업명, 브랜드명)
- [ ] 검색 결과 페이지
- [ ] 최근 검색어 저장

#### 4.3 내 주변 팝업
- [ ] Geolocation API 연동
- [ ] 반경 내 팝업 조회
- [ ] 거리순 정렬

---

### Week 5: 팝업 상세 & 참여

#### 5.1 팝업 상세 페이지
- [ ] 상세 페이지 (/popup/[id])
- [ ] 이미지 갤러리/슬라이더
- [ ] 기본 정보 표시
- [ ] Kakao 지도 연동

#### 5.2 찜하기 기능
- [ ] 찜하기 버튼
- [ ] 찜 목록 관리
- [ ] 찜 수 실시간 업데이트

#### 5.3 댓글 기능
- [ ] 댓글 작성
- [ ] 댓글 목록 표시
- [ ] 댓글 삭제 (본인만)

#### 5.4 신고/수정 제안
- [ ] 신고하기 모달
- [ ] 수정 제안 폼
- [ ] 제출 확인 토스트

---

### Week 6: 마이페이지 & 경로 플래너

#### 6.1 마이페이지
- [ ] 마이페이지 (/mypage)
- [ ] 내 정보 수정
- [ ] 비밀번호 변경
- [ ] 프로필 이미지 업로드

#### 6.2 마이페이지 서브
- [ ] 찜 목록 (/mypage/favorites)
- [ ] 내 댓글 (/mypage/comments)
- [ ] 내 등록 팝업 (/mypage/popups)

#### 6.3 경로 플래너
- [ ] 플래너 페이지 (/planner)
- [ ] Kakao Map 경로 표시
- [ ] 찜한 팝업 선택
- [ ] 순서 드래그 변경
- [ ] 최적 경로 계산

---

### Week 7: 관리자 기능

#### 7.1 관리자 대시보드
- [ ] 대시보드 (/admin)
- [ ] 통계 카드 (팝업수, 회원수 등)
- [ ] 최근 팝업 목록
- [ ] 대기중 신고 목록

#### 7.2 팝업 관리
- [ ] 팝업 목록 (/admin/popups)
- [ ] 팝업 등록 (/admin/popups/new)
- [ ] 팝업 수정 (/admin/popups/[id]/edit)
- [ ] 팝업 삭제

#### 7.3 신고/문의 관리
- [ ] 신고 목록 (/admin/reports)
- [ ] 신고 승인/반려
- [ ] 문의 목록 (/admin/inquiries)
- [ ] 문의 답변

#### 7.4 공지사항 관리
- [ ] 공지 목록 (/admin/notices)
- [ ] 공지 등록/수정/삭제

---

### Week 8: 마무리 & 배포

#### 8.1 성능 최적화
- [ ] 이미지 최적화 (next/image)
- [ ] 코드 스플리팅
- [ ] 캐싱 전략

#### 8.2 SEO 최적화
- [ ] 메타 태그 설정
- [ ] OG 이미지 설정
- [ ] sitemap.xml 생성

#### 8.3 테스트
- [ ] 주요 기능 테스트
- [ ] 반응형 테스트
- [ ] 크로스 브라우저 테스트

#### 8.4 배포
- [ ] Vercel 연동
- [ ] 도메인 연결
- [ ] 환경변수 설정
- [ ] 모니터링 설정

---

## 📌 Phase 2: 확장 기능 (4주)

### Week 9-10: 추가 기능

#### 9.1 주변 맛집
- [ ] Kakao Local API 연동
- [ ] 맛집 목록 표시
- [ ] 맛집 상세 정보

#### 9.2 알림 기능
- [ ] 푸시 알림 설정
- [ ] 찜한 팝업 알림
- [ ] 종료 임박 알림

#### 9.3 사업자 인증
- [ ] 사업자 신청 폼
- [ ] 관리자 승인 시스템
- [ ] 사업자 전용 페이지

---

### Week 11-12: 고도화

#### 11.1 통계 대시보드
- [ ] 팝업 통계 차트
- [ ] 방문자 분석
- [ ] 트렌드 분석

#### 11.2 소셜 기능
- [ ] SNS 공유
- [ ] 친구 초대
- [ ] 리뷰 공유

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14+ (App Router) |
| 언어 | TypeScript 5+ |
| 스타일링 | CSS Modules |
| 상태관리 | Zustand |
| 백엔드 | Supabase (DB, Auth, Storage) |
| 모노레포 | Turborepo + pnpm |
| 지도 | Kakao Maps API |
| 배포 | Vercel |

---

## 📁 프로젝트 구조

```
popspot/
├── apps/
│   ├── web/                 # 사용자 앱
│   └── admin/               # 관리자 앱
├── packages/
│   ├── database/            # Supabase 클라이언트
│   ├── ui/                  # 공통 컴포넌트
│   ├── types/               # TypeScript 타입
│   └── utils/               # 유틸리티
├── supabase/
│   └── migrations/          # DB 마이그레이션
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```
