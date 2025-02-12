import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = new Router();

router.route("/register").post((req, res, next) => {
    console.log('Register route hit!');
    next(); // Continue to the registerUser controller
}, registerUser);

export default router;
