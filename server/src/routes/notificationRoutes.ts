import NotificationController from '../controllers/notification.controller';
import express from 'express';

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', notificationController.getAllNotificationToUser);
router.post('/', notificationController.create);
router.put('/', notificationController.update);

export default router;