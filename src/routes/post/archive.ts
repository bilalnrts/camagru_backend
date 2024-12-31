import {Router} from 'express';
import {archivePost} from '../../controllers/post/archivePost';

const router = Router();

router.post('/', archivePost);

export default router;
