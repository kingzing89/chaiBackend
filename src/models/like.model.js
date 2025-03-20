import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },

  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
  },

  likedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{timestamps:true});

export const Like = new mongoose.model("Like", LikeSchema);
