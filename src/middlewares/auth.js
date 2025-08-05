const adminAuth = (req, res, next) => {
  //logic to check the auth of user
  console.log("Admin auth is getting checked!");

  const token = "xyz";

  const isAdminAuthorised = token === "xyz";
  if (!isAdminAuthorised) {
    console.log(`Your token is ${token}`);
    console.log(`Your token should be "xyz".`);

    res.status(401).send("Unauthorised access");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  //logic to check the auth of user
  console.log("User auth is getting checked!");

  const token = "xyz";

  const isAdminAuthorised = token === "xyz";
  if (!isAdminAuthorised) {
    console.log(`Your token is ${token}`);
    console.log(`Your token should be "xyz".`);

    res.status(401).send("Unauthorised access");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
