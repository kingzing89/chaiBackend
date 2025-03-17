import jsonwebtoken from 'jsonwebtoken'
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    let verified = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = await User.findById(verified._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "unauthorized request");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

export { verifyJwt };
