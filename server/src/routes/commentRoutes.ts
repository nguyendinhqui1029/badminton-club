import CommentController from '../controllers/comment.controller';
import express from 'express';

const router = express.Router();
const commentController = new CommentController();

router.get('/', commentController.getAll);
router.get('/:id', commentController.getById);
router.post('/', commentController.create);
router.put('/:id', commentController.update);
router.delete('/:id', commentController.delete);

export default router;