const validator = require("validator");

const signUpValidator = (req) => {
  const { firstName, lastName, email, password } = req;
  console.log(firstName,lastName,email,password)
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough!");
  }
};
const editValidator = (data) =>{
}

module.exports = {signUpValidator};
