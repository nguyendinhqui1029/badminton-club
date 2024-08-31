import QrCodeController from '../controllers/qr-code.controller';
import express from 'express';

const router = express.Router();
const qrCodeController = new QrCodeController();

router.get('/:id', qrCodeController.getByPaymentId);

export default router;