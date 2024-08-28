import Recruiter from "../../models/recruiter.js";

export default async (req, res) => {
  try {
    const recruiters = await Recruiter.find();
    res.status(200).json({ recruiters });
  } catch (error) {
    console.error("Error fetching recruiters:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
