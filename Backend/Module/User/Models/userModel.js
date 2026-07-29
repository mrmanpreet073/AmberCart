import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    profilePic: {type:String, default:""},  // Cloudinary image url 
    profilePicPublicId: {type:String,  default:""},  // public id for deletion 
    email:{type:String , required:true, unique:true},
    password:{type:String , required:false ,default:null},
    googleId:   { type: String, default: null },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },
    token:{type:String,default:null},
    isVerified:{type:Boolean,default:false},
    isLoggedIn:{type:Boolean,default:false},
    otp:{type:String,default:null},
    optExpiry:{type:String,default:null},
    address:{type:String},
    city:{type:String},
    zipCode:{type:String},
    phoneNumber:{type:String}

},{timestamps:true})


export const User = mongoose.model("user",userSchema)