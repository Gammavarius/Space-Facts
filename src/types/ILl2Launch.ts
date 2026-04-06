export interface ILl2Launch {
    name: string;
    net: string;
    rocket?: {
        configuration?: {
            name?: string;
        }
        name?: string;
    }
    launch_service_provider?: {
        name?: string;
    };
    image?: sting;
}