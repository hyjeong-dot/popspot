import { Card, Button } from '@popspot/ui';

export default function AdminDashboard() {
    // 임시 통계 데이터
    const stats = [
        { label: '총 팝업스토어', value: '127', change: '+12%', color: 'violet' },
        { label: '진행 중', value: '45', change: '+5%', color: 'green' },
        { label: '예정', value: '23', change: '+8%', color: 'blue' },
        { label: '총 사용자', value: '1,234', change: '+15%', color: 'amber' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="sidebar fixed left-0 top-0 h-full text-white p-6">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold">PopSpot</h1>
                    <p className="text-violet-300 text-sm">Admin Panel</p>
                </div>

                <nav className="space-y-2">
                    {[
                        { name: '대시보드', icon: '📊', active: true },
                        { name: '팝업스토어 관리', icon: '🏪', active: false },
                        { name: '사용자 관리', icon: '👥', active: false },
                        { name: '카테고리', icon: '📁', active: false },
                        { name: '통계', icon: '📈', active: false },
                        { name: '설정', icon: '⚙️', active: false },
                    ].map((item) => (
                        <a
                            key={item.name}
                            href="#"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                                    ? 'bg-white/20 text-white'
                                    : 'text-violet-200 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[280px] p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">대시보드</h2>
                        <p className="text-slate-500">팝업스토어 현황을 한눈에 확인하세요</p>
                    </div>
                    <Button variant="primary">+ 새 팝업스토어</Button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <span className="text-sm text-green-500 font-medium bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <div
                                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600`}
                            />
                        </Card>
                    ))}
                </div>

                {/* Recent Popups Table */}
                <Card padding="none">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">최근 등록된 팝업스토어</h3>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>카테고리</th>
                                <th>기간</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: '나이키 에어맥스 팝업', category: '패션', period: '1.15 - 1.30', status: '진행중' },
                                { name: '스타벅스 신년 팝업', category: '음식', period: '1.10 - 1.25', status: '진행중' },
                                { name: '삼성 갤럭시 체험존', category: '테크', period: '1.20 - 2.10', status: '예정' },
                            ].map((popup, i) => (
                                <tr key={i}>
                                    <td className="font-medium text-slate-900">{popup.name}</td>
                                    <td>
                                        <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                                            {popup.category}
                                        </span>
                                    </td>
                                    <td>{popup.period}</td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${popup.status === '진행중'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {popup.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="ghost" size="sm">
                                            수정
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </main>
        </div>
    );
}
