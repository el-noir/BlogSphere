import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        }
        ,
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        avatar: { //cloudinary url
            type: String,
            required: true,
        },
        coverImage: { 
            type: String,
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        password: {
            type: String,
            required : [true, "Password is required"]
        },
        refreshToken: {
            type : String
        }
       
    },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    // hash the password before saving to the database
   this.password = await bcrypt.hash(this.password, 10)
   next();
})

UserSchema.methods.isPasswordCorrect = async function(password) {
return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
   )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }

    );
};

export const  User = mongoose.model('User', UserSchema);