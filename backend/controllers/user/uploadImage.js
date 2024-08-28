import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import User from "../../models/user.js";

// Resolve the directory name from import.meta.url
const uploadPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");

// Function to delete existing profile image
const deleteExistingImage = (id, suffix) => {
  const files = fs.readdirSync(uploadPath);
  const existingFile = files.find(file => file.startsWith(`${id}${suffix}`));
  if (existingFile) {
    fs.unlinkSync(path.join(uploadPath, existingFile));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { id } = req.params; // Get id from URL params
    const suffix = req.originalUrl.includes('background') ? '-background' : '-profile';
    
    // Delete existing image before uploading new one
    deleteExistingImage(id, suffix);
    
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

      const { id } = req.params; // Get id from URL params
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      res.status(200).json({ message: "Image uploaded successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};