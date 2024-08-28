import User from "../../models/user.js";
import Player from "../../models/player.js";
import Recruiter from "../../models/recruiter.js";
import Club from "../../models/club.js";
import clubPlayer from "../../models/clubplayer.js";
import mongoose from 'mongoose';

export default async (req, res) => {
  try {
    const { userId, oldClubId, newClubId, year } = req.body;

    const user = await User.findById(userId)
      .populate('player')
      .populate('recruiter');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newClub = await Club.findById(newClubId).populate('contact');
    if (!newClub) {
      return res.status(404).json({ message: "New club not found" });
    }

    // Update the past club in the user's history
    if (user.player) {
      const pastClubIndex = user.player.pastClubs.findIndex(pc => pc.club.toString() === oldClubId);
      if (pastClubIndex !== -1) {
        user.player.pastClubs[pastClubIndex].club = newClubId;
        user.player.pastClubs[pastClubIndex].year = year;
        await user.player.save();
      }
    } else if (user.recruiter) {
      const pastClubIndex = user.recruiter.pastClubs.findIndex(pc => pc.club.toString() === oldClubId);
      if (pastClubIndex !== -1) {
        user.recruiter.pastClubs[pastClubIndex].club = newClubId;
        user.recruiter.pastClubs[pastClubIndex].year = year;
        await user.recruiter.save();
      }
    }

    // Update the clubPlayer document if it exists
    if (user.player) {
      await clubPlayer.findOneAndUpdate(
        { user: userId, 'pastClubs.club': oldClubId },
        { 
          $set: { 
            'pastClubs.$.club': newClubId,
            'pastClubs.$.year': year
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Past club updated successfully",
      updatedClub: {
        id: newClub._id,
        clubName: newClub.clubName,
        image: newClub.contact ? `/api/images/${newClub.contact._id}-profile.jpg` : null,
        email: newClub.contact ? newClub.contact.email : null,
        year: year
      }
    });
  } catch (error) {
    console.error("Error in updatePastClub:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};