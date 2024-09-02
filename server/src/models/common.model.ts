export interface Language<T> {
  languageCode: string;
  name: string;
  isDefault: boolean;
  data: T;
}

export interface SearchByKeywordResponseValue {
  type: 'POST' | 'EVENT' | 'USER';
  name: string;
  id: string;
  avatar: string;
}