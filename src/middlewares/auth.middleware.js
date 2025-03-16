import { jsonwebtoken as jwt } from "jsonwebtoken";
import { asyncHandler } from "../utlis/asyncHandler";
import { ApiError } from "../utlis/ApiError";
import { User } from "../models/user.model";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    let verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

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
