import User from "../../models/user.js";
import Agent from "../../models/agent.js";
import Recruiter from "../../models/recruiter.js";

export const addRecruiter = async (req, res) => {
    try {
        const { agentId, recruiterId } = req.body;

        // Validate agentId
        if (!agentId) {
            return res.status(400).json({ message: "Agent ID is required" });
        }

        // Find the agent user
        const agentUser = await User.findById(agentId);
        if (!agentUser || !agentUser.agent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        // Find the agent
        const agent = await Agent.findById(agentUser.agent);
        if (!agent) {
            return res.status(404).json({ message: "Agent details not found" });
        }

        // Validate recruiterId
        if (!recruiterId || typeof recruiterId !== 'string') {
            return res.status(400).json({ message: "Invalid recruiter ID" });
        }

        // Find the recruiter
        const recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        // Check if the agent already represents this recruiter
        if (agent.Recruiters && agent.Recruiters.includes(recruiterId)) {
            return res.status(400).json({ message: "Recruiter is already represented by this agent" });
        }

        // Add the recruiter to the agent's list
        if (!agent.Recruiters) {
            agent.Recruiters = [];
        }
        agent.Recruiters.push(recruiterId);
        await agent.save();

        // Find the recruiter's user details
        const recruiterUser = await User.findOne({ recruiter: recruiterId }).select('fullName email');

        res.status(200).json({
            message: "Recruiter added successfully",
            recruiter: {
                _id: recruiter._id,
                fullName: recruiterUser.fullName,
                email: recruiterUser.email,
            }
        });
    } catch (error) {
        console.error("Error in addRecruiter:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default addRecruiter;