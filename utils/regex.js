const emailRegex = (value) => {
  if (!value) return console.log("Error in check email Regex");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};
const passwordRegex = (value) => {
  if (!value) return console.log("Error in check password Regex");
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(value);
};

export { emailRegex, passwordRegex };
