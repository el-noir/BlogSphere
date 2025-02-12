import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log("Request received at /api/v1/users/register with body:", req.body);

    const { fullName, email, password, username } = req.body;
    const requiredFields = { fullName, email, password, username };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
            console.error(`${key} is required`);
            throw new ApiError(`${key} is required`, 400);
        }
    }

    console.log("Fields validated");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error("Invalid email format");
        throw new ApiError("Invalid email format", 400);
    }

    // Validate username length
    if (username.length < 3) {
        console.error("Username must be at least 3 characters long");
        throw new ApiError("Username must be at least 3 characters long", 400);
    }

    console.log("Validations completed");

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        console.error("User already exists with the provided email or username");
        throw new ApiError("Email or username already exists", 409);
    }

    try {
        console.log("Creating user in database...");
        const user = await User.create({
            fullName,
            email,
            username: username.toLowerCase(),
            password,
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if (!createdUser) {
            console.error("Failed to create user");
            throw new ApiError("Failed to create user", 500);
        }

        console.log("User created successfully:", createdUser);
        return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Successfully"));
    } catch (error) {
        console.error("Error during user creation:", error);
        throw new ApiError("Failed to create user", 500, error.message);
    }
});

export { registerUser };
