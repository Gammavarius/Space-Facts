export interface ISpacexLaunch {
    name: string;
    date_utc: string;
    links?: {
        path?: {
            small?: string;
        }
    }
}