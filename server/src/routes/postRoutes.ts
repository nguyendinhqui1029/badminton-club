import PostController from '../controllers/post.controller';
import express from 'express';

const router = express.Router();
const postController = new PostController();

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', postController.create);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

export default router;