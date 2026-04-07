export interface ISpaceXLaunch {
    name: string;
    date_utc: string;
    links?: {
        patch?: {
            small?: string;
        }
    }
}