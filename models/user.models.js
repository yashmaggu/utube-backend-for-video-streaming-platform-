import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true  
    },
    fullName:{
      type:String,
      required:true,  
    },
    avatar{

    },
    password:{
        type:String,    
        required:true
    }

},{timestamps:true})
