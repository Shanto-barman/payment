const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN,
} = require("../../config/envConfig");
const sendMail = require("../../utils/sendMail");

exports.createUserService = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  const savedUser = await user.save();

  await sendMail({
    email: savedUser.email,
    subject: "Welcome to Our Platform 🎉",
    html: `<html>
    <body>
      <div style="max-width:500px;margin:auto;padding:20px;background:#f7f7f7;border-radius:10px;font-family:Arial">
        <h2 style="color:#333">Welcome, ${savedUser.name} 🎉</h2>
        <p style="color:#555;font-size:16px;line-height:1.6">
          We are excited to have you with us. Your account has been created successfully.
        </p>
        <p style="color:#555;font-size:16px;line-height:1.6">
          Feel free to explore our features and enjoy the experience.
        </p>
        <a href="#" style="display:inline-block;margin-top:20px;background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Go to Dashboard</a>
        <p style="margin-top:20px;color:#777;font-size:14px;text-align:center">
          If you need any help, just reply to this email.
        </p>
      </div>
    </body>
  </html>`,
  });

  const { password: _, ...userWithoutPass } = savedUser.toObject();
  return userWithoutPass;
};

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
