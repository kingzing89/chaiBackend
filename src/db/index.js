import mongoose from "mongoose";
import { DB_Name } from "../constants.js";


 const  connectDB = async () => {
    try {
        const connectionInstance = mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
    } catch (error) {
        console.error("This is the error",error,)
    }
}


export default connectDB;
