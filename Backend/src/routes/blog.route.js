
import { Router } from 'express';
import { createBlog } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'; // Assuming multer setup is in utils/multer.js

const router = new Router();

// Route to create a new blog post (Authenticated users only)
router.route("/create").post(
    (req, res, next) => {
        console.log('Create blog route hit!');
        next(); // Continue to the createBlog controller
    },
    verifyJWT, upload.single('coverImage'), createBlog);

export default router;
