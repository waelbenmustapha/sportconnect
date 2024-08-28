import Agent from '../../models/agent.js';
import Player from '../../models/player.js';
import Recruiter from '../../models/recruiter.js';

export const removePlayerFromAgent = async (req, res) => {
  try {
    const { agentId, playerId } = req.body;
    if (!agentId || !playerId) {
      return res.status(400).json({ message: "Agent ID and Player ID are required" });
    }

    // Find the agent
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Remove the player from the agent's players array
    agent.players = agent.players.filter(id => id.toString() !== playerId);
    await agent.save();

    // Update the player's agent field
    const player = await Player.findById(playerId);
    if (player) {
      player.agent = null;
      await player.save();
    }

    res.status(200).json({ message: "Player removed from agent successfully" });
  } catch (error) {
    console.error("Error in removePlayerFromAgent:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default removePlayerFromAgent;