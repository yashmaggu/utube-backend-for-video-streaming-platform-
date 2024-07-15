import {v2 as cloudinary} from "cloudinary"
import fs from "fs"



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary=async(localFilePath)=>{
    try{
        //checking if localfilePath is empty or not 
        if(!localFilePath){
            console.log("localFilePath has created problem")
            return null
        }
        //file upload on cloudinary 
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file upload sucess !! 
        console.log("file Uploaded",response)
        // fs.unlinkSync(localFilePath);
        return response
    }catch(error){
        // unlike is an operation which we remove 
        //all the links with file and at the end delete it
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { uploadOnCloudinary };