import Agent from "../../models/agent.js";
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

// Function to get base64 encoded image
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
    // Retrieve all users with the role of 'agent' and populate their agent and current club data
    const users = await User.find({ role: 'agent' }).populate({
      path: 'agent',
      populate: [
        {
          path: 'players',
          select: '_id', // We'll use this to fetch player details
        },
      ],
    });

    // Map the response to include agent data and profile image
    const usersWithAgentData = await Promise.all(users.map(async user => {
      // Find profile image
      const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${user._id}-profile`);
      const profileImage = getImageBase64(profileImagePath);

      // Fetch player details
      const playerDetails = await Promise.all(user.agent.players.map(async (playerId) => {
        const playerUser = await User.findOne({ player: playerId }).select('fullName email');
        if (playerUser) {
          const playerProfileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${playerUser._id}-profile`);
          const playerProfileImage = getImageBase64(playerProfileImagePath);
          return {
            _id: playerId,
            fullName: playerUser.fullName,
            email: playerUser.email,
            profileImage: playerProfileImage
          };
        }
        return null;
      }));

      return {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage,
        agent: user.agent ? {
          gender: user.agent.gender,
          dateOfBirth: user.agent.dateOfBirth,
          age: user.agent.age,
          license: user.agent.license,
          experience: user.agent.experience,
          nationality: user.agent.nationality,
          telephone: user.agent.telephone,
          country: user.agent.country,
          services: user.agent.services,
          sports: user.agent.sports,
          players: playerDetails.filter(player => player !== null),
        } : null,
      };
    }));

    res.status(200).json({ users: usersWithAgentData });
  } catch (error) {
    console.error("Error fetching users and agents:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};