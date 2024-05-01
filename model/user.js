
import mongoose from "mongoose";


const userSchema = mongoose.Schema({
  firstname : {
        type : String,
        trim : true
    },
    lastname : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        trim : true
    },
    countrycode : {
        type : String,
        trim : true
    },
    mobilenumber : {
        type : String,
        trim : true
    },
    zipcode : {
        type : String,
        trim : true
    },
    password : {
        type : String,
        trim : true
    },
    location :{
      type : String
    },
    lat: {
      type : String,
    },
    long :{
      type : String
    },
    termsAndPolicy : {
        type : Boolean,
        trim : true
    },
    refKey: {
        type: Boolean,
        default: false,
      },
      profileImage : {
        type : String,
        default : null
      },
      isVerify : {
        type : Boolean,
        default : false
      },
   
      
     
},

{
    timestamps : true
})

const User  = mongoose.model('user',userSchema);

export default User