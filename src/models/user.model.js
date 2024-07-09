import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email :{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    // we will use cloudinary to store Image and avatars
    avatar:{
        type:String ,
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

//step when we need to change or add the password act as middleware
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10)
    next();
})



userSchema.methods.isPasswordCorrect=async function(password){
    //bcrypt compare return value in booleans
    return await bcrypt.compare(password,this.password);
}


userSchema.methods.generateAccessTokens=async function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username :this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            //we can also mention the algorithm we want to use 
        }
    )
}

userSchema.methods.generateRefreshTokens=async function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default User=mongoose.model('User',userSchema)