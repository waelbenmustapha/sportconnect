import User from "../../models/user.js";
import Player from "../../models/player.js";
import clubPlayer from "../../models/clubplayer.js";
import Agent from "../../models/agent.js";
import Recruiter from "../../models/recruiter.js";
import Club from "../../models/club.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateUserInfo = async (req, res) => {
  try {
    let { userId, fullName, playerData, agentData, recruiterData, info, ...updateData } = req.body;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (recruiterData) {
      const { currentClub, pastClubs, ...cleanRecruiterData } = recruiterData;
      recruiterData = cleanRecruiterData;
    }
    if (playerData) {
      const { currentClub, pastClubs, ...cleanPlayerData } = playerData;
      playerData = cleanPlayerData;
    }
    user.fullName = fullName || user.fullName;
    Object.assign(user, updateData);

    if (user.player && playerData) {
      if (playerData.birthday) {
        const newDate = new Date(playerData.birthday);
        if (!isNaN(newDate.getTime())) {
          playerData.birthday = newDate.toISOString();
        } else {
          delete playerData.birthday;
        }
      }

      // Update Player model, including description
      const updatedPlayer = await Player.findByIdAndUpdate(
        user.player,
        { $set: { ...playerData, description: info } },
        { new: true }
      );
      if (updatedPlayer) {
        user.player = updatedPlayer;
      }

      // Update clubPlayer model
      const updatedClubPlayer = await clubPlayer.findOneAndUpdate(
        { imgid: user.player._id.toString() },
        {
          $set: {
            Name: fullName,
            birthday: playerData.birthday,
            nationality: playerData.nationality,
            weight: playerData.weight,
            height: playerData.height,
            dominantFoot: playerData.dominantFoot,
            Category: playerData.Category,
            goals: playerData.goals,
            passes: playerData.passes,
            matches: playerData.matches,
            position: playerData.position
          }
        },
        { new: true, upsert: true }
      );

      if (!updatedClubPlayer) {
        console.log("No matching clubPlayer found for imgid:", user.player._id);
      }
    }

    if (user.agent && agentData) {
      const validSports = agentData.sports ? agentData.sports.filter(sport => 
        ['Football', 'Basketball', 'Volleyball', 'Badminton', 
         'Handball', 'Tennis', 'Ice Hockey', 'Table Tennis', 
         'Squash', 'Gymnastics', 'Indoor Athletics', 'Wrestling', 
         'Boxing', 'Martial Arts'].includes(sport)
      ) : [];
      
      let updateFields = {
        ...agentData,
        services: info,
        sports: validSports
      };
    
      if (agentData.dateOfBirth) {
        const newDate = new Date(agentData.dateOfBirth);
        if (!isNaN(newDate.getTime())) {
          updateFields.dateOfBirth = newDate.toISOString();
        } else {
          delete updateFields.dateOfBirth;
        }
      } else {
        delete updateFields.dateOfBirth;
      }
  
      const updatedAgent = await Agent.findByIdAndUpdate(
        user.agent,
        { $set: updateFields },
        { new: true }
      );
  
      if (updatedAgent) {
        user.agent = updatedAgent;
      }
    }

    if (user.recruiter && recruiterData) {
      if (recruiterData.birthday) {
        const newDate = new Date(recruiterData.birthday);
        if (!isNaN(newDate.getTime())) {
          recruiterData.birthday = newDate.toISOString();
        } else {
          delete recruiterData.birthday;
        }
      }

      // Update Recruiter model, including philosophy
      const updatedRecruiter = await Recruiter.findByIdAndUpdate(
        user.recruiter,
        { $set: { ...recruiterData, philosophy: info, dateOfBirth: recruiterData.birthday} },
        { new: true }
      );
      if (updatedRecruiter) {
        user.recruiter = updatedRecruiter;
      }
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate('player')
      .populate('agent')
      .populate('recruiter')
      .populate('club');

    let profileImage = null;
    const profileImagePath = path.join(__dirname, '../../uploads', `${userId}-profile.jpg`);
    if (fs.existsSync(profileImagePath)) {
      const imageBuffer = fs.readFileSync(profileImagePath);
      const mimeType = path.extname(profileImagePath).slice(1);
      profileImage = `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
    }

    res.status(200).json({
      message: "User information updated successfully",
      user: {
        ...updatedUser.toObject(),
        profileImage,
        id: userId
      }
    });
  } catch (error) {
    console.error("Error in updateUserInfo:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default updateUserInfo;