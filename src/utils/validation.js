const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  } else if (firstName.length < 4 && lastName.length < 4) {
    throw new Error("firstName & lastName must be in 4 to 50 car");
  }
};
module.exports = validateSignupData;
