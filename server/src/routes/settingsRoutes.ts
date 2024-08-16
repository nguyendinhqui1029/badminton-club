import SettingsController from '../controllers/settings.controller';
import express from 'express';

const router = express.Router();
const settingsController = new SettingsController();

router.get('/', settingsController.getAll);
router.get('/:id', settingsController.getById);
router.post('/', settingsController.create);
router.put('/:id', settingsController.update);
router.delete('/:id', settingsController.delete);

export default router;