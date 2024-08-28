import Club from "../../models/club.js";

export default async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error in getAllClubs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
