import Player from "../../models/player.js";
import User from "../../models/user.js";
import Club from "../../models/club.js";

export default async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you're using some middleware to extract user info from the token

    const {
      telephone,
      gender,
      dateOfBirth,
      nationality,
      weight,
      height,
      birthday,
      dominantFoot,
      cat,
      currentClub,
      position,
      description
    } = req.body;

    // Find the existing user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.player) {
      return res.status(400).json({ message: "Player profile already exists" });
    }

    // Find the club by name
    const club = await Club.findOne({ clubName: currentClub });

    // Calculate age from dateOfBirth
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const clubid=club?._id;
    // Create new player
    const player = new Player({
      gender,
      birthday,
      nationality,
      weight,
      height,
      dominantFoot,
      Category: cat,
      currentClub: clubid, // Store the club's ObjectId
      position,
      description
    });

    // Save player and update user
    await player.save();
    user.player = player._id;
    user.role = 'player';
    user.telephone = telephone;
    await user.save();

    // Add the player's ID to the club's players array
    if (club){
      club.players.push(player._id);
      await club.save();
    }
    res.status(201).json({ id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};