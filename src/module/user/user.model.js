const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{type:String,requird:true},
    profilePic:{type:String,default:""},
    profilePicPublicId:{type:String,default:""},

    Username:{type:String},
    email:{type:String},
    password:{type:String},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token:{type:String, default:null},
    isVerified:{type:Boolean, default:false},
    isLoggedIn:{type:Boolean, default:false},
    otp:{type:String, default:null},
    otpExpiry: { type: Number, default: null },
    address:{type:String},
    country:{type:String},
    city:{type:String},
    zipCode:{type:String},
    phoneNo:{type:String},
}, { timestamps: true});

const User = mongoose.model('User', UserSchema);
module.exports = User;