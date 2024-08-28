import User from "../../models/user.js";
import Club from "../../models/club.js";
import Player from "../../models/player.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findImageByPrefix = (directory, prefix) => {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.startsWith(prefix)) {
      return path.join(directory, file);
    }
  }
  return null;
};

const getImageBase64 = (imagePath) => {
  if (imagePath && fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    const mimeType = path.extname(imagePath).slice(1);
    return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
  }
  return null;
};

export default async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide a user ID" });
    }
    const user1 = await User.findOne({ email: email });

    const user = await User.findOne({ email: email })
      .select("-password")
      .populate({
        path: 'agent',
        populate: {
          path: 'players',
          model: 'Player'
        }
      })
      .populate('player')
      .populate('recruiter')
      .populate({
        path: 'club',
        populate: [
          { path: 'contact' },
          { 
            path: 'players',
            model: Player,
            select: '_id'
          }
        ]
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let agentData = null;
    if (user.agent) {
      agentData = {
        agentId:user.agent._id,
        gender: user.agent.gender,
        dateOfBirth: user.agent.dateOfBirth,
        age: user.agent.age,
        license: user.agent.license,
        experience: user.agent.experience,
        nationality: user.agent.nationality,
        telephone: user.agent.telephone,
        country: user.agent.country,
        services: user.agent.services,
        sports: user.agent.sports,
        players: await Promise.all(user.agent.players.map(async (playerId) => {
          const playerUser = await User.findOne({ player: playerId }).select('fullName email');
          if (playerUser) {
            const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${playerUser._id}-profile`);
            const profileImage = getImageBase64(profileImagePath);
            return {
              _id: playerId,
              fullName: playerUser.fullName,
              email: playerUser.email,
              profileImage: profileImage
            };
          }
          return null;
        })),
        recruiters: await Promise.all(user.agent.Recruiters.map(async (recruiterId) => {
          const recruiterUser = await User.findOne({ recruiter: recruiterId }).select('fullName email recruiter');
          if (recruiterUser) {
            const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${recruiterUser._id}-profile`);
            const profileImage = getImageBase64(profileImagePath);
            return {
              _id: recruiterId,
              fullName: recruiterUser.fullName,
              email: recruiterUser.email,
              profileImage: profileImage,
              typeOfTrainer: recruiterUser.recruiter.typeOfTrainer,
              currentClub: recruiterUser.recruiter.currentClub ? 
                await Club.findById(recruiterUser.recruiter.currentClub).select('clubName') : null
            };
          }
          return null;
        }))
      };
    }
    let fullClubInfo = null;
    if (user.club) {
      fullClubInfo = await Club.findById(user.club._id)
        .populate('contact')
        .populate({
          path: 'players',
          model: Player,
          select: '_id'
        });
      // Fetch profile images for each player


      if (fullClubInfo.players && fullClubInfo.players.length > 0) {

        const playersWithUserInfo = await Promise.all(fullClubInfo.players.map(async (player) => {
          const playerUser = await User.findOne({ player: player._id }).select('fullName email');
          if (playerUser) {
            const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${playerUser._id}-profile`);
            const profileImage = getImageBase64(profileImagePath);
            return {
              _id: player._id,
              fullName: playerUser.fullName,
              email: playerUser.email,
              profileImage: profileImage
            };
          }
          return null;
        }));
        fullClubInfo = fullClubInfo.toObject(); // Convert to a plain JavaScript object
        fullClubInfo.players = playersWithUserInfo.filter(player => player !== null);
      }
    }
    const profileImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${user1._id}-profile`);
    const backgroundImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${user1._id}-background`);

    const profileImage = getImageBase64(profileImagePath);
    const backgroundImage = getImageBase64(backgroundImagePath);

    let currentClubImage = null;
    let pastClubImages = [];
    let pastClubNames = [];

    // Handle current club for player, agent, recruiter, or club contact
    let currentClubName = null;
    let currentClubDetails = null;
    if (user.player?.currentClub || user.agent?.currentClub || user.recruiter?.currentClub || user.club) {
      const currentClub = await Club.findById(
        user.player?.currentClub || 
        user.agent?.currentClub || 
        user.recruiter?.currentClub || 
        user.club._id
      ).populate('contact');
      
      if (currentClub) {
        currentClubName = currentClub.clubName;
        currentClubDetails = {
          clubName: currentClub.clubName,
          Address: currentClub.Address,
          country: currentClub.country,
          teams: currentClub.teams,
          web: currentClub.web,
          division: currentClub.division,
          dateOfCreation: currentClub.dateOfCreation,
          email: currentClub.contact ? currentClub.contact.email : null // Add this line
        };
    
        if (currentClub.contact) {
          const contactId = currentClub.contact._id;
          const currentClubImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${contactId}-profile`);
          currentClubImage = getImageBase64(currentClubImagePath);
        }
      }
    }
    // Retrieve past club images and names
    const pastClubs = user.player?.pastClubs || user.agent?.pastClubs || user.recruiter?.pastClubs || [];
    for (let clubId of pastClubs) {
      const club = await Club.findById(clubId).populate('contact');
      if (club) {
        const contactId = club.contact._id;
        const pastClubImagePath = findImageByPrefix(path.join(__dirname, '../../uploads'), `${contactId}-profile`);
        const pastClubImage = getImageBase64(pastClubImagePath);
    
        pastClubImages.push({
          clubName: club.clubName,
          image: pastClubImage,
          Address: club.Address,
          country: club.country,
          teams: club.teams,
          web: club.web,
          division: club.division,
          dateOfCreation: club.dateOfCreation,
          email: club.contact ? club.contact.email : null // Add this line
        });
    
        pastClubNames.push(club.clubName);
      }
    }
    res.status(200).json({
      fullName: user.fullName,
      role: user.role,
      player: user.player ? { ...user.player.toObject(), currentClub: currentClubDetails } : null,
      agent: agentData,
      recruiter: user.recruiter ? { ...user.recruiter.toObject(), currentClub: currentClubDetails } : null,
      club: fullClubInfo ? {
        ...fullClubInfo,
        players: fullClubInfo.players // This now includes full user info with images for each player
      } : null,
      email: user.email,
      id: user._id,
      profileImage,
      backgroundImage,
      currentClubImage,
      currentClubDetails,
      pastClubImages,
      pastClubNames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};