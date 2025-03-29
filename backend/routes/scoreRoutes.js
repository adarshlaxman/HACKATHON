const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// Save game score
router.post("/:gameType", async (req, res) => {
  try {
    const { score, accuracy, additionalStats } = req.body;
    const gameType = req.params.gameType;
    
    const newScore = new Score({
      gameType,
      score,
      accuracy,
      additionalStats,
      date: new Date()
    });
    
    await newScore.save();
    res.status(201).json({ message: "Score submitted successfully!", score: newScore });
  } catch (error) {
    res.status(500).json({ error: "Error submitting score" });
  }
});

// Get scores by game type
router.get("/:gameType", async (req, res) => {
  try {
    const gameType = req.params.gameType;
    let query = {};
    
    if (gameType !== 'all') {
      query.gameType = gameType;
    }
    
    const scores = await Score.find(query)
      .sort({ date: -1 })
      .limit(50);
      
    // Get the latest score
    const latest = scores[0] || null;
    
    // Format history data
    const history = scores.map(score => ({
      game: score.gameType,
      score: score.score,
      accuracy: score.accuracy,
      date: score.date,
      ...score.additionalStats
    }));

    res.json({
      latest,
      history
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching scores" });
  }
});

module.exports = router;
