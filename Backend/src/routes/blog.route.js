import { Router } from 'express';
import { createBlog, getBlogsByUser } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = new Router();

// Route to create a new blog post (Authenticated users only)
router.route("/create").post(
    (req, res, next) => {
        console.log('Create blog route hit!');
        next(); // Continue to the createBlog controller
    },
    verifyJWT, upload.single('coverImage'), createBlog);

// Route to get all blogs by the logged-in user
router.route("/user-blogs").get(
    (req, res, next) => {
        console.log('Get user blogs route hit!');
        next(); // Continue to the getBlogsByUser controller
    }  ,
    verifyJWT, getBlogsByUser);

export default router;
