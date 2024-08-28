import User from "../../models/user.js";
import Club from "../../models/club.js";
import Agent from "../../models/agent.js";
import Player from "../../models/player.js";

export default async (req, res) => {
  try {
    const { id } = req.body; // Get the user ID from the request body

    if (!id) {
      return res.status(400).json({ message: "Please provide a user ID" });
    }

    // Find the user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated entities based on user role
    if (user.role === "club") {
      await Club.findByIdAndDelete(user.club);
    } else if (user.role === "agent") {
      await Agent.findByIdAndDelete(user.agent);
    } else if (user.role === "player") {
      await Player.findByIdAndDelete(user.player);
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User and associated entities deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};