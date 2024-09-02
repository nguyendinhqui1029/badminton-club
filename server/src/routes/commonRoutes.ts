import CommonController from '../controllers/common.controller';
import express from 'express';

const router = express.Router();
const commonController = new CommonController();

router.get('/search', commonController.searchByKeyword);

export default router;