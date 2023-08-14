import { Router } from 'express';
import { clearAll, getAll, identifyUser } from '../controllers/UserController';

const router = Router();

router.post('/identify', identifyUser);
router.post('/clear_all', clearAll);
router.post('/get_all', getAll);




export default router;
