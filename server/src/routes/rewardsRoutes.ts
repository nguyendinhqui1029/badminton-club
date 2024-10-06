import RewardController from '../controllers/rewards.controller';
import express from 'express';

const router = express.Router();
const rewardController = new RewardController();

router.get('/', rewardController.getAll);
router.get('/:id', rewardController.getById);
router.post('/', rewardController.create);
router.put('/:id', rewardController.update);
router.delete('/:id', rewardController.delete);

export default router;