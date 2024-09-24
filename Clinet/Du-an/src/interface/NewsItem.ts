// News.interface.ts
export interface NewsItem {
    id: number;
    title: string;
    news_category_id: number;
    thumnail: string;
    content: string;
    status: 'Show' | 'Hidden';
    user_id: number;
    created_at: string;
    updated_at: string;
  }
  