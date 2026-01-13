# 📊 PopSpot 행위 데이터 분석 문서

> **작성일**: 2026년 1월 13일  
> **목적**: 사용자 행위 데이터 정의 및 데이터베이스 저장 전략

---

## 1. 행위 데이터란?

행위 데이터(Behavioral Data)란 사용자가 서비스를 이용하면서 발생시키는 **모든 상호작용 기록**을 의미합니다.

### 활용 목적
- 📈 **서비스 분석**: 인기 팝업, 트렌드 파악
- 🎯 **개인화 추천**: 사용자 취향 기반 팝업 추천
- 🔧 **UX 개선**: 사용자 행동 패턴 분석
- 📊 **비즈니스 인사이트**: 사업자 대시보드, 통계

---

## 2. 현재 저장 중인 행위 데이터

### 2.1 팝업스토어 관련

| 행위                 | 발생 주체   | 저장 여부 | 저장 위치          |
| -------------------- | ----------- | :-------: | ------------------ |
| 팝업 조회            | 모든 사용자 |     ❌     | -                  |
| 팝업 상세 방문       | 모든 사용자 |     ❌     | -                  |
| **팝업 찜하기/취소** | 일반회원+   |     ✅     | `User.favorites[]` |
| 팝업 검색            | 모든 사용자 |     ❌     | -                  |
| 필터 사용            | 모든 사용자 |     ❌     | -                  |

### 2.2 댓글/리뷰 관련

| 행위          | 발생 주체 | 저장 여부 | 저장 위치           |
| ------------- | --------- | :-------: | ------------------- |
| **댓글 작성** | 일반회원+ |     ✅     | `comments` 테이블   |
| 댓글 삭제     | 일반회원+ |     ❌     | 삭제 시 레코드 제거 |

### 2.3 신고/수정 제안

| 행위          | 발생 주체 | 저장 여부 | 저장 위치                 |
| ------------- | --------- | :-------: | ------------------------- |
| **신고하기**  | 일반회원+ |     ✅     | `reports` 테이블          |
| **수정 제안** | 일반회원+ |     ✅     | `edit_suggestions` 테이블 |

### 2.4 예약/결제

| 행위          | 발생 주체 | 저장 여부 | 저장 위치                  |
| ------------- | --------- | :-------: | -------------------------- |
| **예약 신청** | 일반회원+ |     ✅     | `reservations` 테이블      |
| 예약 취소     | 일반회원+ |     ⚠️     | 상태만 변경 (사유 없음)    |
| **결제 완료** | 일반회원+ |     ✅     | `reservations.payment_key` |
| 환불 요청     | 일반회원+ |     ❌     | 별도 로그 없음             |

### 2.5 알림 관련

| 행위               | 발생 주체 | 저장 여부 | 저장 위치                          |
| ------------------ | --------- | :-------: | ---------------------------------- |
| **알림 수신**      | 일반회원+ |     ✅     | `notifications` 테이블             |
| **알림 읽음**      | 일반회원+ |     ✅     | `notifications.is_read`            |
| **알림 설정 변경** | 일반회원+ |     ✅     | `profiles.is_notification_enabled` |

### 2.6 기타

| 행위             | 발생 주체   | 저장 여부 | 저장 위치          |
| ---------------- | ----------- | :-------: | ------------------ |
| 로그인/로그아웃  | 회원        |     ❌     | 세션만 관리        |
| **회원가입**     | 비회원      |     ✅     | `profiles` 테이블  |
| **1:1 문의**     | 일반회원+   |     ✅     | `inquiries` 테이블 |
| 경로 플래너 사용 | 일반회원+   |     ❌     | 경로 저장 없음     |
| 공지사항 조회    | 모든 사용자 |     ❌     | 조회 로그 없음     |

---

## 3. 추가 저장이 필요한 행위 데이터

분석 및 서비스 개선을 위해 다음 테이블 추가를 권장합니다.

### 3.1 `popup_views` (팝업 조회 로그)

**우선순위**: P2  
**목적**: 인기 팝업 분석, 추천 시스템 기반 데이터

```typescript
interface PopupView {
  id: string;
  popup_id: string;
  user_id?: string;              // 비회원은 null
  viewed_at: string;
  source: 'list' | 'search' | 'direct' | 'share';  // 유입 경로
  device_type: 'mobile' | 'tablet' | 'desktop';
}
```

