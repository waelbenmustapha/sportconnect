import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullName: {
    required: true,
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['none', 'player','agent', 'recruiter', 'club'],
    default: 'none',
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
  },
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: 'Recruiter',
  },
  telephone:{
    type:Number,
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
  },
});

const User = model("User", userSchema);
export default User;
