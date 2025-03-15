import { asyncHandler } from "../utlis/asyncHandler.js";
import {ApiError} from "../utlis/ApiError.js";
import User from "../models/user.model.js"
import {uploadFileOnCloudinary} from "../utlis/cloudinary.js"
import { ApiResponse } from "../utlis/ApiResponse.js";
const registerUser = asyncHandler( async (req,res) =>
{
    // validate user after registering
    let {fullName,password,email,name,avatar,coverImage,username  } = req.body;

    if([fullName,password,email,name,avatar,coverImage,username].some((field)=>{
        field.trim() == ""
    })){
        throw new ApiError(400,"All fields are required");
    }

    // check if email or pasword is empty then throw error

    let existedUser =  User.findOne({
        $or:[{email},{username},]
    });

    if(existedUser){
        throw new ApiError(409,"This user already exist with this email");
    }

   const avatarLocalPath =  req.files?.avatar[0]?.path;
   const coverLocalPath =  req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    ApiError(400,"Avatar file is required");
   }


   const avatarImage = await uploadFileOnCloudinary(avatarLocalPath);
   const cover = await uploadFileOnCloudinary(coverLocalPath);


   if(!avatarImage){
    ApiError(400,"Avatar file is required");
   }

   const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage? coverImage?.url:"",
    email,
    password,
    username:username.toLowerCase(),
   });

   const createdUser=  await User.findById(user._id).select("-password -refreshToken");

   if(!createdUser){
    throw new ApiError(500,"There is already an existing user here");
   }


   res.status(200).json(
    new ApiResponse(200,createdUser,"The user got registered Successfully")
   )

})

export {
    registerUser
};