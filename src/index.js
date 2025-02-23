// import mongoose from "mongoose";
// import { DB_Name } from "./constants";
// require('dotenv').config();
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path:"./env"
});





connectDB();



