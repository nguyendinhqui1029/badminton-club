import PushNotificationController from '../controllers/push-notification.controller';
import express from 'express';

const router = express.Router();
const pushNotificationController = new PushNotificationController();

router.post('/', pushNotificationController.sendNotification);

export default router;