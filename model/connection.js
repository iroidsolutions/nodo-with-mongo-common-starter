import mongoose from "mongoose"
require("dotenv").config();

exports.mongoConnection = () => {
    try{
        mongoose.set("strictQuery",false);
        mongoose.connect(process.env.MONGO_DB_URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        .then(()=>{
            console.log("Connection Sucessfull")
        })
        .catch((err)=>{
            console.log("MongoDB Databse connection error",err)
        })
    }catch(e){
        console.log("Mongodb Connection error")
    }
}