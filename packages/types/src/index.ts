// ============================================
// PopSpot Database Types (Supabase)
// ============================================

// Enum Types
export type UserRole = 'user' | 'business' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type PopupStatus = 'active' | 'ended' | 'deleted';
export type ReportType = 'wrong_info' | 'ended' | 'duplicate' | 'spam' | 'other';
export type ProcessStatus = 'pending' | 'processed' | 'ignored';
export type InquiryStatus = 'pending' | 'answered';
export type PopupCategory = 'fashion' | 'beauty' | 'character' | 'food' | 'lifestyle' | 'art' | 'entertainment' | 'other';
export type PopupRegion = '서울/성수' | '서울/홍대' | '서울/강남' | '서울/명동' | '서울/여의도' | '서울/기타' | '경기' | '부산' | '기타';

// ============================================
// Database Schema Types
// ============================================

export type Profile = {
    id: string;
    email: string;
    nickname: string;
    profile_image_url: string | null;
    role: UserRole;
    business_number: string | null;
    company_name: string | null;
    representative_name: string | null;
    verification_status: VerificationStatus;
    verified_at: string | null;
    notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
};

export type Popup = {
    id: string;
    title: string;
    brand: string;
    category: PopupCategory;
    description: string;
    images: string[];
    address: string;
    lat: number;
    lng: number;
    region: PopupRegion;
    start_date: string;
    end_date: string;
    hours: string | null;
    website: string | null;
    instagram: string | null;
    likes_count: number;
    comment_count: number;
    report_count: number;
    status: PopupStatus;
    created_by: string | null;
    created_at: string;
    updated_at: string;
};

export type Favorite = {
    id: string;
    user_id: string;
    popup_id: string;
    created_at: string;
};

export type Comment = {
    id: string;
    popup_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
};

export type Report = {
    id: string;
    popup_id: string;
    user_id: string;
    type: ReportType;
    description: string | null;
    status: ProcessStatus;
    processed_by: string | null;
    processed_at: string | null;
    created_at: string;
};

export type Notice = {
    id: string;
    title: string;
    content: string;
    is_important: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
};

export type Inquiry = {
    id: string;
    user_id: string;
    title: string;
    content: string;
    status: InquiryStatus;
    answer: string | null;
    answered_by: string | null;
    answered_at: string | null;
    created_at: string;
};

export type EditSuggestion = {
    id: string;
    popup_id: string;
    user_id: string;
    field: string;
    current_value: string | null;
    suggested_value: string;
    reason: string | null;
    status: ProcessStatus;
    processed_by: string | null;
    processed_at: string | null;
    created_at: string;
};

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id'>>;
            };
            popups: {
                Row: Popup;
                Insert: Omit<Popup, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comment_count' | 'report_count'>;
                Update: Partial<Omit<Popup, 'id'>>;
            };
            favorites: {
                Row: Favorite;
                Insert: Omit<Favorite, 'id' | 'created_at'>;
                Update: Partial<Omit<Favorite, 'id'>>;
            };
            comments: {
                Row: Comment;
                Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Comment, 'id'>>;
            };
            reports: {
                Row: Report;
                Insert: {
                    popup_id: string;
                    user_id: string;
                    type: ReportType;
                    description: string | null;
                };
                Update: {
                    status?: ProcessStatus;
                    processed_by?: string | null;
                    processed_at?: string | null;
                    type?: ReportType;
                    description?: string | null;
                };
            };
            notices: {
                Row: Notice;
                Insert: Omit<Notice, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Notice, 'id'>>;
            };
            inquiries: {
                Row: Inquiry;
                Insert: Omit<Inquiry, 'id' | 'created_at' | 'status' | 'answer' | 'answered_by' | 'answered_at'>;
                Update: Partial<Omit<Inquiry, 'id'>>;
            };
            edit_suggestions: {
                Row: EditSuggestion;
                Insert: Omit<EditSuggestion, 'id' | 'created_at' | 'status' | 'processed_by' | 'processed_at'>;
                Update: Partial<Omit<EditSuggestion, 'id'>>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            user_role: UserRole;
            verification_status: VerificationStatus;
            popup_status: PopupStatus;
            report_type: ReportType;
            process_status: ProcessStatus;
            inquiry_status: InquiryStatus;
            popup_category: PopupCategory;
            popup_region: PopupRegion;
        };
    };
};

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id'>>;

export type PopupInsert = Omit<Popup, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comment_count' | 'report_count'>;
export type PopupUpdate = Partial<Omit<Popup, 'id'>>;

export type FavoriteInsert = Omit<Favorite, 'id' | 'created_at'>;

export type CommentInsert = Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
export type CommentUpdate = Partial<Omit<Comment, 'id'>>;

export type ReportInsert = Omit<Report, 'id' | 'created_at' | 'status' | 'processed_by' | 'processed_at'>;
export type ReportUpdate = Partial<Omit<Report, 'id'>>;

export type NoticeInsert = Omit<Notice, 'id' | 'created_at' | 'updated_at'>;
export type NoticeUpdate = Partial<Omit<Notice, 'id'>>;

export type InquiryInsert = Omit<Inquiry, 'id' | 'created_at' | 'status' | 'answer' | 'answered_by' | 'answered_at'>;

export type EditSuggestionInsert = Omit<EditSuggestion, 'id' | 'created_at' | 'status' | 'processed_by' | 'processed_at'>;


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

// 필터 타입
export interface PopupFilters {
    category?: PopupCategory;
    region?: PopupRegion;
    startDate?: string;
    endDate?: string;
    query?: string;
    status?: PopupStatus;
}

// 사용자 프로필과 팝업이 결합된 타입
export interface PopupWithProfile extends Popup {
    profile?: Profile;
    isFavorited?: boolean;
}

export interface CommentWithProfile extends Comment {
    profile?: Profile;
}
