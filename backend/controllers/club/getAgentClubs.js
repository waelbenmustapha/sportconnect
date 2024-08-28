import Club from "../../models/club.js";
import Agent from "../../models/agent.js";

export default async (req, res) => {
  try {
    // Step 1: Find all agent-associated club IDs
    const agentClubs = await Agent.find({}, 'club').exec();
    const agentClubIds = agentClubs.map(agent => agent.club);

    // Step 2: Find all clubs that are not associated with an agent
    const clubs = await Club.find({ _id: { $nin: agentClubIds } }).exec();

    res.status(200).json({ clubs });
  } catch (error) {
    console.error("Error retrieving clubs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
