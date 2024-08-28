import Club from "../../models/club.js";
import Recruiter from "../../models/recruiter.js";

export default async (req, res) => {
  try {
    // Step 1: Find all recruiter-associated club IDs
    const recruiterClubs = await Recruiter.find({}, 'club').exec();
    const recruiterClubIds = recruiterClubs.map(recruiter => recruiter.club);

    // Step 2: Find all clubs that are not associated with a recruiter
    const clubs = await Club.find({ _id: { $nin: recruiterClubIds } }).exec();

    res.status(200).json({ clubs });
  } catch (error) {
    console.error("Error retrieving clubs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
