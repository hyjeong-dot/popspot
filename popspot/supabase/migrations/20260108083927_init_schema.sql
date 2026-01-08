-- [PopSpot] 자동화 마이그레이션 (초기화 및 생성)
-- 용도: npx supabase db push 명령어로 원격 DB에 적용

-- 1. 기존 데이터 초기화 (충돌 방지용)
drop trigger if exists on_auth_user_created on auth.users cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists update_updated_at_column() cascade;

drop table if exists edit_suggestions cascade;
drop table if exists inquiries cascade;
drop table if exists notices cascade;
drop table if exists reports cascade;
drop table if exists comments cascade;
drop table if exists favorites cascade;
drop table if exists popups cascade;
drop table if exists profiles cascade;

drop type if exists user_role cascade;
drop type if exists verification_status cascade;
drop type if exists popup_status cascade;
drop type if exists report_type cascade;
drop type if exists process_status cascade;
drop type if exists inquiry_status cascade;
drop type if exists popup_category cascade;
drop type if exists popup_region cascade;

-- 2. 필수 확장 활성화
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 3. ENUM 타입 설정
create type user_role as enum ('user', 'business', 'admin');
create type verification_status as enum ('pending', 'approved', 'rejected');
create type popup_status as enum ('active', 'ended', 'deleted');
create type report_type as enum ('wrong_info', 'ended', 'duplicate', 'spam', 'other');
create type process_status as enum ('pending', 'approved', 'rejected');
create type inquiry_status as enum ('pending', 'answered');
create type popup_category as enum ('fashion', 'beauty', 'character', 'food', 'lifestyle', 'art', 'entertainment', 'other');
create type popup_region as enum ('서울/성수', '서울/홍대', '서울/강남', '서울/명동', '서울/여의도', '서울/기타', '경기', '부산', '기타');

-- 4. 유틸리티 함수
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 5. 테이블 생성

-- 사용자 프로필
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  nickname text not null,
  profile_image_url text,
  role user_role default 'user'::user_role,
  business_number text,
  company_name text,
  representative_name text,
  verification_status verification_status default 'pending'::verification_status,
  verified_at timestamptz,
  notifications_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 팝업스토어
create table popups (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  brand text not null,
  category popup_category not null,
  description text not null,
  images text[] default '{}',
  address text not null,
  lat double precision not null,
  lng double precision not null,
  region popup_region not null,
  start_date date not null,
  end_date date not null,
  hours text,
  website text,
  instagram text,
  likes_count int default 0,
  comment_count int default 0,
  report_count int default 0,
  status popup_status default 'active'::popup_status,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 찜하기
create table favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  popup_id uuid references popups(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, popup_id)
);

-- 댓글
create table comments (
  id uuid default gen_random_uuid() primary key,
  popup_id uuid references popups(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 신고
create table reports (
  id uuid default gen_random_uuid() primary key,
  popup_id uuid references popups(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete set null not null,
  type report_type not null,
  description text,
  status process_status default 'pending'::process_status,
  processed_by uuid references profiles(id),
  processed_at timestamptz,
  created_at timestamptz default now()
);

-- 공지사항
create table notices (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  is_important boolean default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 1:1 문의
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  status inquiry_status default 'pending'::inquiry_status,
  answer text,
  answered_by uuid references profiles(id),
  answered_at timestamptz,
  created_at timestamptz default now()
);

-- 수정 제안
create table edit_suggestions (
  id uuid default gen_random_uuid() primary key,
  popup_id uuid references popups(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  field text not null,
  current_value text,
  suggested_value text not null,
  reason text,
  status process_status default 'pending'::process_status,
  processed_by uuid references profiles(id),
  processed_at timestamptz,
  created_at timestamptz default now()
);

-- 6. 트리거 적용
create trigger handle_updated_at_profiles before update on profiles for each row execute procedure update_updated_at_column();
create trigger handle_updated_at_popups before update on popups for each row execute procedure update_updated_at_column();
create trigger handle_updated_at_comments before update on comments for each row execute procedure update_updated_at_column();
create trigger handle_updated_at_notices before update on notices for each row execute procedure update_updated_at_column();

-- 7. RLS 보안 설정
alter table profiles enable row level security;
alter table popups enable row level security;
alter table favorites enable row level security;
alter table comments enable row level security;

create policy "공공 프로필 조회" on profiles for select using (true);
create policy "본인 프로필 수정" on profiles for update using (auth.uid() = id);
create policy "모든 팝업 조회" on popups for select using (true);

-- 8. 회원가입 시 프로필 자동 생성 (Auth 통합)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nickname, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nickname', '팝스팟유저'), 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
