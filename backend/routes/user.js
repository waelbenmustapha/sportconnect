import { Router } from "express";
import { deleteUser, getUser, login, register, retrieveUser, retrieveUserSearch, uploadImage2 } from "../controllers/user/index.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import uploadImage from "../controllers/user/uploadImage.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import  updateUserInfo  from "../controllers/user/userController.js";

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.post("/login", login);
router.get("/get", authMiddleware, getUser);
router.post("/register", register);
router.post("/retrieve", retrieveUser);
router.post('/upload-image/:id', uploadImage);
router.post('/upload-background-image/:id', uploadImage);
router.post('/upload-imagep/', uploadImage2);
router.put('/update-user-info', updateUserInfo);
router.post('/retrieve-by-email',retrieveUserSearch);
router.delete('/deleteuser', authMiddleware, deleteUser);
router.get('/image/:id', (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(__dirname, '../../uploads', `${id}-profile.jpg`); 

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: "Profile image not found" });
  }
});

router.get('/background-image/:id', (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(__dirname, '../../uploads', `${id}-background.jpg`); 
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: "Background image not found" });
  }
});

export default router;
