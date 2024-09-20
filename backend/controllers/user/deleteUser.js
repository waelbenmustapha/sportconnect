import User from "../../models/user.js";
import Club from "../../models/club.js";
import Agent from "../../models/agent.js";
import Player from "../../models/player.js";
import Recruiter from "../../models/recruiter.js";
import clubPlayer from "../../models/clubplayer.js";
import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  try {
    const { id } = req.body; // Get the user ID from the request body

    if (!id) {
      return res.status(400).json({ message: "Please provide a user ID" });
    }

    // Find the user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated entities based on user role
    if (user.role === "club") {
      const club = await Club.findById(user.club);
      if (club) {
        // Remove club from all players' currentClub
        await Player.updateMany(
          { currentClub: club._id },
          { $unset: { currentClub: "" } }
        );
        
        // Remove club from all players' pastClubs
        await Player.updateMany(
          { "pastClubs.club": club._id },
          { $pull: { pastClubs: { club: club._id } } }
        );
        
        // Remove associated clubPlayers
        await clubPlayer.deleteMany({ _id: { $in: club.players } });
        
        // Remove club from recruiter's currentClub if exists
        if (club.recruiter) {
          await Recruiter.findByIdAndUpdate(club.recruiter, {
            $unset: { currentClub: "" }
          });
        }
      }
      await Club.findByIdAndDelete(user.club);
    } else if (user.role === "agent") {
      const agent = await Agent.findById(user.agent);
      if (agent) {
        // Remove agent from all associated players
        await Player.updateMany(
          { _id: { $in: agent.players } },
          { $unset: { agent: "" } }
        );
        
        // Remove agent from all associated recruiters
        await Recruiter.updateMany(
          { _id: { $in: agent.Recruiters } },
          { $unset: { agent: "" } }
        );
      }
      await Agent.findByIdAndDelete(user.agent);
    } else if (user.role === "player") {
      const player = await Player.findById(user.player);
      if (player) {
        // Remove player from agent's players list
        await Agent.updateMany(
          { players: player._id },
          { $pull: { players: player._id } }
        );
        
        // Remove player from club's players list
        if (player.currentClub) {
          await Club.findByIdAndUpdate(player.currentClub, {
            $pull: { players: player._id }
          });
        }
        
        // Delete associated clubPlayer documents
        await clubPlayer.deleteMany({ imgid: user._id });
      }
      await Player.findByIdAndDelete(user.player);
    } else if (user.role === "recruiter") {
      const recruiter = await Recruiter.findById(user.recruiter);
      if (recruiter) {
        // Remove recruiter from club
        if (recruiter.currentClub) {
          await Club.findByIdAndUpdate(recruiter.currentClub, {
            $unset: { recruiter: "" }
          });
        }
        
        // Remove recruiter from agent's recruiters list
        await Agent.updateMany(
          { Recruiters: recruiter._id },
          { $pull: { Recruiters: recruiter._id } }
        );
      }
      await Recruiter.findByIdAndDelete(user.recruiter);
    }

    // Delete associated files
    const fileTypes = ['profile', 'background', 'video'];
    const validExtensions = ['.jpg', '.png', '.avif', '.mp4', '.mov', '.avi']; // Add more if needed

    fileTypes.forEach(type => {
      validExtensions.forEach(ext => {
        const filePath = path.join(process.cwd(), 'public', 'uploads', `${id}-${type}${ext}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      });
    });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User, associated entities, and files deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};