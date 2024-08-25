
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export interface LocationResponseValue {
  latitude: number;
  longitude: number;
  name: string;
  image: string;
  radius: number;
}