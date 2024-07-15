import dotenv from "dotenv"

//always remmeber database is another country 
import express from "express"
import connectDB from "./db/index.js"
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
})







//as async operation sent a promise 
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT || 8000}`);
    });
  }).then(()=>{
    app.on('error', (error) => {
        console.error("Express server error:", error);
        // Additional error handling or cleanup logic can go here
      });      
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process if database connection fails
  });







// ;(async ()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        //if there is any issue in talking with the database
//        app.on("error",(error)=>{
//         console.log("error in talking with the database",error)
//         throw error;
//        })

//        app.listen(process.env.PORT ,()=>{
//         console.log(`Listening at Port ${process.env.PORT}`)
//        })
//     }catch(error){
//         console.error("Error : ",error)
//         throw error
//     }

// })()