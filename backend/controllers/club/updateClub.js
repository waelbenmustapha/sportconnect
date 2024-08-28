import User from "../../models/user.js";
import Player from "../../models/player.js";
import Agent from "../../models/agent.js";
import Recruiter from "../../models/recruiter.js";
import Club from "../../models/club.js";
import fs from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';
import clubPlayer from "../../models/clubplayer.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (req, res) => {
  try {
    const { userId, clubId } = req.body;

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


    // Handle player role
    if (user.player) {
      user.player.currentClub = clubId;
      await user.player.save();
      
    }


    // Handle recruiter role
    if (user.recruiter) {
      // Check if the club already has a recruiter
      const existingRecruiter = await Recruiter.findOne({ currentClub: clubId });
      if (existingRecruiter) {
        return res.status(400).json({ message: "This club already has a recruiter" });
      }
      
      user.recruiter.currentClub = clubId;
      await user.recruiter.save();
    }
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
    const userplayer=null;
    if (user.player){
      let userplayer=null;
      if (userId){
        userplayer=userId;
      }
      else{
        userplayer = new mongoose.Types.ObjectId();
      }
    
      // Create a new player
      const player = new clubPlayer({
        Name:user.fullName,
        age: parseInt(user.player.age),
        nationality:user.player.nationality,
        user:userplayer,
        weight: parseFloat(user.player.weight),
        imgid:userplayer,
        height: parseFloat(user.player.height),
        dominantFoot:user.player.dominantFoot,
        Category:user.player.Category,
        position:user.player.position,
        // Initialize optional fields
        goals: parseInt(user.player.goals),
        passes: parseInt(user.player.passes),
        matches: parseInt(user.player.matches)
      });
  
      // Save the player
      await player.save();
  
      // Add the player to the club's players array
      club.players.push(player._id);
      await club.save();
  
    }
    const updatedClub = await Club.findById(clubId).populate('players');

    res.status(200).json({
      message: "Current club set successfully",
      clubName: updatedClub.clubName,
      contactProfileImage,
      contactEmail: updatedClub.contact ? updatedClub.contact.email : null,
      playerCount: updatedClub.players.length  // Add this to verify the player count
    });
  } catch (error) {
    console.error("Error in setCurrentClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};