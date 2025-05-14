import express from 'express';
import { dragDropTask } from '../../controllers/tasksControllers/dragDropTask.js';

const router = express.Router();

router.put('/dragDropTasks/:id', dragDropTask);

export default router;