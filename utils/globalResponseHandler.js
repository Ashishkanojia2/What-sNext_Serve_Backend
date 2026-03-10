const successRes = (res, statusCode, message) => {
  res.status(statusCode).json({ success: true, message });
};
const successResSend = (res, statusCode, message , result) => {
  res.status(statusCode).json({ success: true, message, result });
};
  

const errorRes = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};

export { successRes , errorRes,successResSend };
