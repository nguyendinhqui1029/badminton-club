
import { ApiResponseValue } from '../models/response-value.model';
import env from '../config/env';
import { LocationResponseValue } from '../models/location.model';
import axios from 'axios';
export default class LocationService {
  public async getLocationNearby(latitude: string, longitude: string, keyword: string): Promise<LocationResponseValue[]> {
    try {
      const response = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?in=circle:${latitude},${longitude};r=500&limit=20&apiKey=${env.HERE_PLACES_API_KEY}`);
      if(response.status === 200 && response.data) {
        if(!keyword) {
          return response.data.items;
        }
        return response.data.items.filter((item:LocationResponseValue)=>item.address?.label?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
      }
      return [];
    } catch (error: any) {
      console.error('Error:', error.message);
      return []
    }
  }
}

