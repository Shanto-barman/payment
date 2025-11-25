const dotenv = require('dotenv');
dotenv.config();

exports.MONGO_URI = process.env.MONGO_URI;
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
exports.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
exports.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;


exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_PORT = process.env.EMAIL_PORT;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.EMAIL_FROM = process.env.EMAIL_FROM;

exports.OTP_EXPIRE_TIME = process.env.OTP_EXPIRE_TIME;
