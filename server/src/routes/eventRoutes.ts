import EventController from '../controllers/event.controller';
import express from 'express';

const router = express.Router();
const eventController = new EventController();

router.get('/', eventController.getAll);
router.get('/all/:id', eventController.getAllByUserId);
router.get('/:id', eventController.getById);

router.post('/', eventController.create);
router.put('/:id', eventController.update);
router.delete('/:id', eventController.delete);

export default router;