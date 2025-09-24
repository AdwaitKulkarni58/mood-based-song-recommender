const express = require("express");
const router = express.Router();
const UserInteraction = require("./models/UserInteraction");
const { authenticateJWT } = require("./auth");

// Helper: Load latest cluster assignments from CSV (or run clustering inline for demo)
const fs = require("fs");
const path = require("path");
const CLUSTER_CSV = path.join(__dirname, "../ml/user_clusters.csv");

// GET /api/insights - return cluster info for the current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    let cluster = null;
    let summary = null;
    // Try to load cluster assignments from CSV (if exists)
    if (fs.existsSync(CLUSTER_CSV)) {
      const csv = fs.readFileSync(CLUSTER_CSV, "utf8");
      const lines = csv.split("\n");
      const headers = lines[0].split(",");
      const userIdIdx = headers.indexOf("userId");
      const clusterIdx = headers.indexOf("cluster");
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols[userIdIdx] === req.user.id) {
          cluster = cols[clusterIdx];
          break;
        }
      }
      summary = `You are in cluster ${cluster}.`;
    }
    res.json({ cluster, summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to load insights", details: err.message });
  }
});

module.exports = router;
