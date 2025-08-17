const validator = require("validator");

const validateLoginData = (req) => {
  const { emailId, password } = req.body;

  //Email related validations
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }

  //Password related validations
  if (password.length === 0) {
    throw new Error("Password is not valid!");
  }
};

const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    skills,
    gender,
    age,
  } = req.body;

  //Name related validations
  if (!firstName || !lastName) {
    throw new Error(
      "Either first name or last name is not valid!"
    );
  } else if (
    firstName.length < 4 ||
    firstName.length > 50
  ) {
    throw new Error(
      "First name should be 4-50 characters!"
    );
  }

  //Email related validations
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }

  //Password related validations
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "The Password is not strong!"
    );
  }

  //Skills related validations
  if (skills) {
    const skillsSet = new Set(
      skills.map((s) => s.toLowerCase())
    );
    if (skillsSet.size !== skills.length) {
      throw new Error(
        "Duplicate skills not allowed!"
      );
    }
    //validation on skills length
    if (skills.length > 10) {
      throw new Error(
        "Can't add more than 10 skills."
      );
    }

    //Gender related validations
    if (
      !["male", "female", "others"].includes(
        gender?.toLowerCase()
      )
    ) {
      throw new Error(
        "Gender can only be male, female or others."
      );
    }
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(
    req.body
  ).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateEditProfileData,
};
