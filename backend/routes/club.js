import express from 'express';
import addClub from '../controllers/club/addClub.js';
import checkClub from '../controllers/club/checkClub.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import getAgentClubs from '../controllers/club/getAgentClubs.js';
import getRecruiterClubs from '../controllers/club/getRecruiterClubs.js';
import getClubs from '../controllers/club/getClubs.js';
import updateClub from '../controllers/club/updateClub.js';
import addPastClub from '../controllers/club/addPastClub.js'; // New controller for adding past club
import retrieveClub from '../controllers/club/retrieveClub.js'; // Import the new retrieveClub controller
import getClubsSearch from '../controllers/club/getClubsSearch.js';
import { addPlayerToClub, removePlayerFromClub, retrieveClubPlayers } from '../controllers/club/index.js';
import updatePlayer from '../controllers/club/updatePlayer.js';
import updatePastClub from '../controllers/club/updatePastClub.js';
const router = express.Router();

router.post('/addclub', authMiddleware, addClub);
router.get('/check', checkClub);
router.get('/getagentclubs', authMiddleware, getAgentClubs);
router.get('/getrecruiterclubs', authMiddleware, getRecruiterClubs);
router.get('/all', authMiddleware, getClubs);
router.post('/update-club', authMiddleware, updateClub);
router.post('/add-past-club', authMiddleware, addPastClub); // New route for adding past club
router.post('/retrieve', retrieveClub); // Add the retrieve route
router.get('/getclubssearch',getClubsSearch);
router.post('/add-player', authMiddleware, addPlayerToClub); // Add the new route
router.post('/club-players', retrieveClubPlayers);
router.put('/update-player', updatePlayer);
router.post('/remove-player-from-club', removePlayerFromClub);
router.post('/update-past-club', updatePastClub);




export default router;
