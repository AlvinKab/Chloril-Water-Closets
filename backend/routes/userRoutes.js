import { Router } from 'express';
import authenticateJWT from '../middleware/authMiddleware.js';
import authRoles from '../middleware/roleMiddleware.js';
import userController from '../controllers/userController.js';

const router = Router();

router.post('/admin', authenticateJWT, authRoles("Admin"), userController.addUser);
router.put('/admin/:id', authenticateJWT, authRoles("Admin"), userController.editUser);
router.put('/change-password', authenticateJWT, authRoles("Admin", "Manager"), userController.changeOwnUserPassword);
router.put('admin/change-password/:id', authenticateJWT, authRoles("Admin"), userController.changeUserPasswordAsAdmin);
router.delete('/admin/:id', authenticateJWT, authRoles("Admin"), userController.deleteUser);

export default router;