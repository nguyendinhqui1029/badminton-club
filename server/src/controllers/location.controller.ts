import LocationService from '../services/location.service';
import { Request, Response } from 'express';

export default class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  public getLocationNearBy = async (req: Request, res: Response): Promise<void> => {
    try {
      const latitude  = (req.query['latitude'] || '').toString();
      const longitude  = (req.query['longitude'] || '').toString();
      const keyword  = (req.query['keyword'] || '').toString();

      if (!latitude || !longitude) {
        res.status(200).json({
           statusCode: 400,
           statusText: 'Latitude and longitude are required',
           totalCount: 0,
           page: 0,
           data: null 
         });
         return;
       }
      const result = await this.locationService.getLocationNearby(latitude, longitude, keyword);
      res.status(200).json({
        statusCode: 200,
        statusText: 'Get location success',
        totalCount: 0,
        page: 0,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}