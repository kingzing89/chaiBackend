import mongoose, { mongo } from 'mongoose'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

let Schema = mongoose.Schema;

const userSchema = new Schema({

    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },

    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },

    
    name:{
        type:String,
        required:false,
        default:"no name"
    },


    fullName:{
        type:String,
        required:true,
        trim:true, 
    },

    password:{
        type:String,
        required:[true,'Password is required'],
        lowercase:true,
        unique:true,
    },

    avatar:{
        type:String, // Cloudinary url
        required:true,
    },

    coverImage:{
        type:String, // Cloudinary url
    },

    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Video',
        }
    ],

    refreshToken:{
        type:String
    }

    },{timestamps:true})


let User = mongoose.model('User',userSchema);

userSchema.pre('save',async function(next) {

    if(!this.isModified(this.password)){
        return next();
    }
    this.password = bcrypt.hash(this.password,10);
    next();
} )


userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiry: process.env.ACCESS_TOKEN_EXPIRY
    }
)}

userSchema.methods.generateAccessToken = async function (){
    return jsonwebtoken.sign({
        _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiry: process.env.ACCESS_TOKEN_EXPIRY
    }
)}


export {User};