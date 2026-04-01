export interface IAstronaut {
    name: string;
    craft: string;
}

export interface IAstronautsResponse {
    number: number;
    people: IAstronaut[];
    message: string;
}