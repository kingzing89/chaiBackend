// import mongoose from "mongoose";
// import { DB_Name } from "./constants";
// require('dotenv').config();
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path:"./env"
});


connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`app listening at port ${process.env.PORT || 8000}`);
    })
}).catch((err)=>{
    console.error("error ocurred here", err);
})



