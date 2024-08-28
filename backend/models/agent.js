import mongoose from "mongoose";
const { Schema, model } = mongoose;

const agentSchema = new Schema({
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  license: {
    type: Number,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  
  experience: {
    type: String,
  },
  services: {
    type: String,
  },
  sports: [{
    type: String,
    enum: [
      'Football', 'Basketball', 'Volleyball', 'Badminton', 
      'Handball', 'Tennis', 'Ice Hockey', 'Table Tennis', 
      'Squash', 'Gymnastics', 'Indoor Athletics', 'Wrestling', 
      'Boxing', 'Martial Arts'
    ], // Enum list for sports
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',  // Reference to the Player model
  }],
  Recruiters: [{
    type: Schema.Types.ObjectId,
    ref: 'Recruiter',  // Reference to the Player model
  }],
});

const Agent = model("Agent", agentSchema);
export default Agent;
