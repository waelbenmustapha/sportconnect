import Agent from "../../models/agent.js";
import User from "../../models/user.js";
import Club from "../../models/club.js";

export default async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      gender,
      dateOfBirth,
      nationality,
      country,
      license,
      experience,
      telephone,
      services,
      sports
    } = req.body;

    if (!gender || !dateOfBirth || !nationality || !country || !license || !experience || !telephone || !sports) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const user = await User.findById(userId);
    if (user.agent) {
      return res.status(400).json({ message: "Agent profile already exists" });
    }


    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

    const agent = new Agent({
      gender,
      dateOfBirth,
      age,
      nationality,
      country,
      license,
      experience,
      telephone,
      services,
      sports,
    });

    await agent.save();
    user.role = "agent";
    user.agent = agent._id;
    user.telephone = telephone;
    await user.save();

    res.status(201).json({ id: user._id });
  } catch (error) {
    console.error("Error in addAgent:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};