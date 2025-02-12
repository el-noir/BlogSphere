import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';

const router = new Router();

router.route("/register").post((req, res, next) => {
    console.log('Register route hit!');
    next(); // Continue to the registerUser controller
}, registerUser);

router.route("/login").post((req, res, next) => {
    console.log('Login route hit!');
    next(); // Continue to the loginUser controller
}, loginUser);

export default router;
