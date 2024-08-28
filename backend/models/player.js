import mongoose from "mongoose";
const { Schema, model } = mongoose;

const playerSchema = new Schema({
  gender: {
    type: String,
    enum: ['male', 'female'], // Limit gender to these two options
    required: true,
  },
  birthday: {
    type: Date,
  },
  nationality: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  dominantFoot: {
    type: String,
    enum: ['left', 'right'], // Limit dominant foot to these two options
    required: true,
  },
  Category: {
    type: String,
    enum: ['Amateur', 'Professional'],
    required: true,
  },
  currentClub: {
    type: Schema.Types.ObjectId,
    ref: 'Club',  // Reference to the Club model for the current club
  },
  pastClubs: [{
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club'
    },
    year: Number
  }],
  description: {
    type: String,
    required: false, // Optional field to add any additional description about the player
  },
  goals: {
    type: Number,
    required: false, // Optional field to track the number of goals scored by the player
    default: 0,
  },
  passes: {
    type: Number,
    required: false, // Optional field to track the number of successful passes made by the player
    default: 0,
  },
  matches: {
    type: Number,
    required: false, // Optional field to track the number of matches played by the player
    default: 0,
  },
  position: {
    type: String,
    enum: [
      'Attaquant', 'Milieu', 'Défenseur', 'Gardien', 
      'Ailier', 'Milieu défensif', 'Milieu offensif', 
      'Latéral', 'Libéro', 'Arrière central'
    ], // Enum list for positions
    required: true,
  },
});

const Player = model("Player", playerSchema);
export default Player;
