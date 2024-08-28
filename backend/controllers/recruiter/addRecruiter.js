import User from "../../models/user.js";
import Club from "../../models/club.js";
import Recruiter from "../../models/recruiter.js";

export default async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      gender,
      dateOfBirth,
      telephone,
      nationality,
      country,
      philosophy,
      typeOfTrainer,
      clubName,
    } = req.body;

    if (!gender || !dateOfBirth || !telephone || !nationality || !country || !philosophy) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const user = await User.findById(userId);
    if (user.recruiter) {
      return res.status(400).json({ message: "Recruiter profile already exists" });
    }

    let club;
    if (clubName) {
      club = await Club.findOne({ clubName });
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
    }

    const recruiter = new Recruiter({
      gender,
      dateOfBirth,
      telephone,
      nationality,
      country,
      typeOfTrainer,
      philosophy,
      currentClub: club ? club._id : null,
    });

    await recruiter.save();
    user.role = "recruiter";
    user.recruiter = recruiter._id;
    user.telephone = telephone;
    await user.save();

    res.status(201).json({ id: user._id });
  } catch (error) {
    console.error("Error in addRecruiter:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};