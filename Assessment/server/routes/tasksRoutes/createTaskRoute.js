import express from 'express';
import {createNewTask} from '../../controllers/tasksControllers/createTask.js';

const router = express.Router();

router.post('/createTask', createNewTask);


export default router;