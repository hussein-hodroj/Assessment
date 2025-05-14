import express from 'express';
import {createNewTag} from '../../controllers/tagsControllers/createTag.js';

const router = express.Router();

router.post('/createTag', createNewTag);

export default router;