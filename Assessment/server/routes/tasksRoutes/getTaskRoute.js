import express from 'express';
import {getTasks} from '../../controllers/tasksControllers/getTasks.js';

const router = express.Router();

router.get('/getTasks', getTasks);


export default router;