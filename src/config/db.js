const mongoose = require('mongoose');
const { MONGO_URI } = require('./envConfig');
require('dotenv').config();

const connectDB = async()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully')
    }catch(error){
        console.log('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB; 