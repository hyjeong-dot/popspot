import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockPopups = [
    {
        title: '성수동 팝업스토어: 가을의 향기',
        brand: '아로마틱',
        category: 'beauty',
        description: '가을의 감성을 담은 새로운 향수를 성수동에서 가장 먼저 만나보세요. 다양한 시향 체험과 사은품 증정 이벤트가 준비되어 있습니다.',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'],
        address: '서울특별시 성동구 성수이로 123',
        lat: 37.5445,
        lng: 127.0560,
        region: '서울/성수',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        hours: '11:00 - 20:00',
        website: 'https://example.com',
        instagram: '@aromatic_seongsu',
        status: 'active'
    },
    {
        title: '홍대 캐릭터 팝업: 말랑이와 친구들',
        brand: '말랑컴퍼니',
        category: 'character',
        description: '귀여운 말랑이 캐릭터 굿즈가 가득한 홍대 팝업스토어! 한정판 인형과 스티커를 놓치지 마세요.',
        images: ['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1000&auto=format&fit=crop'],
        address: '서울특별시 마포구 어울마당로 45',
        lat: 37.5512,
        lng: 126.9209,
        region: '서울/홍대',
        start_date: '2024-02-01',
        end_date: '2024-08-31',
        hours: '10:00 - 22:00',
        website: 'https://example.com',
        instagram: '@mallang_friends',
        status: 'active'
    },
    {
        title: '강남 비건 레스토랑 팝업',
        brand: '그린테이블',
        category: 'food',
        description: '지구를 생각하는 맛있는 한 끼. 비건 식재료로 만든 특별한 코스 요리를 경험해 보세요.',
        images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop'],
        address: '서울특별시 강남구 강남대로 78',
        lat: 37.4981,
        lng: 127.0276,
        region: '서울/강남',
        start_date: '2024-01-15',
        end_date: '2024-05-15',
        hours: '12:00 - 21:00',
        status: 'active'
    },
    {
        title: '성수 패션 위크: 데님 셀렉션',
        brand: '블루진스',
        category: 'fashion',
        description: '당신에게 딱 맞는 데님을 찾아드립니다. 국내외 유명 데님 브랜드의 신상품을 한곳에서 만나보세요.',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop'],
        address: '서울특별시 성동구 아차산로 56',
        lat: 37.5450,
        lng: 127.0570,
        region: '서울/성수',
        start_date: '2024-03-01',
        end_date: '2024-04-30',
        hours: '11:00 - 19:00',
        status: 'active'
    },
    {
        title: '아트 갤러리 팝업: 빛의 조각',
        brand: '라이트아트',
        category: 'art',
        description: '빛과 그림자가 만들어내는 환상적인 예술의 세계. 인터랙티브 미디어 아트를 직접 체험해 보세요.',
        images: ['https://images.unsplash.com/photo-1547891301-10bcbc43694f?q=80&w=1000&auto=format&fit=crop'],
        address: '서울특별시 성동구 연무장길 89',
        lat: 37.5408,
        lng: 127.0536,
        region: '서울/성수',
        start_date: '2024-04-01',
        end_date: '2024-12-31',
        hours: '13:00 - 20:00',
        status: 'active'
    }
];

async function seed() {
    console.log('데이터 삽입 시작...');

    // 기존 데이터 삭제 (테스트용이므로 초기화)
    const { error: deleteError } = await supabase.from('popups').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error('기존 데이터 삭제 실패:', deleteError);
    }

    const { data, error } = await supabase.from('popups').insert(mockPopups);

    if (error) {
        console.error('데이터 삽입 실패:', error);
    } else {
        console.log('데이터 삽입 성공!');
    }
}

seed();
