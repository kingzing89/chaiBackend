import { Router } from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controller.js";
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

router.route("/logout").post(verifyJwt,logout)





export default router;