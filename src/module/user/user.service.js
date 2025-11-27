const User = require("./user.model");
const Session = require('./session.model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN,
} = require("../../config/envConfig");
const sendMail = require("../../utils/sendMail");

const ms = require("ms");
exports.registerUser = async (data) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        ...data,
        password: hashedPassword
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + ms(process.env.OTP_EXPIRE_TIME);

    newUser.otp = otp;
    newUser.otpExpiry = otpExpiry;

    await newUser.save();

    await sendMail({
        email: newUser.email,
        subject: "Your Verification OTP",
        message: `Your OTP is: ${otp}`
    });

    // Generate JWT token (just added)
    const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    // Return everything as before + token
    return {
        ...newUser.toObject(),  // সব আগের fields
        token                   // নতুন token
    };
};
// const ms = require("ms");

// exports.registerUser = async (data) => {
//     const { name, email, password } = data;

//     if (!name || !email || !password) {
//         throw new Error("All fields are required");
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) throw new Error("User already exists");

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//         ...data,
//         password: hashedPassword
//     });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     console.log("ENV:", process.env.OTP_EXPIRE_TIME);
//     console.log("ms convert:", ms(process.env.OTP_EXPIRE_TIME));

//     const otpExpiry = Date.now() + ms(process.env.OTP_EXPIRE_TIME);

//     newUser.otp = otp;
//     newUser.otpExpiry = otpExpiry;

//     await newUser.save();

//     await sendMail({
//         email: newUser.email,
//         subject: "Your Verification OTP",
//         message: `Your OTP is: ${otp}`
//     });

//     return newUser;
// };

// exports.registerUser = async (data) => {
//     const { name, email, password } = data;

//     if (!name || !email || !password) {
//         throw new Error("All fields are required");
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) throw new Error("User already exists");

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//         ...data,
//         password: hashedPassword
//     });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = Date.now() + ms(process.env.OTP_EXPIRE_TIME);

//     newUser.otp = otp;
//     newUser.otpExpiry = otpExpiry;

//     await newUser.save();

//     // Send OTP via email
//     await sendMail({
//         email: newUser.email,
//         subject: "Your Verification OTP",
//         message: `Your OTP is: ${otp}`
//     });

//     // Generate JWT token
//     const token = jwt.sign(
//         { userId: newUser._id, role: newUser.role },
//         JWT_SECRET,
//         { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
//     );

//     // Return user + token
//     return {
//         user: {
//             _id: newUser._id,
//             name: newUser.name,
//             email: newUser.email,
//             role: newUser.role,
//             isVerified: newUser.isVerified
//         },
//         token
//     };
// };


exports.loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn:ACCESS_TOKEN_EXPIRES_IN}
  );

  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn:REFRESH_TOKEN_EXPIRES_IN,
  });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user };
};

exports.logoutUser = async (userId) => {
  
    await Session.deleteMany({ userId });

    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return true;
};

exports.forgetPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // OTP expiry (environment value in minutes)
  const expiryMinutes = parseInt(process.env.OTP_EXPIRE_TIME || "5");
  const otpExpireTime = Date.now() + expiryMinutes * 60 * 1000;

  // Save OTP + expiry
  user.otp = otp;
  user.otpExpireTime = new Date(otpExpireTime);

  await user.save();

  // Send OTP email
  await sendMail({
    email: user.email,
    subject: "Your Password Reset OTP",
    message: `<html>

    <body>

      <div>

        <h2>Password Reset OTP</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in ${expiryMinutes} minutes.</p>

      </div>

    </body>

  </html>
    `,
  });

  return { message: "OTP sent successfully" };
};

exports.verifyOtpService = async (email, otp) => {
  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // 2. Check OTP
  if (!user.otp) throw new Error("OTP not generated");

  if (user.otp !== otp) throw new Error("Invalid OTP");

  // 3. Check expire time
  if (user.otpExpireTime < new Date()) {
    throw new Error("OTP expired");
  }

  // 4. Clear OTP after success
  user.otp = null;
  user.otpExpireTime = null;
  await user.save();

  return {
    success: true,
    message: "OTP verified successfully",
  };
};


exports.resetPasswordService = async (email, newPassword) => {
  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // 2. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. Update password and clear OTP fields
  user.password = hashedPassword;
  await user.save();

  return {
    success: true,
    message: "Password reset successfully",
  };
};



exports.getAllUsersService = async () => {
  return await User.find();
};

exports.getUserByIdService = async (id) => {
  return await User.findById(id).select("-password");
};

exports.getMeService = async (userId) => {
  return await User.findById(userId).select("-password");
};

exports.refreshTokenService = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn:ACCESS_TOKEN_EXPIRES_IN}
  );

  return newAccessToken;
};
