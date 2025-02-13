import { Blog } from '../models/blog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a blog post
export const createBlog = asyncHandler(async (req, res) => {
    // Validate the input
    const { title, content } = req.body;
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    // Check if there's a cover image file
    let coverImageUrl = req.body.coverImage || null;

    if (req.file) {
        // If a cover image is uploaded, handle it via Cloudinary
        const uploadResponse = await uploadOnCloudinary(req.file.path);
        if (!uploadResponse) {
            throw new ApiError(500, "Error uploading cover image");
        }
        coverImageUrl = uploadResponse.url;
    }

    // Create the blog post
    const newBlog = await Blog.create({
        title,
        content,
        coverImage: coverImageUrl,
        author: req.user._id, // Make sure to set the author as the logged-in user
    });

    console.log(res.body);

    // Return the success response
    res.status(201).json({
        success: true,
        blog: newBlog,
    });
});
