import { Router } from "express";
import { loginUser, logout, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAvatar, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverImage",
            maxcount:1
        }
    ]),
    registerUser);


router.route('/login').post(loginUser);


// secured Routes

router.route("/logout").post(verifyJwt,logout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("change-current-password").post(verifyJwt,changeCurrentPassword)
router.route("current-user").get(verifyJwt,getCurrentUser)
router.route("update-account").patch(verifyJwt,getCurrentUser)
router.route("/avatar").patch(verifyJwt,upload.single('avatar'),updateAvatar)
router.route("channel/:username").get(verifyJwt,getUserChannelProfile)
router.route("/history").get(verifyJwt,getWatchHistory)







export default router;