const successRes = (res, statusCode, message) => {
  res.status(statusCode).json({ status: statusCode, success: true, message });
};
const successResSend = (res, statusCode, message, result) => {
  res
    .status(statusCode)
    .json({ status, statusCode, success: true, message, result });
};

const errorRes = (res, statusCode, message) => {
  res.status(statusCode).json({ status: statusCode, success: false, message });
};

export { successRes, errorRes, successResSend };
