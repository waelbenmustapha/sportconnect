import clubPlayer from "../../models/clubplayer.js";
import Club from "../../models/club.js";
import User from "../../models/user.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getImageBase64 = (imagePath) => {
  if (imagePath && fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    const mimeType = path.extname(imagePath).slice(1);
    return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
  }
  return null;
};

export default async (req, res) => {
  try {
    const { clubId } = req.body;

    if (!clubId) {
      return res.status(400).json({ message: "Please provide a club ID" });
    }

    const club = await Club.findById(clubId).populate('players');

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const playerIds = club.players.map(player => player._id);

    const clubPlayers = await clubPlayer.find({ _id: { $in: playerIds } });

    const playersWithImages = await Promise.all(clubPlayers.map(async (player) => {
      const extensions = ['png', 'jpg', 'jpeg', 'gif','avif'];
      let profileImage = null;

      for (const ext of extensions) {
        const profileImagePath = path.join(__dirname, '../../uploads', `${player.imgid}-profile.${ext}`);
        if (fs.existsSync(profileImagePath)) {
          profileImage = getImageBase64(profileImagePath);
          break;
        }
      }

      // Search for a user with _id matching player's imgid
      let user = null;
      let editable = true; // Set to true by default

      try {
        // Convert the string imgid back to an ObjectId
        const userId = new mongoose.Types.ObjectId(player.imgid);
        user = await User.findById(userId);
        if (user) {
          editable = false; // Set to false only if a user is found
        }
      } catch (error) {
        console.error(`Invalid imgid for player ${player._id}: ${player.imgid}`);
        // If conversion fails, user remains null and editable remains true
      }

      return {
        ...player.toObject(),
        profileImage,
        editable,
        user: user ? {
          id: user._id,
          email: user.email,
          // Add any other user fields you want to include
        } : null
      };
    }));

    res.status(200).json(playersWithImages);
  } catch (error) {
    console.error("Error in retrieveClubPlayers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};