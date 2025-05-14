import express from 'express';
import {updateTask} from '../../controllers/tasksControllers/updateTask.js';

const router = express.Router();

router.put('/updateTask/:id', updateTask);


export default router;