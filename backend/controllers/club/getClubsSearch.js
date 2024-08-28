import Club from "../../models/club.js";
import User from "../../models/user.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find image by prefix (e.g., "userId-profile")
const findImageByPrefix = (directory, prefix) => {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.startsWith(prefix)) {
      return path.join(directory, file);
    }
  }
  return null;
};

export default async (req, res) => {
  try {
    // Retrieve all clubs and populate the contact data
    const clubs = await Club.find().populate('contact', 'fullName email');

    // Map the response to include club data with contact information and profile image
    const clubsWithContactData = clubs.map(club => {
      let contactProfileImageUrl = null;
      if (club.contact) {
        const contactId = club.contact._id.toString();
        const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${contactId}-profile`);
        contactProfileImageUrl = profileImagePath ? `/uploads/${path.basename(profileImagePath)}` : null;
      }

      return {
        clubName: club.clubName,
        Address: club.Address,
        country: club.country,
        teams: club.teams,
        web: club.web,
        division: club.division,
        dateOfCreation: club.dateOfCreation,
        contact: club.contact ? {
          fullName: club.contact.fullName,
          email: club.contact.email,
          profileImageUrl: contactProfileImageUrl,
        } : null,
        agent: club.agent,
        recruiter: club.recruiter,
        players: club.players
      };
    });

    res.status(200).json({ clubs: clubsWithContactData });
  } catch (error) {
    console.error("Error fetching clubs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};