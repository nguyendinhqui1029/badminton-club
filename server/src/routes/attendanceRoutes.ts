import AttendanceController from '../controllers/attendance.controller';
import express from 'express';

const router = express.Router();
const attendanceController = new AttendanceController();

router.get('/by-user', attendanceController.getAllByIdUser);
router.get('/by-created-date', attendanceController.getAllByCreatedDate);
router.get('/', attendanceController.getAll);
router.get('/:id', attendanceController.getById);
router.post('/', attendanceController.create);
router.put('/:id', attendanceController.update);
router.delete('/:id', attendanceController.delete);

export default router;