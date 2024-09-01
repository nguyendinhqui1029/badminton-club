import PushNotificationController from '../controllers/push-notification.controller';
import express from 'express';

const router = express.Router();
const pushNotificationController = new PushNotificationController();

router.post('/send-notification', pushNotificationController.sendNotification);
router.post('/subscription', pushNotificationController.subscription);
export default router;