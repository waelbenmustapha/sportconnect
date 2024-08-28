import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import User from "../../models/user.js";
import mongoose from "mongoose";
// Resolve the directory name from import.meta.url
const uploadPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const id = new mongoose.Types.ObjectId();
    const suffix = req.originalUrl.includes('background') ? '-background' : '-profile';
    cb(null, `${id}${suffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

export default async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed" });
      }



      res.status(200).json({ message: "Image uploaded successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
