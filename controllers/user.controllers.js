const { User } = require("../models/user.model");
const { Blacklist } = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerNewUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserPresent = await User.findOne({ email });

    // User already present in database.
    if (isUserPresent) {
      return res
        .status(400)
        .send({ msg: "Email already taken, try another email or login" });
    }

    // Hash the password.
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.send({ msg: "Signup successful", user: newUser });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserPresent = await User.findOne({ email });

    // User not present in the database.
    if (!isUserPresent)
      return res.status(400).send({ msg: "Not a user, please signup" });

    // Password verification
    const isPasswordCorrect = bcrypt.compareSync(
      password,
      isUserPresent.password
    );

    if (!isPasswordCorrect)
      return res.status(400).send({ msg: "Wrong credentials" });

    // Generating access token
    const accessToken = jwt.sign(
      { userId:isUserPresent._id, role: isUserPresent.role },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
    );

    // Generating refresh token
    const refreshToken = jwt.sign(
      { userId:isUserPresent._id, role: isUserPresent.role },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY }
    );

    // Storing tokens in cookies.
    res.cookie("JAA_access_token", accessToken, { maxAge: 1000 * 60 * 5 });
    res.cookie("JAA_refresh_token", refreshToken, { maxAge: 1000 * 60 * 6 });

    res.status(200).send({ msg: "Login success" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { JAA_access_token, JAA_refresh_token } = req?.cookies;
    if (!JAA_access_token || !JAA_refresh_token)
      return res.status(400).send({ msg: "Unauthorized!" });

    const blacklistAccessToken = new Blacklist({ token: JAA_access_token });
    const blacklistRefreshToken = new Blacklist({ token: JAA_refresh_token });

    await blacklistAccessToken.save();
    await blacklistRefreshToken.save();

    // Clearing the tokens from cookies
    res.clearCookie("JAA_access_token");
    res.clearCookie("JAA_refresh_token");

    res.status(200).send({ msg: "Logout successful." });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const generateNewAccessToken = async (req, res) => {
  console.log(req.cookies.JAA_refresh_token)
  try {
    const JAA_refresh_token =
      req?.cookies?.JAA_refresh_token;

    // Check if token blacklisted
    const isTokenBlacklisted = await Blacklist.findOne({
      token: JAA_refresh_token,
    });

    if (isTokenBlacklisted)
      return res.status(400).send({ msg: "Please login." });

    // Check if token is expired or not.
    const isTokenValid = jwt.verify(
      JAA_refresh_token,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
    if (!isTokenValid)
      return res.status(400).send({ msg: "Please login agian." });

    const newAccessToken = jwt.sign(
      { userId:isTokenValid._id, role: isTokenValid.role },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
    );

    // Set in cookie again or send in response.
    res.cookie("JAA_access_token", newAccessToken);

    res.status(200).send({ msg: "Token generated.", newAccessToken });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {
  registerNewUser,
  loginUser,
  logoutUser,
  generateNewAccessToken,
};
