export interface Popup {
    id: string;
    title: string;
    brand: string;
    category: string;
    image: string;
    location: string;
    date: string;
    description: string;
    tags: string[];
}

export const mockPopups: Popup[] = [
    {
        id: '1',
        title: '잠실 메타몽 팝업스토어',
        brand: 'Pokemon Korea',
        category: 'Character',
        image: '/images/ditto_popup.png',
        location: '서울 송파구 롯데월드몰 1F',
        date: '2026.01.05 - 2026.01.31',
        description: '말랑말랑 귀여운 메타몽의 모든 것! 한정판 굿즈와 대형 포토존까지.',
        tags: ['포켓몬', '메타몽', '롯데월드몰', '웨이팅필수'],
    },
    {
        id: '2',
        title: 'Glow Up Beauty Studio',
        brand: 'Pure Glow',
        category: 'Beauty',
        image: '/images/beauty_popup.png',
        location: '서울 마포구 와우산로',
        date: '2026.02.10 - 2026.02.20',
        description: '당신의 본연의 아름다움을 찾아주는 퍼스널 컬러 진단과 메이크업 체험.',
        tags: ['체험형', '메이크업', '이벤트'],
    },
    {
        id: '3',
        title: 'Future Tech Experience',
        brand: 'Cyber Systems',
        category: 'Tech',
        image: '/images/tech_popup.png',
        location: '서울 강남구 테헤란로',
        date: '2026.03.01 - 2026.03.15',
        description: '미래 기술을 먼저 경험해보세요. AI 로봇과 AR 글래스 체험존.',
        tags: ['AI', 'AR', '얼리버드'],
    },
    {
        id: '4',
        title: 'Retro Arcade Zone',
        brand: 'Pixel Play',
        category: 'Entertainment',
        image: '/images/fashion_popup.png',
        location: '서울 용산구 이태원로',
        date: '2026.02.15 - 2026.02.28',
        description: '8090 추억의 오락실이 돌아왔다! 레트로 게임 대항전.',
        tags: ['레트로', '게임', '뉴트로'],
    },
];
