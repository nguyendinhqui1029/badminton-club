export interface CommonOption<T= string> {
    label: string;
    value: string;
    subValue?: T;
}