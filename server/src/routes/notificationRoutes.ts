import NotificationController from '../controllers/notification.controller';
import express from 'express';

const router = express.Router();
const notificationController = new NotificationController();

router.get('/from', notificationController.getAllNotificationFromUser);
router.get('/to', notificationController.getAllNotificationToUser);
router.post('/', notificationController.create);
router.put('/', notificationController.update);

export default router;