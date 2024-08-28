import Club from "../../models/club.js";

export default async (req, res) => {
  try {
    const { clubName } = req.query;

    if (!clubName) {
      return res.status(400).json({ message: "Club name is required" });
    }

    const club = await Club.findOne({ clubName });
    if (club) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking club:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
