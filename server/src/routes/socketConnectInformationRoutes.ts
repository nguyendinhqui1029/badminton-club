import SocketConnectInformationController from '../controllers/socket-connect-information.controller';
import express from 'express';

const router = express.Router();
const socketConnectInformationController = new SocketConnectInformationController();

router.get('/:id', socketConnectInformationController.getBySocketId);
router.post('/', socketConnectInformationController.create);
router.put('/:id', socketConnectInformationController.update);
router.delete('/:id', socketConnectInformationController.delete);

export default router;