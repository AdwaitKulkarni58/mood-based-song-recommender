const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Delete a playlist
router.delete("/:playlistName", authMiddleware, async (req, res) => {
  const { playlistName } = req.params;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.playlists = user.playlists.filter((p) => p.name !== playlistName);
  await user.save();
  res.json({ playlists: user.playlists });
});

// Delete a song from a playlist
router.delete(
  "/:playlistName/song/:songId",
  authMiddleware,
  async (req, res) => {
    const { playlistName, songId } = req.params;
    console.log(playlistName, songId);
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const playlist = user.playlists.find((p) => p.name === playlistName);
    console.log(playlist.songs);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    playlist.songs = playlist.songs.filter(
      (s) => (s.spotify_id || s.title) !== songId
    );
    await user.save();
    res.json({ playlist });
  }
);

// Get all playlists for user
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ playlists: user.playlists });
});

// Create new playlist
router.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.playlists.push({ name, songs: [] });
  await user.save();
  res.json({ playlists: user.playlists });
});

// Add song to playlist
router.post("/:playlistName/add", authMiddleware, async (req, res) => {
  const { song } = req.body;
  const { playlistName } = req.params;
  if (!song) return res.status(400).json({ error: "Song required" });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const playlist = user.playlists.find((p) => p.name === playlistName);
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  playlist.songs.push(song);
  await user.save();
  res.json({ playlist });
});

module.exports = router;
