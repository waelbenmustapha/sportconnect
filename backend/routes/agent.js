import { Router } from "express";
import { addAgent, getAgent, getAgentsSearch, removePlayerFromAgent, removeRecruiterFromAgent } from "../controllers/agent/index.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import addPlayer from "../controllers/agent/addPlayers.js";
import addRecruiter from "../controllers/agent/addRecruiters.js";
const router = Router();

router.post("/addagent",authMiddleware, addAgent);
router.get("/get", authMiddleware, getAgent);
router.get("/getagentssearch",getAgentsSearch);
router.post('/addPlayer', addPlayer);
router.post('/addRecruiter', addRecruiter);
router.post('/removePlayer', authMiddleware, removePlayerFromAgent);
router.post('/removeRecruiter', authMiddleware, removeRecruiterFromAgent);


export default router;