```sql
-- Supabase Migration
CREATE TABLE popup_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  popup_id UUID REFERENCES popups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT CHECK (source IN ('list', 'search', 'direct', 'share')),
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop'))
);

-- 인덱스
CREATE INDEX idx_popup_views_popup_id ON popup_views(popup_id);
CREATE INDEX idx_popup_views_user_id ON popup_views(user_id);
CREATE INDEX idx_popup_views_viewed_at ON popup_views(viewed_at);
```

---

### 3.2 `search_logs` (검색어 로그)

**우선순위**: P3  
**목적**: 검색 트렌드 분석, 자동완성 개선

```typescript
interface SearchLog {
  id: string;
  user_id?: string;
  keyword: string;
  result_count: number;
  filters?: {
    region?: string;
    category?: string;
    date?: string;
  };
  searched_at: string;
}
```

```sql
-- Supabase Migration
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  keyword TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  filters JSONB,
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_search_logs_keyword ON search_logs(keyword);
CREATE INDEX idx_search_logs_searched_at ON search_logs(searched_at);
```

---

### 3.3 `user_activities` (통합 활동 로그)

**우선순위**: P2  
**목적**: 핵심 사용자 행동 추적, 분석 대시보드

```typescript
interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 
    | 'login' 
    | 'logout' 
    | 'favorite_add' 
    | 'favorite_remove'
    | 'comment_create'
    | 'comment_delete'
    | 'reservation_create'
    | 'reservation_cancel'
    | 'payment_success'
    | 'payment_refund'
    | 'planner_use';
  target_id?: string;            // 대상 팝업/댓글 ID
  metadata?: Record<string, any>; // 추가 정보 (JSON)
  created_at: string;
}
```

```sql
-- Supabase Migration
CREATE TYPE activity_type AS ENUM (
  'login', 'logout',
  'favorite_add', 'favorite_remove',
  'comment_create', 'comment_delete',
  'reservation_create', 'reservation_cancel',
  'payment_success', 'payment_refund',
  'planner_use'
);

CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);
```

---

### 3.4 `saved_routes` (경로 저장)

**우선순위**: P3  
**목적**: 경로 플래너 재사용, 공유 기능

```typescript
interface SavedRoute {
  id: string;
  user_id: string;
  name?: string;
  popup_ids: string[];           // 순서대로 저장
  created_at: string;
}
```

```sql
-- Supabase Migration
CREATE TABLE saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  popup_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_saved_routes_user_id ON saved_routes(user_id);
```

---

### 3.5 `refunds` (환불 기록)

**우선순위**: P2  
**목적**: 환불 관리 및 정산

```typescript
interface Refund {
  id: string;
  reservation_id: string;
  user_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'rejected';
  processed_at?: string;
  created_at: string;
}
```

```sql
-- Supabase Migration
CREATE TYPE refund_status AS ENUM ('pending', 'completed', 'rejected');

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status refund_status DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_refunds_reservation_id ON refunds(reservation_id);
CREATE INDEX idx_refunds_user_id ON refunds(user_id);
CREATE INDEX idx_refunds_status ON refunds(status);
```

---

## 4. 우선순위 요약

| 우선순위 | 테이블            | 목적                        | 개발 시점          |
| :------: | ----------------- | --------------------------- | ------------------ |
|  **P2**  | `user_activities` | 핵심 사용자 행동 추적       | MVP 이후           |
|  **P2**  | `popup_views`     | 인기 팝업 분석, 추천 시스템 | MVP 이후           |
|  **P2**  | `refunds`         | 환불 관리 및 정산           | 결제 시스템과 함께 |
|  **P3**  | `search_logs`     | 검색 트렌드 분석            | Phase 2            |
|  **P3**  | `saved_routes`    | 경로 플래너 재사용          | Phase 2            |

---

## 5. 데이터 보존 정책 (권장)

| 테이블            | 보존 기간 | 비고                         |
| ----------------- | --------- | ---------------------------- |
| `popup_views`     | 1년       | 오래된 데이터는 집계 후 삭제 |
| `search_logs`     | 6개월     | 트렌드 분석 후 삭제          |
| `user_activities` | 2년       | 법적 요구사항 고려           |
| `saved_routes`    | 무기한    | 사용자 삭제 시 함께 삭제     |
| `refunds`         | 5년       | 세무/회계 목적               |

---

## 6. 다음 단계

1. [ ] 팀 내 리뷰 및 피드백
2. [ ] 우선순위 확정
3. [ ] Supabase 마이그레이션 파일 생성
4. [ ] RLS(Row Level Security) 정책 설정
5. [ ] 프론트엔드 로깅 로직 구현

---

> 💡 **참고**: 이 문서는 `PROJECT_SPEC.md` 및 `blueprint.md`를 기반으로 작성되었습니다.
