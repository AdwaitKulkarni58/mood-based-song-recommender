const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playlists: [
    {
      name: String,
      songs: [
        {
          title: String,
          artist: String,
          spotify_id: String,
          url: String,
          album: String,
          duration_ms: Number,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
