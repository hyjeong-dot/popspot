# 개발 워크플로우 가이드

## 🔄 팀원 코드 동기화 루틴 (Daily Routine)

다른 팀원이 작업한 내용을 `git pull`로 받아온 후, 로컬 개발 환경을 최신 상태로 맞추기 위해 **반드시 아래 순서대로 실행**해주세요.

### 1단계: 의존성 패키지 동기화
새로운 라이브러리가 추가되었을 수 있습니다.
```bash
pnpm install
```

### 2단계: 환경변수 확인 (.env.local)
`apps/web/.env.local` 또는 `apps/admin/.env.local` 파일에 새로운 키가 필요한지 팀원에게 확인하거나 공지방을 체크합니다.
- 기존 환경변수는 그대로 두고, **새로 추가된 줄만 복사**해서 넣으세요.

### 3단계: Supabase DB 스키마 동기화
팀원이 생성한 테이블이나 컬럼을 내 원격 DB(또는 Shared DB)에 반영합니다.
```bash
# 로그인 (최초 1회만 필요)
npx supabase login

# 프로젝트 연결 (최초 1회만 필요)
npx supabase link --project-ref fbzikkwkrqdocmyitdvk

# 변경된 스키마 적용 (중요!)
npx supabase db push
```

### 4단계: TypeScript 타입 재생성 (권장)
DB 스키마가 변경되었다면 프론트엔드 타입도 업데이트해야 컴파일 에러가 나지 않습니다.
```bash
# packages/types 폴더로 이동 후 실행하거나, 루트에서 아래와 같이 실행
# (실제 스크립트는 package.json 설정에 따라 다를 수 있음)
# 예시:
# npx supabase gen types typescript --project-ref fbzikkwkrqdocmyitdvk > packages/types/src/supabase.ts
```

### 5단계: 개발 서버 실행
```bash
pnpm dev
```

---

## ⚡ 요약 (터미널 복사 붙여넣기용)
```bash
git pull origin main
pnpm install
npx supabase db push
pnpm dev
```

---

## ❓ FAQ. `db push`를 하면 팀원 데이터를 덮어쓰지 않나요?

**결론: 아니요, 안전합니다.**

`npx supabase db push`는 무조건 덮어쓰는(Overwrite) 명령어가 아니라, **"부족한 부분만 채워넣는(Append)"** 방식입니다.

1.  **비교**: Supabase가 현재 DB 상태와 로컬의 `migrations` 폴더를 비교합니다.
2.  **적용**: 이미 적용된 마이그레이션 파일은 건너뛰고, **새로 추가된 파일만 실행**합니다.
3.  **동기화**: 만약 팀원이 이미 원격 DB에 적용했다면, 로컬에서 명령어를 실행해도 "이미 최신 상태입니다(Up to date)"라고 뜨고 아무 일도 일어나지 않습니다.

**단, 주의할 점:**
같은 마이그레이션 파일(SQL)의 내용을 서로 다르게 수정해서 `git merge` 충돌이 났을 때는, **Git 충돌을 먼저 해결**한 후에 `db push`를 해야 합니다.
