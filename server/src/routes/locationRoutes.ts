import LocationController from '../controllers/location.controller';
import express from 'express';

const router = express.Router();
const locationController = new LocationController();

router.get('/nearby', locationController.getLocationNearBy);


export default router;