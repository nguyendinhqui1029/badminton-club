export interface DataSearchGroup<T> {
    id: string;
    groupName: string;
    children: (Omit<T, 'id'> & {id: string})[];
}