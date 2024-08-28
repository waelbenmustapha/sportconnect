import mongoose from "mongoose";
const { Schema, model } = mongoose;

const clubSchema = new Schema({
  clubName: {
    type: String,
    required: true,
  },

  Address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },    
  teams: {
    type: Number,
    required: true,
  },    
  web: {
    type: String,
  },  
  division: {
    type: String,
    enum: ['Premier League', 'EFL Championship','EFL League One','EFL League Two','La Liga','La Liga 2','Segunda División B','Tercera División',
      'Bundesliga','Liga','Regionalliga','Serie A','Serie B','Serie C','Serie D','Ligue 1','Ligue 2','Championnat National','National 2'
    ], 
    required: true,
  },
  dateOfCreation: {
    type: Date,
    required: true,
  },

  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',  // Reference to the Agent model
  },
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: 'Recruiter',  // Reference to the Recruiter model
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'clubPlayer',  // Reference to the Club model for past clubs
  }],
});

const Club = model("Club", clubSchema);
export default Club;
