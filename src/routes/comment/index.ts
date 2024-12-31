import {Router} from 'express';
import {createComment} from '../../controllers/comment/createComment';

const router = Router();

router.post('/', createComment);

export default router;
