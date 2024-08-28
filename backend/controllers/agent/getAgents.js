import Agent from "../../models/agent.js";

export default async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json({ agents });
  } catch (error) {
    console.error("Error fetching agents:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
