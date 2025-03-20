import mongoose, { Schema } from "mongoose";

const TweetSchema = new Schema({
    
    content:{
        type:String,
        required:true
    },

    owner:{
        type:String,
    }
  
},{timestamps:true});

export const Like = new mongoose.model("Tweet", TweetSchema);
