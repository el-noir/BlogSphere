import { Router } from 'express';
import { registerUser, loginUser, logoutUser, profileUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
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

export default router;
