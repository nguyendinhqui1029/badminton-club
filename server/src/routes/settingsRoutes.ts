import SettingsController from '../controllers/settings.controller';
import express from 'express';

const router = express.Router();
const settingsController = new SettingsController();

router.get('/', settingsController.getSetting);
router.post('/', settingsController.create);
router.put('/:id', settingsController.update);
router.delete('/:id', settingsController.delete);

export default router;