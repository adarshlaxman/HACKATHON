const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  gameType: { 
    type: String, 
    required: true,
    enum: ['memory', 'critical', 'emotion', 'tail']
  },
  score: { 
    type: Number, 
    required: true 
  },
  accuracy: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  additionalStats: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
});

module.exports = mongoose.model("Score", ScoreSchema);
