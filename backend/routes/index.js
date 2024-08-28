import { Router } from 'express';
import user from './user.js';
import player from './player.js';
import recruiter from './recruiter.js';
import agent from './agent.js';
import club from './club.js';
const router = Router();


router.use('/user', user);
router.use('/player', player);
router.use('/agent',agent);
router.use('/club',club);
router.use('/recruiter',recruiter);
export default router;