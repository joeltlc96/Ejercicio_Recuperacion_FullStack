import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { listTasks, createTask, completeTask, deleteTask } from '../controllers/tasks.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', listTasks);
router.post('/', createTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
