import Club from "../../models/club.js";
import User from "../../models/user.js";

export default async (req, res) => {
  try {
    const { userId } = req.user; // Now userId is directly available

    const { clubName, Address, country, teams, web, division, dateOfCreation } = req.body;

    if (!clubName || !Address || !country || !teams || !division || !dateOfCreation) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const user = await User.findById(userId);

    const existingClub = await Club.findOne({ clubName });
    if (existingClub) {
      return res.status(400).json({ message: "Club name already exists" });
    }

    const club = new Club({
      clubName,
      Address,
      country,
      teams: parseInt(teams),
      web,
      division,
      dateOfCreation,
      contact: userId, // Set the contact to the current user's ID
    });

    user.role = "club";
    user.club = club._id;
    await user.save();
    await club.save();

    res.status(201).json({ id: user._id });
  } catch (error) {
    console.error("Error in addClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};