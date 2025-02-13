import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
       return {accessToken, refreshToken}
    } catch(error){
        console.error("Error generating access and refresh tokens:", error.message);
        throw new ApiError("Error generating access and refresh tokens", 500);
    }
}

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

const loginUser = asyncHandler(async(req, res) => {
    console.log("Request received at /api/v1/users/login with body:", req.body);

    const {email, password} = req.body

    if(!email){
        throw new ApiError("Please provide email", 400)
    }

    const user = await User.findOne({$or: [{email}]})

    if(!user){
        throw new ApiError("User not found", 401)
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError("Password is not correct", 401)
    }

    // generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    // send access and refresh token as cookie
    const loggedIn = await User.findById(user._id)
    .select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
     new ApiResponse(
       200,
       {
         user: loggedIn, accessToken,
         refreshToken
       },
       "User logged in successfully"
     )
   )
})

const logoutUser = asyncHandler(async(req, res) => {
    console.log("Request received at /api/v1/users/logout");
    await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            refreshToken: undefined
          }
        },
        {
          new: true,
        }
       )
    
    // send access and refresh token as cookie
    const options = {
      httpOnly: true,
      secure: true,
    }
  
    return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(
    new ApiResponse(
      200, {}, "User logged Out"
    )
   )
  })

  const profileUser = asyncHandler(async (req, res, next) => {
    console.log("Fetching user profile...");

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    // Fetch user profile, excluding sensitive fields
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Respond with user profile data
    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const uploadResponse = await uploadOnCloudinary(req.file.path);

    if (!uploadResponse) {
        throw new ApiError(500, "Error uploading avatar");
    }

    // Update user's avatar URL in the database
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.avatar = uploadResponse.url;  // Assuming you store the avatar URL in the user's model
    await user.save();

    res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        avatarUrl: uploadResponse.url
    });
});

// Upload Cover
 const uploadCover = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const uploadResponse = await uploadOnCloudinary(req.file.path);

    if (!uploadResponse) {
        throw new ApiError(500, "Error uploading cover");
    }

    // Update user's cover URL in the database
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.coverImage = uploadResponse.url;  // Assuming you store the cover URL in the user's model
    await user.save();

    res.status(200).json({
        success: true,
        message: "Cover image uploaded successfully",
        coverUrl: uploadResponse.url
    });
});

export { registerUser, loginUser, logoutUser, profileUser, uploadAvatar, uploadCover} ;
