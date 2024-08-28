import Club from "../../models/club.js";
import Player from "../../models/player.js";
import fs from 'fs';
import Recruiter from "../../models/recruiter.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export default async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    const club = await Club.findById(id).populate('contact');
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Retrieve the contact's profile image if available
    let contactProfileImage = null;
    if (club.contact) {
      const contactIdString = club.contact._id.toString();
      // Check for different image types
      for (const ext of IMAGE_EXTENSIONS) {
        const contactImagePath = path.join(__dirname, '../../uploads', `${contactIdString}-profile${ext}`);
        if (fs.existsSync(contactImagePath)) {
          const imageBuffer = fs.readFileSync(contactImagePath);
          const mimeType = ext.slice(1); // Remove the dot from the extension
          contactProfileImage = `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
          break; // Exit the loop once we find a matching image
        }
      }
    }

    // Find players who have this club in their pastClubs and extract only the year
    const playersWithPastClub = await Player.find({
      'pastClubs.club': club._id
    }).select('pastClubs');

    // Extract only the year from pastClubs
    const pastPlayerYears = playersWithPastClub.map(player => {
      const pastClub = player.pastClubs.find(pc => pc.club.toString() === club._id.toString());
      return pastClub ? pastClub.year : null;
    }).filter(year => year !== null);
    const recruitersWithPastClub = await Recruiter.find({
      'pastClubs.club': club._id
    }).select('pastClubs');

    // Extract only the year from recruiters' pastClubs
    const pastRecruiterYears = recruitersWithPastClub.map(recruiter => {
      const pastClub = recruiter.pastClubs.find(pc => pc.club.toString() === club._id.toString());
      return pastClub ? pastClub.year : null;
    }).filter(year => year !== null);

    
    res.status(200).json({
      id: club._id,
      clubName: club.clubName,
      Address: club.Address,
      country: club.country,
      teams: club.teams,
      web: club.web,
      division: club.division,
      dateOfCreation: club.dateOfCreation,
      email: club.contact ? club.contact.email : null,
      contactFullName: club.contact ? club.contact.fullName : null,
      contactProfileImage: contactProfileImage,
      players: club.players,
      pastPlayerYears: pastPlayerYears,
      pastRecruiterYears: pastRecruiterYears // Adding the recruiters' past years
    });
  } catch (error) {
    console.error("Error in retrieveClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};