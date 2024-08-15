import SelfClaimController from '../controllers/self-claim.controller';
import express from 'express';

const router = express.Router();
const selfClaimController = new SelfClaimController();

router.get('/', selfClaimController.getAll);
router.get('/:id', selfClaimController.getById);
router.post('/', selfClaimController.create);
router.put('/:id', selfClaimController.update);
router.delete('/:id', selfClaimController.delete);

export default router;