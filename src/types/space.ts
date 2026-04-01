export interface IApodResponse {
    date: string;
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    copyright?: string;
    service_vercion: string;
}