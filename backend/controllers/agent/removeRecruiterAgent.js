import Agent from '../../models/agent.js';
import Player from '../../models/player.js';
import Recruiter from '../../models/recruiter.js';


export const removeRecruiterFromAgent = async (req, res) => {
    try {
      const { agentId, recruiterId } = req.body;
  
      if (!agentId || !recruiterId) {
        return res.status(400).json({ message: "Agent ID and Recruiter ID are required" });
      }
  
      // Find the agent
      const agent = await Agent.findById(agentId);
  
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      // Remove the recruiter from the agent's recruiters array
      agent.Recruiters = agent.Recruiters.filter(id => id.toString() !== recruiterId);
      await agent.save();
  
      // Update the recruiter's agent field
      const recruiter = await Recruiter.findById(recruiterId);
      if (recruiter) {
        recruiter.agent = null;
        await recruiter.save();
      }
  
      res.status(200).json({ message: "Recruiter removed from agent successfully" });
    } catch (error) {
      console.error("Error in removeRecruiterFromAgent:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export default removeRecruiterFromAgent;