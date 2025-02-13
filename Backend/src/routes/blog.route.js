import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createBlog } from '../controllers/blog.controller.js';

const blogRouter = new Router();

blogRouter.route('/').post(verifyJWT, createBlog);

export default blogRouter;
