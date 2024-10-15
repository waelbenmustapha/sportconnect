import mongoose from "mongoose";
const { Schema, model } = mongoose;

const clubplayerSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
  },
  imgid: {
    type: String,
  },
  nationality: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  age:{
    type:Number,
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

const clubPlayer = model("clubPlayer", clubplayerSchema);
export default clubPlayer;
