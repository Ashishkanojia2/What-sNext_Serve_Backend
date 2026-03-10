const successRes = (res, statusCode, message) => {
  res.status(statusCode).json({ success: true, message });
};

const errorRes = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};

export { successRes , errorRes };
