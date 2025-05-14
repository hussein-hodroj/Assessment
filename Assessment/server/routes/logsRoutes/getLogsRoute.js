import express from 'express'; 
import {getLogs} from '../../controllers/logsControllers/getLogs.js'

const router = express.Router();

router.get('/getLogs', getLogs)

export default router;