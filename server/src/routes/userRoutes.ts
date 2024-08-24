import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

router.get('/search/:id', userController.searchFriendUserByKeyword);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh-token', userController.refreshToken);
router.post('/reset-password', userController.resetPassword);

export default router;