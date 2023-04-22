const {
  registerNewUser,
  generateNewAccessToken,
  logoutUser,
  loginUser,
} = require("../controllers/user.controllers");

const userRouter = require("express").Router();

userRouter.post("/register", registerNewUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/refresh-token", generateNewAccessToken);

module.exports = { userRouter };
