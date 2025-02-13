import { Router } from 'express';
import { registerUser, loginUser, logoutUser, profileUser, uploadAvatar, uploadCover } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';
const router = new Router();

router.route("/register").post((req, res, next) => {
    console.log('Register route hit!');
    next(); // Continue to the registerUser controller
}, registerUser);

router.route("/login").post((req, res, next) => {
    console.log('Login route hit!');
    next(); // Continue to the loginUser controller
}, loginUser);

router.route("/logout").post((req, res, next) => {
    console.log('Logout route hit!');
    next(); // Continue to the logoutUser controller

},verifyJWT, logoutUser);

router.route("/profile").get((req, res, next)=> {
  console.log("Profile route hit!")
  next(); // Continue to the profileUser controller

},verifyJWT, profileUser);

router.route("/profile/upload-profile").post(
    (req, res, next) => {
        console.log("Profile image upload route hit!")
        next(); // Continue to the uploadAvatar controller
    },
    verifyJWT, upload.single('avatar'), uploadAvatar);

// Cover image upload route
router.route("/profile/upload-cover").post(
    (req, res, next) => {
        console.log("Cover image upload route hit!")
        next(); // Continue to the uploadCover controller
    }
    ,verifyJWT, upload.single('coverImage'), uploadCover);

export default router;
