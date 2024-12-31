import {Router} from 'express';
import {createLike} from '../../controllers/like/createLike';

const router = Router();

router.post('/', createLike);

export default router;
