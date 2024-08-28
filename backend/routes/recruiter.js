import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import addRecruiter from "../controllers/recruiter/addRecruiter.js";
import getRecruiter from "../controllers/recruiter/getRecruiter.js";
import getRecruitersSearch from "../controllers/recruiter/getRecruitersSearch.js";
const router = Router();

router.post("/addrecruiter",authMiddleware, addRecruiter);
router.get("/getrecruiter", authMiddleware, getRecruiter);
router.get("/getrecruiterssearch",getRecruitersSearch);
export default router;
