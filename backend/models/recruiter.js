import mongoose from "mongoose";
const { Schema, model } = mongoose;

const recruiterSchema = new Schema({
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  telephone: {
    type: String,
  },
  nationality: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  philosophy: {
    type: String,
  },
  currentClub: {
    type: Schema.Types.ObjectId,
    ref: 'Club',  // Reference to the Club model for the current club
  },
  pastClubs: [{
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',  // Reference to the Club model for past clubs
    },
    year: {
      type: Number,
      required: true,
    }
  }],
  typeOfTrainer: {
    type: String,
    enum: ['Senior', 'Junior', 'Goalkeeper', 'Fitness', 'Assistant', 'Youth', 'Technical Director', 'Scout'],
    required: true,
  },
});

const Recruiter = model("Recruiter", recruiterSchema);
export default Recruiter;
