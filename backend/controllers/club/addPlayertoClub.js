import Club from "../../models/club.js";
import clubPlayer from "../../models/clubplayer.js";
import User from "../../models/user.js";
import mongoose from "mongoose";
export default async (req, res) => {
  try {
    const { userId } = req.user; // userId is directly available from authMiddleware
    const { clubId, playerData } = req.body;

    // Destructure and validate player data
    const { Name, age, nationality, weight, height, dominantFoot, Category, position,matches,goals,passes,id } = playerData;
    if (!Name || !age || !nationality || !weight || !height || !dominantFoot || !Category || !position) {
      return res.status(400).json({ message: "Please provide all required fields for the player" });
    }
    console.log(age);
    // Find the club
    const club = await Club.findOne({ contact: clubId });
    if (!club) {
      return res.status(404).json({ message: "Club not found:" });
    }
    // Check if the user has permission to add a player to this club
    if (club.contact.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to add players to this club" });
    }
    let userplayer=null;
    if (id){
      userplayer=id;
    }
    else{
      userplayer = new mongoose.Types.ObjectId();
    }
  
    // Create a new player
    const player = new clubPlayer({
      Name,
      age:age,
      nationality,
      user:userplayer,
      weight: parseFloat(weight),
      imgid:userplayer,
      height: parseFloat(height),
      dominantFoot,
      Category,
      position,
      // Initialize optional fields
      goals: parseInt(goals),
      passes: parseInt(passes),
      matches: parseInt(matches)
    });

    // Save the player
    await player.save();

    // Add the player to the club's players array
    club.players.push(player._id);
    await club.save();

    // Fetch the updated club with populated players
    const updatedClub = await Club.findById(clubId).populate('players');

    res.status(201).json({ 
      id:userplayer,
    });
  } catch (error) {
    console.error("Error in addPlayerToClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
