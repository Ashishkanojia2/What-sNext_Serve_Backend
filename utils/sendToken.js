export const  sendToken = (res, user, statusCode = 200, message = "") => {
  const token = user.getJWTToken();

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  const expiresInMinutes = Number(process.env.JWT_TOKEN_EXPIRE) || 60;
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + expiresInMinutes * 24 * 60 * 60 * 1000),
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      result: { user: userData },
    });
};
