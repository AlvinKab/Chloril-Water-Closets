import { Router } from 'express';
import authenticateJWT from '../middleware/authMiddleware.js';
import authRoles from '../middleware/roleMiddleware.js';
import branchController from '../controllers/branchController.js';

const router = Router();

router.get('/total-revenue', authenticateJWT, authRoles("Admin", "Manager"), branchController.getTotalRevenue);
router.get('/total-budget', authenticateJWT, authRoles("Admin", "Manager"), branchController.getTotalBudget);
router.get('/:id', authenticateJWT, authRoles("Admin", "Manager"), branchController.getOneBranch);
router.get('/', authenticateJWT, authRoles("Admin", "Manager"), branchController.getAllBranches);
router.post('/', authenticateJWT, authRoles("Admin", "Manager"), branchController.createBranch);
router.put('/update-revenue/:id', authenticateJWT, authRoles("Admin", "Manager"), branchController.updateRevenue);
router.put('/update-budget/:id', authenticateJWT, authRoles("Admin", "Manager"), branchController.updateBudget);
router.delete('/:id', authenticateJWT, authRoles("Admin", "Manager"), branchController.deleteBranch);

export default router;