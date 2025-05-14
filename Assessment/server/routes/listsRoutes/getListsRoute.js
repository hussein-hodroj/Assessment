import express from 'express';
import {getLists} from '../../controllers/listsControllers/getLists.js';

const router = express.Router();

router.get('/getLists', getLists);


export default router;