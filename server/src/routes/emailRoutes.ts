import EmailController from '../controllers/email.controller';
import express from 'express';

const router = express.Router();
const emailController = new EmailController();

router.post('/reset-password', emailController.sendCodeResetPassword);

export default router;