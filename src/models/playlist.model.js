import mongoose, { Schema } from "mongoose";

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{timestamps:true});

export const Like = new mongoose.model("Playlist", PlaylistSchema);
