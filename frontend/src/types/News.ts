export interface News {
    id: string;
    title: string;
    spot?: string;
    content?: string;
    category: string;
    imageUrl: string;
    publishDate: string;
    views: number;
    status: string;
    positions: NewsPosition[];
    summary?: string;
    image: string | null;
    createdAt: string;
}

export type NewsPosition = 'manset' | 'yan_manset' | 'son_dakika' | 'alt_manset' | 'normal';

export interface NewsFormData {
    title: string;
    spot?: string;
    content?: string;
    category: string;
    summary?: string;
    positions: NewsPosition[];
    image?: string;
    imageUrl?: string;
    status?: string;
}