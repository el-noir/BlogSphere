import { Router } from 'express';
import { createBlog, getBlogsByUser, getBlogById, updateBlog, deleteBlog } from '../controllers/blog.controller.js';
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
    },
    verifyJWT, getBlogsByUser);

// Route to get a blog by ID
router.route('/:id').get(
    (req, res, next) => {
        console.log('Get blog by ID route hit!');
        next(); // Continue to the getBlogById controller
    },
    verifyJWT, getBlogById);

// Route to update a blog (only the author can update)
router.route('/:id').put(
    (req, res, next) => {
        console.log('Update blog route hit!');
        next(); // Continue to the updateBlog controller
    },
    verifyJWT, updateBlog);

// Route to delete a blog (only the author can delete)
router.route('/:id').delete(
    (req, res, next) => {
        console.log('Delete blog route hit!');
        next(); // Continue to the deleteBlog controller
    },
    verifyJWT, deleteBlog);

export default router;
