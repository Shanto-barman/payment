const {
  registerUser,
  loginUserService,
  logoutUserService,
  getAllUserService,
  refreshTokenService,
  forgetPassword,
  verifyOtpService,
  resetPasswordService,
  updateUserService,
} = require('./user.service.js');

exports.register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully. OTP sent.",
            user
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.loginUser = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await loginUserService(req.body);
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.logoutUser = async (req, res) => {
    try {
        const userId = req.id; 
        console.log("UserId:", userId);

        await logoutUserService(userId);

        return res.status(200).json({
            success: true,
            message: "User logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.getAllUserController = async (req, res) => {
  try {
    const users = await getAllUserService();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.refreshTokenUser = async (req, res) => {
  try {
    const newAccessToken = await refreshTokenService(req.body.refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};


exports.forgetPassController = async (req, res) => {
  try {
    const { email } = req.body;
    await forgetPassword(email);
    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};

exports.verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    await verifyOtpService(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP Verified successfully",
    });
  } catch (error) {
    console.log("Verify OTP Error:", error);
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};


exports.resetPasswordController=async(req, res)=>{
  try {
    const {email, newPassword}=req.body;
  await resetPasswordService(email, newPassword);
  res.status(200).json({message:"Password chang` successfully"})
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: error.message });
  }
}


exports.updateUserController = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;

        const updatedUser = await updateUserService(
            userIdToUpdate,
            loggedInUser,
            req.body,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
