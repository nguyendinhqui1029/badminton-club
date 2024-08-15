export interface Language<T> {
    languageCode: string; 
    name: string;
    isDefault: boolean;
    data: T;
}