const express = require("express");
const router = express.Router();
const UserInteraction = require("./models/UserInteraction");
const { authenticateJWT } = require("./auth");

// Log a user mood/playlist interaction
router.post("/log", authenticateJWT, async (req, res) => {
  try {
    const { mood, playlistName } = req.body;
    if (!mood || !playlistName) {
      return res.status(400).json({ error: "Mood and playlistName are required" });
    }
    const interaction = new UserInteraction({
      userId: req.user.id,
      mood,
      playlistName,
    });
    await interaction.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to log interaction", details: err.message });
  }
});

// Get all user interactions (admin or for ML pipeline)
router.get("/all", async (req, res) => {
  try {
    const interactions = await UserInteraction.find({});
    res.json({ interactions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interactions", details: err.message });
  }
});

module.exports = router;
