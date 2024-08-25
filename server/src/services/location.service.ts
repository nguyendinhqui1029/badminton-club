
import { ApiResponseValue } from '../models/response-value.model';
import env from '../config/env';
import { LocationResponseValue } from '../models/location.model';
import axios from 'axios';
export default class LocationService {
  public async getLocationNearby(latitude: string, longitude: string, keyword: string): Promise<LocationResponseValue[]|undefined> {
    try {
      console.log('response', env.HERE_PLACES_API_KEY)

      const response = await axios.get(`https://places.ls.hereapi.com/places/v1/autosuggest?at=${latitude},${longitude}&q=${keyword}&apiKey=${env.HERE_PLACES_API_KEY}`);
      // {
      //   "title": "Chrysler Building",
      //   "highlightedTitle": "<b>Chrysler</b> Building",
      //   "vicinity": "405 Lexington Ave\nNew York, NY 10017",
      //   "position": [ 40.75185, -73.97572 ],
      //   "category": "sights-museums",
      //   "href": "https://...",
      //   "type": "urn:nlp-types:place"
      // }
      if (response.data.status === 200) {
        console.log(response)
      } 
      return new Promise<LocationResponseValue[]>((resolve) => {
        resolve(response.data as LocationResponseValue[]);
      });
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
}

