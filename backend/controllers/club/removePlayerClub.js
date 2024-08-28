import Club from "../../models/club.js";
import clubPlayer from "../../models/clubplayer.js";

export default async (req, res) => {
  try {
    const { clubId, playerId } = req.body;

    if (!clubId || !playerId) {
      return res.status(400).json({ message: "Club ID and Player ID are required" });
    }
    // Find the club
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Remove the player from the club's players array
    club.players = club.players.filter(id => id.toString() !== playerId);
    await club.save();

    // Find the player and update their club status
    const player = await clubPlayer.findById(playerId);
    if (player) {
      // If you have a field for current club in your clubPlayer model, update it here
      // For example: player.currentClub = null;
      await player.save();
    }

    res.status(200).json({ message: "Player removed from club successfully" });
  } catch (error) {
    console.error("Error in removePlayerFromClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};