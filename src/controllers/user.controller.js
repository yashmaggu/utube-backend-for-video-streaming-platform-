import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError } from "../utils/ApiError.js"
import { User } from  "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessandRefreshTokens=async(userId)=>{
  try{
    const existingUser=User.findById(userId);

    const accessTokens=existingUser.generateAccessTokens();
    const refreshTokens=existingUser.generateRefreshTokens();
      user.refreshTokens=refreshTokens;
      //save will also push other commands to be checked example password
      await user.save({validateBeforeSave:false});

    return {accessTokens,refreshTokens};
  }catch(error){
    throw new ApiError(500,"something went wrong while generating refresh and access tokens")
  }
}



const registeredUser=asyncHandler (async(req,res)=>{
  
  //get user from frontend
  const {fullName,email,username,password}=req.body;
  console.log(req.body);

  
  
  //validation (empty or not)
  if(
    [fullName,email,username,password].some((field)=>(field && field?.trim()===""))
  ){
    throw new ApiError(400,"Alll fields are required")
  }


  //check if already exist
  const existedUser=await User.findOne({username})
  if(existedUser){
    console.log(existedUser)
    throw new ApiError(409,"User email or username already exist ")
  }




  //check for avatar and images


  const avatarLocalPath=req.files?.avatar[0]?.path
  const coverImageLocalPath=req.files?.coverImage[0].path;
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
  }
console.log(req.files);


  //upload them to cloudinary 
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(400,"Avatar is required")
  }



  //create user object -create entry in Db
  const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  //remove pass and refresh token fild from response
  //check user creation -> by checking through the id created by mongo DB
  const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
  )
  console.log(createdUser);
  if(!createdUser){
    throw new ApiError(500,"Something went wrong")
  }

  //return res
  return res.status(201).json(
    new ApiResponse(200,createdUser,"Congrats User created success !!!!")
  )
}
)


const loginUser=asyncHandler(async(req,res)=>{
  //access the data from req.body
  //retrive username,password

  const {email,username,password}=req.body;
  //we require either of 2 for login 
  if(!username || !password){
    throw new ApiError(400,"username or email is required")
  }

  //finding the existing user
  const existingUser=await User.findOne({
    $or:[{username},{email}]
  })


  //check if user not found 
  if(!existingUser){
    throw new ApiError(404,"user not found ")
  }
  
  //checking if the password matches 
  const isPassValid=await existingUser.isPasswordCorrect(password);

  if(!isPassValid){
    throw new ApiError(401,"wrong Password")
  }


  //now we have accessed refresh tokens and access tokens 
  const {accessTokens,refreshTokens}=await generateAccessandRefreshTokens(existingUser._id);

  const loggedInUse=await User.findById(existingUser._id).select("-password -refreshTokens")

  //cookies 
// Purpose: The httpOnly attribute is used to prevent client-side scripts from accessing the cookie. This helps mitigate the risk of cross-site scripting (XSS) attacks.
// Value: When httpOnly is set to true, the cookie cannot be accessed via JavaScript (e.g., document.cookie).
  const options={
    httpOnly:true,
    secure:true
  }

  return res
        .status(200)
        .cookie("accessTokens",accessTokens,options)
        .cookie("refreshTokens",refreshTokens,options)
        
})

export { registeredUser ,loginUser };