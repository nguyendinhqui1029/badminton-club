import TransactionController from '../controllers/transaction.controller';
import express from 'express';

const router = express.Router();
const transactionController = new TransactionController();

router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.get('/sum-amount/months', transactionController.getAmountByMonths);

router.post('/', transactionController.create);
router.post('/multiple', transactionController.createMultiple);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);


export default router;