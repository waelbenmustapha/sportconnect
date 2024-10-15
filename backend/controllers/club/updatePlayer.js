import clubPlayer from "../../models/clubplayer.js";

export default async (req, res) => {
  try {
    const { playerId, updatedData } = req.body;

    if (!playerId || !updatedData) {
      return res.status(400).json({ message: "Player ID and updated data are required" });
    }
    // Find the player
    const player = await clubPlayer.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Validate the incoming data
    const validFields = [
      'Name', 'age', 'nationality', 'weight', 'height', 'dominantFoot',
      'Category', 'goals', 'passes', 'matches', 'position'
    ];

    // Validate enum fields
    if (updatedData.dominantFoot && !['left', 'right'].includes(updatedData.dominantFoot)) {
      return res.status(400).json({ message: "Invalid dominant foot" });
    }

    if (updatedData.Category && !['Amateur', 'Professional'].includes(updatedData.Category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const validPositions = [
      'Attaquant', 'Milieu', 'Défenseur', 'Gardien', 
      'Ailier', 'Milieu défensif', 'Milieu offensif', 
      'Latéral', 'Libéro', 'Arrière central'
    ];

    if (updatedData.position && !validPositions.includes(updatedData.position)) {
      return res.status(400).json({ message: "Invalid position" });
    }

    // Update the player, only using valid fields
    validFields.forEach(key => {
      if (updatedData.hasOwnProperty(key)) {
        player[key] = updatedData[key];
      }
    });

    await player.save();

    res.status(200).json({ message: "Player data updated successfully", player });
  } catch (error) {
    console.error("Error in updatePlayerData:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};