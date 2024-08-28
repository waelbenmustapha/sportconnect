import User from "../../models/user.js";
import Agent from "../../models/agent.js";
import Player from "../../models/player.js";

export const addPlayer = async (req, res) => {
  try {
    const { agentId, playerId } = req.body;

    // Find the agent user
    const agentUser = await User.findById(agentId);
    if (!agentUser || agentUser.role !== 'agent' || !agentUser.agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Find the agent document
    const agent = await Agent.findById(agentUser.agent);
    if (!agent) {
      return res.status(404).json({ message: "Agent details not found" });
    }

    // Find the player user
    const playerUser = await User.findById(playerId);
    if (!playerUser || playerUser.role !== 'player' || !playerUser.player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Check if the player is already in the agent's list
    if (agent.players.includes(playerUser.player)) {
      return res.status(400).json({ message: "Player already added to this agent" });
    }

    // Add the player to the agent's list
    agent.players.push(playerUser.player);
    await agent.save();

    res.status(200).json({
      message: "Player added successfully",
      player: {
        _id: playerUser._id,
        fullName: playerUser.fullName,
        email: playerUser.email,
      }
    });
  } catch (error) {
    console.error("Error in addPlayer:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default addPlayer;