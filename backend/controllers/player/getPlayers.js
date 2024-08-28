import Player from "../../models/player.js";

export default async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json({ players });
  } catch (error) {
    console.error("Error fetching players:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
