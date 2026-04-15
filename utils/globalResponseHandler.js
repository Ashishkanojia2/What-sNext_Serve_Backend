const successRes = (res, status, message) => {
  res.status(status).json({ status, success: true, message });
};
const successReSend = (res, status, message, result) => {
  res.status(status).json({ status, success: true, message, result });
};

const errorRes = (res, status, message) => {
  res.status(status).json({ status, success: false, message });
};

export { successRes, errorRes, successReSend };
  