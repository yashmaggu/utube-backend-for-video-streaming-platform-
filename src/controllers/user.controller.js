import { asyncHandler } from "../utils/asyncHandler.js";


const registeredUser=async (req,res)=>{
    console.log(req.body);
    res.status(200).json({
        message:"ok"
    })
}


export { registeredUser };