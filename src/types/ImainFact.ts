export interface IMainFact {
    source: 'll2' | 'news' | 'arxiv' | 'apod';
    title: string;
    description?: string;
    image?: string;
    date: string;
    url?: string;
}