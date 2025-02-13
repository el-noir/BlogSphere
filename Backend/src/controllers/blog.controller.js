import { Blog } from '../models/blog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const createBlog = asyncHandler(async (req, res) => {
    const { title, content, coverImage } = req.body;
    const newBlog = await Blog.create({
        title,
        content,
        coverImage,
        author: req.user._id
    });
    res.status(201).json({ success: true, blog: newBlog });
});

export {createBlog}