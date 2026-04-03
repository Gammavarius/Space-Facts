export interface IMainFact {
    source: 'll2' | 'news' | 'arxiv' | 'apod';
    titleOriginal?: string;
    title: string;
    descriptionOriginal?: string;
    description?: string;
    image?: string;
    date: string;
    url?: string;
}