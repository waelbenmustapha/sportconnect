import User from "../../models/user.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findImageByPrefix = (directory, prefix) => {
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      if (file.startsWith(prefix)) {
        return path.join(directory, file);
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
  return null;
};

export default async (req, res) => {
  try {
    const users = await User.find({ role: 'recruiter' })
      .select('fullName email role recruiter')
      .populate({
        path: 'recruiter',
        populate: {
          path: 'currentClub',
          select: 'clubName',
        },
      });

    const usersWithRecruiterData = users.map(user => {
      const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${user._id}-profile`);
      const profileImageUrl = profileImagePath ? `/uploads/${path.basename(profileImagePath)}` : null;

      return {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl,
        recruiter: user.recruiter ? {
          gender: user.recruiter.gender,
          id:user.recruiter._id,
          dateOfBirth: user.recruiter.dateOfBirth,
          nationality: user.recruiter.nationality,
          country: user.recruiter.country,
          philosophy: user.recruiter.philosophy,
          currentClub: user.recruiter.currentClub ? user.recruiter.currentClub.clubName : null,
        } : null,
      };
    });

    res.status(200).json({ users: usersWithRecruiterData });
  } catch (error) {
    console.error("Error fetching users and recruiters:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};