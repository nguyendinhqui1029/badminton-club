export interface AddressResponse {
    label: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    state: string;
    country: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
    houseNumber: string;
  }
  
  export interface ContactsResponse {
    phone: { value: string; }[];
  }
  
  export interface OpeningHours {
    text: string[];
    isOpen: boolean;
  }
  export interface LocationResponseValue {
    title: string;
    id: string;
    resultType: string;
    position: {
      lat: number;
      lng: number;
    };
    address: AddressResponse;
    contacts: ContactsResponse[];
    openingHours: OpeningHours[];
  }

  export interface LocationRequestParams {
    keyword: string;
    latitude: number | null;
    longitude: number | null;
  }