import express from 'express';
import {deleteTask} from '../../controllers/tasksControllers/deleteTask.js';

const router = express.Router();

router.post('/deleteTask/:id', deleteTask);


export default router;