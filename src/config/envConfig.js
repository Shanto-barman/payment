const dotenv = require('dotenv');
dotenv.config();

exports.MONGO_URI = process.env.MONGO_URI;
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ACCESS_TOKEN_EXPIRE_IN = process.env.ACCESS_TOKEN_EXPIRE_IN;
exports.REFRESH_TOKEN_EXPIRE_IN = process.env.REFRESH_TOKEN_EXPIRE_IN;
STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
exports.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;