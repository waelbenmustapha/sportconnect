import User from "../../models/user.js";
import Player from "../../models/player.js";
import Agent from "../../models/agent.js";
import Recruiter from "../../models/recruiter.js";
import Club from "../../models/club.js";
import fs from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (req, res) => {
  try {
    const { userId, clubId, year } = req.body;

    const club = await Club.findById(clubId).populate('contact');
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const user = await User.findById(userId)
      .populate('player')
      .populate('agent')
      .populate('recruiter');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pastClubEntry = { club: clubId, year };

    let roleModel;
    if (user.player) roleModel = user.player;
    else if (user.agent) roleModel = user.agent;
    else if (user.recruiter) roleModel = user.recruiter;
    else return res.status(400).json({ message: "User role not found" });

    if (roleModel.pastClubs.some(pc => pc.club.toString() === clubId)) {
      return res.status(400).json({ message: "Club is already in past clubs" });
    }
    
    roleModel.pastClubs.push(pastClubEntry);
    await roleModel.save();

    // Retrieve the club's contact profile image
    let contactProfileImage = null;
    if (club.contact) {
      const contactImagePath = path.join(__dirname, '../../uploads', `${club.contact._id}-profile.jpg`);
      if (fs.existsSync(contactImagePath)) {
        const imageBuffer = fs.readFileSync(contactImagePath);
        const mimeType = path.extname(contactImagePath).slice(1);
        contactProfileImage = `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
      }
    }

    res.status(200).json({
      message: "Past club added successfully",
      clubName: club.clubName,
      contactProfileImage,
      contactEmail: club.contact ? club.contact.email : null,
      year
    });
  } catch (error) {
    console.error("Error in addPastClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};