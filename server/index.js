const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8888;

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/moodsong",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(cors());
app.use(express.json());

// Auth and playlist routes
app.use("/api/auth", require("./auth"));
app.use("/api/playlists", require("./playlists"));
app.use("/api/interactions", require("./interactions"));
app.use("/api/insights", require("./insights"));

async function getSpotifyAppToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const token = response.data.access_token;
  return token;
}

app.get("/api/recommendations", async (req, res) => {
  const { mood } = req.query;
  const playlistId = moodPlaylistMap[mood];
  if (!playlistId) {
    return res.status(400).json({ error: "Invalid or unsupported mood" });
  }
  try {
    const token = await getSpotifyAppToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 50 },
      }
    );
    let tracks = (response.data.items || []).map((item) => {
      const track = item.track;
      return {
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        spotify_id: track.id,
        url: track.external_urls.spotify,
        album: track.album ? track.album.name : null,
        duration_ms: track.duration_ms,
      };
    });
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch playlist tracks",
      details: err.message,
      spotify: err.response?.data,
    });
  }
});

const moodPlaylistMap = {
  happy: "7GhawGpb43Ctkq3PRP1fOL", // Happy Hits!
  sad: "0t2bP5YfA3HE2MqUQdNsHq", // Sad Songs
  chill: "6IKQrtMc4c00YzONcUt7QH", // Chill Hits
  energetic: "0oxevpSGR2zITpujzwPCmj", // Beast Mode
  romantic: "1pmsMvJXvQ6s55bz4FsqCy", // Love Pop
  focused: "0oPyDVNdgcPFAWmOYSK7O1", // Deep Focus
  party: "5xS3Gi0fA3Uo6RScucyct6", // Party Hits
  angry: "5IwFDvJvKVub47mVa4DPY0", // Rock Hard
  calm: "4h2MD8T5fNW2Ss8sO5up68", // Calm Vibes
  motivated: "2fmxVDpboTzLaLAfj5ZaQW", // Motivation Mix
};

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
