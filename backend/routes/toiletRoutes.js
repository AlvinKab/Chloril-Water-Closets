import { Router } from 'express';
import authenticateJWT from '../middleware/authMiddleware.js';
import authRoles from '../middleware/roleMiddleware.js';
import toiletController from '../controllers/toiletController.js';

const router = Router();

router.get('/total-men-stalls', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalMenStallNo);
router.get('/total-women-stalls', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalWomenStallNo);
router.get('/total-stalls', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalStallNo);
router.get('/total-urinals', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalUrinalNo);
router.get('/total-men-sinks', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalMenSinkNo);
router.get('/total-women-sinks', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalWomenSinkNo);
router.get('/total-sinks', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getTotalSinkNo);
router.get('/:name', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getOneToilet);
router.get('/', authenticateJWT, authRoles("Admin", "Manager"), toiletController.getAllToilets);
router.put('/:name/men', authenticateJWT, authRoles("Admin", "Manager"), toiletController.updateMenToilet);
router.put('/:name/women', authenticateJWT, authRoles("Admin", "Manager"), toiletController.updateWomenToilet);

export default router;