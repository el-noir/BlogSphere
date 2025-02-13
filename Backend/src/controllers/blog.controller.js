import { Blog } from '../models/blog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a blog post
const createBlog = asyncHandler(async (req, res) => {
    console.log("Create Blog Controller: Request body", req.body);
    
    const { title, content } = req.body;
    if (!title || !content) {
        console.error("Error: Title and content are required");
        throw new ApiError(400, "Title and content are required");
    }

    let coverImageUrl = req.body.coverImage || null;

    if (req.file) {
        console.log("Uploading cover image...");
        const uploadResponse = await uploadOnCloudinary(req.file.path);
        if (!uploadResponse) {
            console.error("Error: Failed to upload cover image");
            throw new ApiError(500, "Error uploading cover image");
        }
        coverImageUrl = uploadResponse.url;
        console.log("Cover image uploaded successfully:", coverImageUrl);
    }

    console.log("Creating new blog post...");
    const newBlog = await Blog.create({
        title,
        content,
        coverImage: coverImageUrl,
        author: req.user._id, 
    });

    console.log("New blog created:", newBlog);

    res.status(201).json({
        success: true,
        blog: newBlog,
    });
});

// Get all blogs by the logged-in user
const getBlogsByUser = asyncHandler(async (req, res) => {
    console.log("Get Blogs By User Controller: Fetching blogs for user", req.user._id);

    const blogs = await Blog.find({ author: req.user._id });
    if (!blogs || blogs.length === 0) {
        console.error("Error: No blogs found for this user");
        throw new ApiError(404, "No blogs found for this user");
    }

    console.log("Blogs found:", blogs);

    res.status(200).json({
        success: true,
        blogs,
    });
});

// Get a blog by ID
const getBlogById = asyncHandler(async (req, res) => {
    console.log("Get Blog By ID Controller: Fetching blog with ID", req.params.id);

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        console.error("Error: Blog not found");
        throw new ApiError(404, "Blog not found");
    }

    console.log("Blog found:", blog);

    res.status(200).json({
        success: true,
        blog,
    });
});

// Update a blog
const updateBlog = asyncHandler(async (req, res) => {
    console.log("Update Blog Controller: Updating blog with ID", req.params.id);

    const { title, content, coverImage } = req.body;
    if (!title || !content) {
        console.error("Error: Title and content are required for update");
        throw new ApiError(400, "Title and content are required");
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        console.error("Error: Blog not found");
        throw new ApiError(404, "Blog not found");
    }

    if (blog.author.toString() !== req.user._id.toString()) {
        console.error("Error: Unauthorized to update this blog");
        throw new ApiError(403, "You are not authorized to update this blog");
    }

    console.log("Blog found, updating...");
    blog.title = title;
    blog.content = content;
    blog.coverImage = coverImage || blog.coverImage;

    const updatedBlog = await blog.save();
    console.log("Blog updated:", updatedBlog);

    res.status(200).json({
        success: true,
        blog: updatedBlog,
    });
});


export { createBlog, getBlogsByUser, getBlogById, updateBlog, deleteBlog };
