// Supabase Database 타입 (supabase gen types 명령으로 생성 후 교체)
export type Database = {
    public: {
        Tables: {
            // 팝업스토어 테이블
            popups: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    address: string;
                    latitude: number;
                    longitude: number;
                    start_date: string;
                    end_date: string;
                    image_url: string | null;
                    category: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['popups']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['popups']['Insert']>;
            };
            // 사용자 테이블
            users: {
                Row: {
                    id: string;
                    email: string;
                    nickname: string | null;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            // 찜하기 테이블
            favorites: {
                Row: {
                    id: string;
                    user_id: string;
                    popup_id: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
};

// 편의 타입
export type Popup = Database['public']['Tables']['popups']['Row'];
export type PopupInsert = Database['public']['Tables']['popups']['Insert'];
export type PopupUpdate = Database['public']['Tables']['popups']['Update'];

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];

export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];

// API 응답 타입
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}

// 페이지네이션
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    totalPages: number;
}
