import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utlis/cloudinary.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import jsonwebtoken from "jsonwebtoken";

async function generateAccessAndRefreshToken(userId) {
  try {
    let user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // validate user after registering
  let { fullName, password, email, avatar, coverImage, username } = req.body;

  if (
    [fullName, password, email, username].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if email or pasword is empty then throw error

  let existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "This user already exist with this email");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path || null;

  if (!avatarLocalPath) {
    ApiError(400, "Avatar file is required");
  }

  const avatarImage = await uploadFileOnCloudinary(avatarLocalPath);
  const cover = await uploadFileOnCloudinary(coverLocalPath);

  if (!avatarImage) {
    ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatarImage?.url,
    coverImage: coverImage ? coverImage?.url : "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "There is already an existing user here");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, createdUser, "The user got registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  // get all the data out from the request body.

  const { email, username, password } = req.body;

  // check if any of the data is not null or empty (validate).
  if (
    [email, password].some((field) => {
      field === "";
    })
  ) {
    throw new ApiError(400, "the fields email and password can not be empty");
  }
  // check if email exists in the database.
  const user = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (!user) {
    throw new ApiError(
      500,
      "that the user does not exist, register first please"
    );
  }
  // compare passwords for given email of the user.
  let passwordCheck = user.isPasswordCorrect(password);
  if (!passwordCheck) {
    throw new ApiError(400, "password entered is incorrect");
  }

  // generate accessToken and refreshToken.'
  let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // send the tokens in cookies.
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user loogged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  let incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw ApiError(401, "Unauthorized Access");
  }

  decodedData = jsonwebtoken.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  let user = await User.findById(decodedData._id);

  if (!user) {
    throw new ApiError(400, "invalid refresh token");
  }

  if (incomingRefreshToken != user.refreshToken) {
    throw new ApiError(500, "refresh token is expired or used!");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, accessToken, refreshToken, "access token refreshed")
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  let { oldPassword, newPassword } = req.body;

  let user = await User.findById(req.user._id);

  let correct = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, user, "Password changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  let user = req.user;
  return res.status(200).json(user);
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  try {
    const { fullName, email } = req.body;

    let user = req.user;

    if (!fullName || !email) {
      throw new ApiError(
        400,
        "Error Ocurred , you have to atleast give me the email or fullName field"
      );
    }

    let updatedUser = await User.findByIdAndUpdate(
      user?._id,
      {
        $set: {
          fullName: fullName,
          email: email,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(500, "Update Operation has failed");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User data updated sucessfully"));
  } catch (error) {
    throw new ApiError(400, error?.message);
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  let localAvatarFilepath = req.files.path;

  if (!localAvatarFilepath) {
    throw new ApiError(400, "avatar path is missing");
  }

  let avatar = await uploadFileOnCloudinary(localAvatarFilepath);
  if (!avatar.url) {
    throw new ApiError(400, "avatar url is missing");
  }
  let user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  );
});

export {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  updateAvatar,
};
