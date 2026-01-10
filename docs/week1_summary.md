# 1주차 개발 완료 보고서 및 가이드

**작성일**: 2026-01-10

---

## 1. ✅ 1주차 작업 완료 리스트

### 1-1. 프로젝트 인프라 (Monorepo)
- [x] **Turborepo + pnpm** 환경 구축
- [x] 워크스페이스 구조화 (`apps/*`, `packages/*`)
- [x] 공통 개발 환경 설정 (TypeScript, ESLint, Prettier)

### 1-2. 백엔드 & 데이터베이스 (Supabase)
- [x] Supabase 프로젝트 생성 및 연동 (`fbzikkwkrqdocmyitdvk`)
- [x] **DB 스키마 설계 및 적용** (`popups`, `users`, `favorites` 등 핵심 테이블)
- [x] 환경변수 파일(`.env.local`) 생성 및 관리

### 1-3. 웹 애플리케이션 (Front-end)
- [x] **사용자용 앱 (`apps/web`)**
    - Next.js 14 초기화
    - 기존 디자인/컴포넌트(Header, Footer, PopupCard) 마이그레이션 완료
    - 메인 랜딩 페이지 구현
- [x] **관리자용 앱 (`apps/admin`)**
    - Next.js 14 초기화
    - 대시보드 레이아웃(사이드바) 구현

### 1-4. 공통 모듈 (Shared Packages)
- [x] **@popspot/ui**: 버튼, 카드 등 재사용 UI 컴포넌트
- [x] **@popspot/database**: Supabase 클라이언트 설정 공유
- [x] **@popspot/types**: DB 타입 및 공통 인터페이스
- [x] **@popspot/utils**: 날짜 변환 등 유틸리티 함수

---

## 2. 📁 프로젝트 구조

```text
popspot/
├── apps/
│   ├── web/                  # 🏠 사용자용 Next.js 앱 (Port: 3000)
│   │   ├── src/app/          # 페이지 (Next.js App Router)
│   │   ├── src/components/   # 앱 전용 컴포넌트
│   │   └── public/           # 정적 파일 (이미지 등)
│   └── admin/                # 👮 관리자용 Next.js 앱 (Port: 3001)
├── packages/
│   ├── database/             # 🗄️ Supabase 클라이언트 코어
│   ├── types/                # 🏷️ TypeScript 공통 타입 정의
│   ├── ui/                   # 🎨 디자인 시스템 (Button, Card...)
│   └── utils/                # 🛠️ 유틸리티 함수 모음
├── supabase/
│   ├── migrations/           # 📜 DB 스키마 SQL 파일
│   └── config.toml           # Supabase 설정
├── pnpm-workspace.yaml       # 모노레포 워크스페이스 정의
├── turbo.json                # Turborepo 파이프라인 설정
└── package.json              # 루트 의존성 및 스크립트
```

---

## 3. 🛠️ Supabase 연동 및 데이터 관리 가이드

이 프로젝트는 Supabase를 백엔드로 사용하며, 터미널(Bash)을 통해 스키마를 동기화합니다.

### 3-1. Supabase CLI 로그인
최초 1회 실행, 액세스 토큰을 발급받습니다.
```bash
npx supabase login
```

### 3-2. 프로젝트 연결 (Link)
로컬 프로젝트와 원격 Supabase 프로젝트를 연결합니다.
- `<project-ref>`는 Supabase 대시보드 URL의 `https://app.supabase.com/project/{아이디}` 부분입니다.
```bash
# 현재 연결된 프로젝트 ID: fbzikkwkrqdocmyitdvk
npx supabase link --project-ref fbzikkwkrqdocmyitdvk
```
*(실행 시 DB 비밀번호 입력이 필요할 수 있습니다)*
```bash
PW : ibmaiagent253@%#
```

### 3-3. DB 스키마 업로드 (Push)
로컬 `supabase/migrations` 폴더에 있는 SQL 파일들을 원격 DB에 적용합니다.
**주의**: 이 명령어는 로컬 마이그레이션 기록을 기준으로 원격 DB를 업데이트합니다.
```bash
npx supabase db push
```

### 3-4. (참고) 로컬 DB 변경사항 생성
DB 스키마를 수정했을 때 새로운 마이그레이션 파일을 생성하는 방법입니다.
```bash
npx supabase migration new <변경내용_이름>
# 예: npx supabase migration new add_profiles_table
# 생성된 sql 파일에 DDL 작성 후 db push
```

### 3-5. ⚠️ 환경변수 설정 (팀원 필독)
`.env.local` 파일은 보안상 Git에 올라가지 않습니다. 
프로젝트를 실행하기 전에 **아래 위치에 파일을 직접 생성**하고 내용을 입력해주세요.

**1. 파일 생성 위치** (2곳 모두 생성)
- `apps/web/.env.local`
- `apps/admin/.env.local`

**2. 입력할 내용 (공통)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fbzikkwkrqdocmyitdvk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiemlra3drcnFkb2NteWl0ZHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NTMwMzAsImV4cCI6MjA4MzQyOTAzMH0.dcO-gDr-cVAB_3qgwjoGHITpeCXQ0dIvvQGmNwHHoEA
```

---

## 4. 📦 pnpm & Turborepo 사용 가이드

이 프로젝트는 `pnpm`을 패키지 매니저로 사용합니다.

### 4-1. 기본 명령어
```bash
# 의존성 설치 (모든 워크스페이스)
pnpm install

# 전체 프로젝트 개발 서버 실행 (web + admin 동시 실행)
pnpm dev

# 전체 프로젝트 빌드
pnpm build
```

### 4-2. 특정 앱만 실행하기 (Filter)
개발 시 필요한 앱만 따로 실행하면 빠르고 효율적입니다.
```bash
# 사용자 앱(Web)만 실행 -> localhost:3000
pnpm turbo dev --filter=@popspot/web

# 관리자 앱(Admin)만 실행 -> localhost:3001
pnpm turbo dev --filter=@popspot/admin
```

### 4-3. 패키지 설치
특정 앱이나 패키지에 라이브러리를 추가할 때 `--filter` 옵션을 사용합니다.
```bash
# apps/web에 'axios' 라이브러리 추가
pnpm add axios --filter=@popspot/web

# packages/ui에 'framer-motion' 추가
pnpm add framer-motion --filter=@popspot/ui
```
