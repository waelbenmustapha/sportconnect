import { Router } from "express";
import { getPlayer, addPlayer,getPlayers, getPlayersSearch, uploadVideo, getVideo } from "../controllers/player/index.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/addplayer",authMiddleware, addPlayer);
router.get("/get", authMiddleware, getPlayer);
router.get("/getplayers",getPlayers);
router.get("/getplayerssearch",getPlayersSearch);
router.post('/upload-video/:id', uploadVideo);
router.get('/get-video/:id', getVideo);

export default router;
