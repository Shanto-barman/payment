const {
  createUserService,
  loginUserService,
  getAllUsersService,
  getUserByIdService,
  getMeService,
  refreshTokenService,
  forgetPassword,
  verifyOtpService,
  resetPasswordService
} = require('./user.service');

exports.createUser = async (req, res) => {

  const data=req.body;


  try {
    const user = await createUserService(data);

    console.log("Controller value",user)

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
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

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.showUser = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user.id); // only id
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
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


exports.forgetPassController=async(req,res)=>{
  try {
    const {email}=req.body;
  await forgetPassword(email);
  res.status(200).json({message:"OTP sent successfully"})
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: error.message });
  }
}


exports.verifyOTPController=async(req,res)=>{
  try {
    const {email, otp}=req.body;
  await verifyOtpService(email, otp);
  res.status(200).json({message:"OTP Verified successfully"})
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: error.message });
  }
}




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
