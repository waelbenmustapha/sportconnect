import Player from "../../models/player.js";
import User from "../../models/user.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find image by prefix (e.g., "userId-profile")
const findImageByPrefix = (directory, prefix) => {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.startsWith(prefix)) {
      return path.join(directory, file);
    }
  }
  return null;
};

export default async (req, res) => {
  try {
    // Retrieve all users with the role of 'player' and populate their player and current club data
    const users = await User.find({ role: 'player' }).populate({
      path: 'player',
      populate: {
        path: 'currentClub',
        select: 'clubName', // Only select the clubName field from the Club model
      },
    });

    // Map the response to include player data and profile image
    const usersWithPlayerData = users.map(user => {
      // Find profile image
      const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${user._id}-profile`);
      const profileImageUrl = profileImagePath ? `/uploads/${path.basename(profileImagePath)}` : null;

      return {
        fullName: user.fullName,
        email: user.email,
        id:user._id,
        role: user.role,
        profileImageUrl, // Include the profile image URL in the response
        player: user.player ? {
          ...user.player.toObject(),
          currentClub: user.player.currentClub ? user.player.currentClub.clubName : null,
        } : null,
      };
    });

    res.status(200).json({ users: usersWithPlayerData });
  } catch (error) {
    console.error("Error fetching users and players:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
